const socket = io();

socket.on("message", message => {
  console.log(message);
});

// socket.on("countUpdated", count => {
//   console.log("updated count!", count);
// });

// document.querySelector("#increment").addEventListener("click", () => {
//   console.log("clicked");
//   socket.emit("increment");
// });
