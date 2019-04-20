const chatbox = document.querySelector(".chat");
const handle = document.querySelector(".chat__handle");

// chatbox variables
const chatInput = document.getElementById("message-input");
const nameInput = document.querySelector("#name-input");
const sendBtn = document.querySelector("#send");
const chatList = document.getElementById("messages");
const feedback = document.getElementById("feedback");
const moneyLabel = document.querySelector(".money");
const moneyButton = document.querySelector(".money-button");
const socket = io();

handle.addEventListener("click", () => {
  chatbox.classList.toggle("chatopen");
});

moneyLabel.innerHTML = "$10.000";

function messageTime() {
  var date = new Date();

  var hour = date.getHours();
  hour = (hour < 10 ? "0" : "") + hour;

  var min = date.getMinutes();
  min = (min < 10 ? "0" : "") + min;

  return hour + ":" + min;
}

sendBtn.addEventListener("click", function() {
  socket.emit("message", {
    name: nameInput.value,
    message: chatInput.value,
    time: messageTime()
  });
  chatInput.value = "";
});

chatInput.addEventListener("keypress", function() {
  socket.emit("typing", nameInput.value);
});

socket.on("message", function(msg) {
  let listItem = document.createElement("li");
  feedback.innerHTML = "";
  listItem.textContent = msg.time + " " + msg.name + ": " + msg.message;
  chatList.append(listItem);
});

// socket.on("buy", function(data) {
//   moneyLabel.innerHTML = "$" + data;
// });

// socket.on("users", function(data) {
//   // document.querySelector("#userCount").innerHTML =
//   //   "Aantal personen online: " + data;
// });
socket.on("typing", function(data) {
  feedback.innerHTML = data + " is typing...";
});
