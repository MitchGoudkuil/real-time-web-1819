const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const hbs = require("express-handlebars");
const http = require("http").Server(app);
const io = require("socket.io")(http, { pingInterval: 500 });
const port = process.env.PORT || 3000;

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

io.on("connection", function(socket) {
  totalConnections.push(socket);
  console.log("a user connected " + totalConnections.length);
  io.sockets.emit("users", totalConnections.length);

  socket.on("message", function(msg) {
    io.emit("message", msg);
  });

  // // socket money buying
  //   socket.on("buy", function(data) {
  //     let leftMoney = data.currentMoney - data.beds
  //     io.emit("buy", leftMoney);
  //   })

  socket.on("typing", function(data) {
    socket.broadcast.emit("typing", data);
  });

  socket.on("disconnect", function() {
    console.log("user disconnected " + totalConnections.length);
    totalConnections.pop();
    io.sockets.emit("users", totalConnections.length);
  });
});

http.listen(port, function() {
  console.log("listening on *:3000");
});
