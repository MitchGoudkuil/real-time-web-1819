const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const hbs = require("express-handlebars");
const http = require("http").Server(app);
const io = require("socket.io")(http, { pingInterval: 500 });
const port = process.env.PORT || 3000;

let pumpArray = [];
let cardiBArray = [];
let sixnineArray = [];
let tentacionArray = [];
let twentyoneArray = [];
let futureArray = [];
let userIDs = [];
let timer = 5;

let gambleArr = [];

const TwitterStreamChannels = require("twitter-stream-channels");
const Twit = require("twit");
const config = require("./config");

const client = new TwitterStreamChannels(config);

const channels = {
  lilpump: ["lilpump", "#lilpump", "@lilpump"],
  cardib: ["#cardiB", "cardib", "cardiB", "@iamcardib"],
  sixnine: ["6ix9ine", "sixnine", "@TheRiskOffic", "#6ix9ine"],
  tentacion: ["XXXTentacion", "@xxxtentacion", "#XXXTentacion", "laptop"],
  twentyone: ["21savage", "@21savage", "#21savage", "dennis", ":)"]
};

let stream = client.streamChannels({ track: channels });

let totalConnections = [];
let urlEncodedParser = bodyParser.urlencoded({ extended: false });

app.use(express.static(__dirname + "/server/public/"));
app.engine(
  "hbs",
  hbs({
    extname: "hbs",
    defaultLayout: "layout",
    layoutsDir: __dirname + "/server/views/layouts"
  })
);
app.set("view engine", "hbs");
app.set("views", __dirname + "/server/views");

app.get("/", function(req, res) {
  res.render("run");
});

app.get("/scores", function(req, res) {
  res.render("scores");
});

startgame();

function startgame() {
  let mainInterval = setInterval(function() {
    if (totalConnections.length >= 1) {
      timer = timer - 1;
      console.log(timer);
      if (timer === 0) {
        clearInterval(mainInterval);
        timer = 5;
        pumpArray = [];
        sixnineArray = [];
        cardiBArray = [];
        tentacionArray = [];
        twentyoneArray = [];
        io.sockets.emit("timer", timer);
        stream.on("channels/lilpump", function(tweet) {
          pumpArray.push(tweet);
        });
        stream.on("channels/sixnine", function(tweet) {
          sixnineArray.push(tweet);
        });
        stream.on("channels/cardib", function(tweet) {
          cardiBArray.push(tweet);
        });
        stream.on("channels/tentacion", function(tweet) {
          tentacionArray.push(tweet);
        });
        stream.on("channels/twentyone", function(tweet) {
          twentyoneArray.push(tweet);
        });

        let rapperBlock = {
          LilPump: pumpArray,
          sixnine: sixnineArray,
          cardib: cardiBArray,
          tentacion: tentacionArray,
          twentyone: twentyoneArray
        };

        let racingInterval = setInterval(function() {
          io.sockets.emit("racing", rapperBlock);
        }, 1000);
      } else {
        io.sockets.emit("timer", timer);
      }
    }
  }, 1000);
}

io.on("connection", function(socket) {
  totalConnections.push(socket);
  io.sockets.emit("users", {
    users: totalConnections.length,
    id: socket.id
  });

  socket.on("restart", function() {
    timer = 5;
    startgame();
    io.emit("restart");
  });

  socket.on("message", function(msg) {
    io.emit("message", msg);
  });

  socket.on("winner", function(data) {
    let winnerFilter = data.filter(win => {
      return win.length >= 10;
    });

    let winner = winnerFilter[0].name;

    io.sockets.emit("winner", winner);
    data = [];
  });

  socket.on("gamble", function(data) {
    gambleArr.push(data);
    io.sockets.emit("gamble", gambleArr);
  });

  socket.on("typing", function(data) {
    socket.broadcast.emit("typing", data);
  });

  socket.on("disconnect", function() {
    totalConnections.pop();
    io.sockets.emit("users", totalConnections.length);
  });
});

http.listen(port, function() {
  console.log("listening on *:3000");
});
