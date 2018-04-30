const {ipcRenderer} = require("electron");
const ss = require("socket.io-stream");

const $ = (x)=>document.querySelector(x);
require("../Modules/streamHandler");
let PASS;

ipcRenderer.on("getPass",(pass)=>{
   $("#pass").innerHTML = pass;
   PASS = pass;
});

$("#getBtn").onclick = ()=>{
   let address = `http://${$('#getIp').value}:4255`;
   var socket = io.connect(address);
   
   let rtc = new RTCPeerConnection();
   rtc.createOffer().then(x=>{
      rtc.setLocalDescription(x).then(()=>{
         socket.emit("sdp",x);
      });
   });

   socket.on("sdp",(x)=>{
      rtc.setRemoteDescription(x);
   });

   rtc.onaddstream((stream)=>{
      $("#streamPlayer").src = window.URL.createObjectURL(stream);
   });

}

