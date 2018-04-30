var io = require('socket.io').listen(4255);
var ss = require('socket.io-stream');
const {desktopCapturer} = require('electron');
const crypto = require("crypto");

const PASS = crypto.randomBytes(32);

function handleStream (stream) {
  const video = document.querySelector('video');
  video.srcObject = stream;
  video.onloadedmetadata = (e) => video.play();
}

function handleError (e) {
  console.log(e);
}

function aesDecrypt(text,pass) {
  let textParts = text.split(':');
  let iv = new Buffer(textParts.shift(), 'hex');
  let encryptedText = new Buffer(textParts.join(':'), 'hex');
  let decipher = crypto.createDecipheriv('aes-256-cbc', pass, iv);
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
 }

io.on('connection', function(socket) { // Listen

  ss(socket).on('startStream', function(stream) { //Handle stream request
    desktopCapturer.getSources({types: ['window', 'screen']}, (error, sources) => {
      if (error) throw error;
      for (let i = 0; i < sources.length; ++i) {
        if (sources[i].name === 'Entire screen') {
          navigator.mediaDevices.getUserMedia({
            audio: false,
            video: {
              mandatory: {
                chromeMediaSource: 'desktop',
                chromeMediaSourceId: sources[i].id,
                minHeight: 720,
                maxHeight: 720
              }
            }
          })
          .then((stream2) =>{
				console.log(stream2);
				ss(socket).emit("startStream",stream2);
          })
          .catch((e) => handleError(e))
          return
        }
      }
    });
  });

});
