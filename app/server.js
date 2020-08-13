const express = require("express");
const socket = require("socket.io");

// starting node server on port 3000
const app = express();
app.use(express.static("public"));
const server = app.listen(3000, () => {
  console.info("Backend server running on port: 3000");
});

// global variables
var usersCount = 0;
var activeChatUser = [];
var activeChatObj = {};

// starting socket later will communicate with client by passing node server
const io = socket(server);

io.on("connect", () => {
  ++usersCount;
  console.log("----socket init function executed for each user");
});

io.on("connection", (socket) => {
  console.log("Total online users: ", usersCount);

  // sending userlist every time when new user is connected
  io.sockets.emit("activeUsers", { usersCount, activeChatUser });

  // when client emit the chat, consume it and resend back to all the users
  socket.on("chat", function (data) {
    if (activeChatUser.indexOf(data.handle) < 0) {
      activeChatUser.push(data.handle);
      activeChatObj[socket.id] = data.handle;
    }
    io.sockets.emit("activeUsers", { usersCount, activeChatUser });
    io.sockets.emit("sendToAllUsers", data);
  });

  // if user is disconneted
  socket.on("disconnect", () => {
    --usersCount;
    console.log("Total online users: ", usersCount);
    let index = activeChatUser.indexOf(activeChatObj[socket.id]);
    activeChatUser.splice(index, 1);
    io.sockets.emit("activeUsers", { usersCount, activeChatUser });
  });

  // boardcasting event when user is typing
  socket.on("typing", function (data) {
    socket.broadcast.emit("typing", data);
  });
});
