const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const Filter = require('bad-words')
const {
  generateMessage
} = require('./utils/messages')

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const port = process.env.PORT || 3000;
const publicDirectoryPath = path.join(__dirname, "../public");

app.use(express.static(publicDirectoryPath));

let count = 0;

io.on("connection", socket => {
  console.log("new websoket connection");

  socket.emit("message", generateMessage('Welcome!'));
  socket.broadcast.emit("message", generateMessage("नए उपयोगकर्ता शामिल हुए|"));

  socket.on("sendMessage", (message, callback) => {

    const filter = new Filter()
    filter.removeWords('hell', 'fuck');

    if (filter.isProfane(message)) {
      return callback('Gali is not allowed!')
    }

    io.emit("message", generateMessage(message))
    callback('Delivered!')
  });

  socket.on("sendlocation", (coords, callback) => {
    io.emit(
      "locationMessage",
      `https://google.com/maps?q=${coords.latitude},${coords.longitude}`
    )
    callback()
  });

  socket.on("disconnect", () => {
    io.emit("message", generateMessage("एक उपयोगकर्ता छोड़ दिया है!"));
  });
});

server.listen(port, () => {
  console.log(`Server is on Port ${port}!`);
});