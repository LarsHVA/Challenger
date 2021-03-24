// eslint-disable-next-line no-undef
const socket = io();
const form = document.querySelector('.message-input')
const messages = document.querySelector('.messages')

socket.on('message', (msg) => {
  outputMsg(msg);
  messages.scrollTop = messages.scrollHeight;
} )

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const msg = event.target.elements.msg.value;
  socket.emit('Chat', msg);
  event.target.elements.msg.value = "";
  event.target.elements.msg.focus();
})

function outputMsg(msg) { 
  const li = document.createElement('li');
  li.classList.add('message');
  li.innerHTML= `<p>${msg.username}</p><span>${msg.time}</span><p>${msg.message}<p>`;
  messages.appendChild(li);
}