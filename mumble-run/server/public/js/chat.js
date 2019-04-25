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
let users = document.querySelector("#userCount");

//playgame variables
const startButton = document.querySelector(".test");
const raceTrack = document.querySelector(".content__track");
const userName = document.querySelector(".username");
const rappers = document.querySelectorAll(".rapper input");
const items = document.querySelectorAll(".content__rapper");
let priceMoney = document.querySelector(".content__pricemoney");
let timerblock = document.querySelector(".content__timer");

let lilpumpLane = document.getElementById("lilpump");
let cardiBLane = document.getElementById("cardib");
let sixnineLane = document.getElementById("sixnine");
let tentacionLane = document.getElementById("tentacion");
let twentyoneLane = document.getElementById("twenty");

let sixnineTweet = document.querySelector(".sixnine-tweet");
let pumpTweet = document.querySelector(".pump-tweet");
let tentacionTweet = document.querySelector(".tentacion-tweet");
let savageTweet = document.querySelector(".savage-tweet");
let cardibTweet = document.querySelector(".cardib-tweet");

let pumpLength = "";
let cardiBLength = "";
let twentyoneLength = "";
let tentacionLength = "";
let sixnineLength = "";

let lilpumpInner = ``;
let cardiBInner = ``;
let sixnineInner = ``;
let tentacionInner = ``;
let twentyoneInner = ``;

const socket = io({ transports: ["websocket"], upgrade: false });

let startMoney = 1000;
moneyLabel.innerHTML = "$" + startMoney.toString();

rappers.forEach(function(e) {
  e.addEventListener("click", function(e) {
    let rapperChoice = e.target.value;

    items.forEach(function(e) {
      e.classList.add("disabled");
    });

    startMoney = startMoney - 100;
    if (startMoney > 0) {
      moneyLabel.innerHTML = "$" + startMoney.toString();
    } else {
      moneyLabel.innerHTML = "out of funds";
      console.log("out of money");
    }

    socket.emit("gamble", {
      choice: rapperChoice,
      bet: 100
    });
  });
});

handle.addEventListener("click", () => {
  chatbox.classList.toggle("chatopen");
});

function messageTime() {
  var date = new Date();

  var hour = date.getHours();
  hour = (hour < 10 ? "0" : "") + hour;

  var min = date.getMinutes();
  min = (min < 10 ? "0" : "") + min;

  return hour + ":" + min;
}

// Event handlers to server
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

// events after server return
socket.on("message", function(msg) {
  let listItem = document.createElement("li");
  feedback.innerHTML = "";
  listItem.textContent = msg.time + " " + msg.name + ": " + msg.message;
  chatList.append(listItem);
});

//if people have gambled on the rappers
socket.on("gamble", function(data) {});

socket.on("timer", function(data) {
  timerblock.innerHTML = data;
  if (data === 30) {
    timerblock.innerHTML = "The game has started";
    items.forEach(function(e) {
      e.classList.add("disabled");
    });
  }
});

// shows the race data
socket.on("racing", function(data) {
  items.forEach(function(e) {
    e.classList.add("disabled");
  });

  pumpLength = data.LilPump.length;
  cardiBLength = data.cardib.length;
  twentyoneLength = data.twentyone.length;
  tentacionLength = data.tentacion.length;
  sixnineLength = data.sixnine.length;
  lilpumpInner = `
  <div style="transition: 0.4s; transform: translateX(${pumpLength}00%)">
    <img src="./img/lilpump.png" alt="">
  </div>
  `;

  cardiBInner = `
  <div style="transition: 0.4s; transform: translateX(${cardiBLength}00%)">
    <img src="./img/cardib.png" alt="">
  </div>
  `;

  sixnineInner = `
  <div style="transition: 0.4s; transform: translateX(${sixnineLength}00%)">
    <img src="./img/sixnine.png" alt="">
  </div>
  `;

  tentacionInner = `
  <div style="transition: 0.4s; transform: translateX(${tentacionLength}00%)">
    <img src="./img/tentacion.png" alt="">
  </div>
  `;

  twentyoneInner = `
  <div style="transition: 0.4s; transform: translateX(${twentyoneLength}00%)">
    <img src="./img/21.png" alt="">
  </div>
  `;

  sixnineTweet.innerHTML = sixnineLength;
  pumpTweet.innerHTML = pumpLength;
  tentacionTweet.innerHTML = tentacionLength;
  savageTweet.innerHTML = twentyoneLength;
  cardibTweet.innerHTML = cardiBLength;

  lilpumpLane.innerHTML = lilpumpInner;
  cardiBLane.innerHTML = cardiBInner;
  sixnineLane.innerHTML = sixnineInner;
  tentacionLane.innerHTML = tentacionInner;
  twentyoneLane.innerHTML = twentyoneInner;

  if (
    pumpLength >= 10 ||
    cardiBLength >= 10 ||
    twentyoneLength >= 10 ||
    tentacionLength >= 10 ||
    sixnineLength >= 10
  ) {
    let winnerArr = [
      { name: "Lil pump", length: pumpLength },
      { name: "6ix9ine", length: sixnineLength },
      { name: "XXXtentacion", length: tentacionLength },
      { name: "21Savage", length: twentyoneLength },
      { name: "CardiB", length: cardiBLength }
    ];
    socket.emit("winner", winnerArr);

    socket.emit("restart");
  }
});

// socket.on("buy", function(data) {
//   moneyLabel.innerHTML = "$" + data;
// });

socket.on("winner", function(data) {
  winnerMarkup = `
  <img src>
  <div>${data} is the winner!</div>
  `;
  socket.removeListener("racing");
  timerblock.innerHTML = winnerMarkup;
});

socket.on("restart", function() {
  lilpumpInner = `
  <div style="transition: 0.4s; transform: translateX(0%)">
    <img src="./img/lilpump.png" alt="">
  </div>
  `;

  cardiBInner = `
  <div style="transition: 0.4s; transform: translateX(0%)">
    <img src="./img/cardib.png" alt="">
  </div>
  `;

  sixnineInner = `
  <div style="transition: 0.4s; transform: translateX(0%)">
    <img src="./img/sixnine.png" alt="">
  </div>
  `;

  tentacionInner = `
  <div style="transition: 0.4s; transform: translateX(0%)">
    <img src="./img/tentacion.png" alt="">
  </div>
  `;

  twentyoneInner = `
  <div style="transition: 0.4s; transform: translateX(0%)">
    <img src="./img/21.png" alt="">
  </div>
  `;
});

socket.on("users", function(data) {
  users.innerHTML = data.users + " Players";
  userName.innerHTML = data.id;
});

socket.on("typing", function(data) {
  feedback.innerHTML = data + " is typing...";
});
