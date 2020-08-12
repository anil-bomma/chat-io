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
  feedback.innerHTML = "";
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

message.addEventListener("keypress", function () {
  socket.emit("typing", handle.value);
});

socket.on("typing", function (data) {
  feedback.innerHTML = "<p><em>" + data + " is typing a message...</em></p>";
});

message.addEventListener("keydown", function (event) {
  if (event.which === 13 && event.shiftKey == false) {
    socket.emit("chat", {
      message: message.value,
      handle: handle.value,
    });
    message.value = "";
  }
});

// disable handle so that user cannot chage there name again
function disableHandler() {
  handle.disabled = true;
  handle.style = "cursor: not-allowed;";
}

socket.on("sendToAllUsers", function (data) {
  output.innerHTML =
    "<p><strong>" +
    data.handle +
    ": </strong>" +
    data.message +
    "</p>" +
    output.innerHTML;
});
