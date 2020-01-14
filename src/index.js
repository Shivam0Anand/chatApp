const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const Filter = require('bad-words')
const {
  generateMessage,
  generateLocationMessage
} = require('./utils/messages')

const {
  addUser,
  removeUser,
  getUser,
  getUserInRoom
} = require('./utils/users')

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const port = process.env.PORT || 3000;
const publicDirectoryPath = path.join(__dirname, "../public");

app.use(express.static(publicDirectoryPath));

let count = 0;

io.on("connection", socket => {
  console.log("new websoket connection");

  socket.on('join', ({
    username,
    room
  }) => {

    const {
      error,
      user
    } = addUser({
      id: socket.id,
      username,
      room
    }, callback)

    if (error) {
      return callback(error)
    }



    socket.join(room)

    socket.emit("message", generateMessage('Welcome!'));
    socket.broadcast.to(room).emit("message", generateMessage(`${username} शामिल हुए !`));

  })

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
      generateLocationMessage(`https://google.com/maps?q=${coords.latitude},${coords.longitude}`)
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