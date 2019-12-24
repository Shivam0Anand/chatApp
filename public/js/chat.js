const socket = io();

// Elements
const $messageForm = document.querySelector('#message-form')
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')

socket.on("message", message => {
  console.log(message);
});

$messageForm.addEventListener("submit", e => {
  e.preventDefault();

  $messageFormButton.setAttribute('disabled', 'disabled')

  // disable
  const message = e.target.elements.message.value;

  socket.emit("sendMessage", message, (error)=>{

    $messageFormButton.removeAttribute('disabled')
    $messageFormInput.value = ''
    $messageFormInput.focus()
  // enable

    if (error) {
      return console.log(error)
    }
    console.log('Message Delivered!')
  });
});

document.querySelector("#send-location").addEventListener("click", () => {
  if (!navigator.geolocation) {
    return alert("Geolocation is not supported by your browser!");
  }

  navigator.geolocation.getCurrentPosition(position => {
    // console.log(position);
    socket.emit("sendlocation", {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
    }, ()=>{
      console.log("Location Shared!")
    });
  });
});
