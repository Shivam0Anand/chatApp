const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const port = process.env.PORT || 3000;
const publicDirectoryPath = path.join(__dirname, "../public");

app.use(express.static(publicDirectoryPath));

let count = 0;

io.on("connection", socket => {
  console.log("new websoket connection");

  socket.emit("message", "Welcome!");
  socket.broadcast.emit("message", "नए उपयोगकर्ता शामिल हुए!");

  socket.on("sendMessage", (message, callback) => {
    io.emit("message", message)
    callback()
  });

  socket.on("sendlocation", coords => {
    io.emit(
      "message",
      `https://google.com/maps?q=${coords.latitude},${coords.longitude}`
    );
  });

  socket.on("disconnect", () => {
    io.emit("message", "एक उपयोगकर्ता छोड़ दिया है!");
  });
});

server.listen(port, () => {
  console.log(`Server is on Port ${port}!`);
});
