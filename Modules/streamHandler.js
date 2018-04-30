var io = require('socket.io').listen(4255);
var ss = require('socket.io-stream');
const {desktopCapturer} = require('electron');
const crypto = require("crypto");

const PASS = crypto.randomBytes(32);

io.on('connection', function(socket) { // Listen

	let rtc = new RTCPeerConnection();

	socket.on("sdp",(x)=>{
		rtc.setRemoteDescription(x);
		rtc.createAnswer().then((x)=>{
			socket.emit("sdp",x);
			
			desktopCapturer.getSources({types: ['window', 'screen']}, (error, sources) => {
				if (error) throw error;
				for (let i = 0; i < sources.length; ++i) {
				  if (sources[i].name === 'Entire screen') {
					 navigator.mediaDevices.getUserMedia({
						audio: false,
						video: {
						  mandatory: {
							 chromeMediaSource: 'desktop',
							 chromeMediaSourceId: sources[i].id
						  }
						}
					})
					 .then((stream2) =>{
						rtc.addStream(stream2);
					 })
					 .catch((e) => console.log("Error from screen query : ",e))
				  }
				}
			 });

		});
	});

});

/*


*/
