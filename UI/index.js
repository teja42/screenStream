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
   ss(socket).emit('startStream');
   ss(socket).on('startStream',(stream)=>{
      console.log(stream);
      $("#streamPlayer").src = window.URL.createObjectURL(stream);
   });
   // $("#streamPlayer").src = window.URL.createObjectURL(stream);
   socket.on("newStreamBlob",(blob)=>{
      // return console.log(blob);
      // $("#streamPlayer").src = window.URL.createObjectURL(new Blob([blob]));
   });
}

