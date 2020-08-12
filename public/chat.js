var socket = io.connect("http://localhost:3000");

// Query DOM
var active = document.getElementById("active"),
  message = document.getElementById("message"),
  handle = document.getElementById("handle"),
  btn = document.getElementById("send"),
  output = document.getElementById("output"),
  feedback = document.getElementById("feedback");

// Listen for socket events from server
socket.on("activeUsers", function (data) {
  console.log(data);
  active.innerHTML = `<small id="active" class="text-secondary">Active Users: ${
    data.usersCount
  }, <br/> Chat Users: ${
    data.activeChatUser.join(", ") || "No active user"
  }</small>`;
});

// Emit events when user send it from browser
btn.addEventListener("click", function () {
  socket.emit("chat", {
    message: message.value,
    handle: handle.value,
  });
  message.value = "";
});

socket.on("sendToAllUsers", function (data) {
  output.innerHTML =
    "<p><strong>" +
    data.handle +
    ": </strong>" +
    data.message +
    "</p>" +
    output.innerHTML;
});


