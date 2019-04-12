const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const hbs = require("express-handlebars");
const http = require("http").Server(app);
const io = require("socket.io")(http, { pingInterval: 500 });

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
  res.render("chat");
});

// app.post("/chat", urlEncodedParser, function(req, res) {
//   console.log(req.body);
//   res.render("chat");
// });

io.on("connection", function(socket) {
  totalConnections.push(socket);
  console.log("a user connected " + totalConnections.length);
  io.sockets.emit("users", totalConnections.length);

  socket.on("message", function(msg) {
    let temp = msg;

    let filter = {
      cool: "ice ice baby",
      school: "scorro",
      neef: "niffauw",
      vriend: "sahbi",
      sigaret: "saffie",
      oke: "aaai",
      sukkel: "aarsbanaan",
      broer: "abi",
      slet: "afgelikte boterham",
      gap: "sahbi",
      doei: "ajo",
      kut: "am",
      wiet: "ampoe",
      amsterdam: "Amsie",
      meisje: "kech",
      de: "het",
      een: "uno",
      het: "de",
      billen: "assr",
      schoenen: "patas",
      dennis: "fakka je boy",
      ik: "moi",
      mitch: "god",
      moeder: "madre",
      vader: "padre",
      lul: "paal",
      heineken: "paarden pis",
      bier: "biri",
      auto: "ribba"
    };

    for (var key in filter) {
      if (temp.message.includes(key)) {
        temp.message = temp.message.replace(
          new RegExp("\\b" + key + "\\b"),
          filter[key]
        );
      }
    }

    io.emit("message", temp);
  });

  socket.on("typing", function(data) {
    socket.broadcast.emit("typing", data);
  });

  socket.on("disconnect", function() {
    console.log("user disconnected " + totalConnections.length);
    totalConnections.pop();
    io.sockets.emit("users", totalConnections.length);
  });
});

http.listen(3000, function() {
  console.log("listening on *:3000");
});
