const electron = require("electron");
const {app,BrowserWindow} = electron;
// require("./Modules/streamHandler");

let mainWindow;

app.on("ready",()=>{
   mainWindow = new BrowserWindow({show:false});
   mainWindow.loadURL("file://"+__dirname+"/UI/index.html");
   mainWindow.on("ready-to-show",()=>mainWindow.show());
});

app.on("window-all-close",()=>{
   app.exit();
});