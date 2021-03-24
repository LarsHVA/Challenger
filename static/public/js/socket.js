// eslint-disable-next-line no-undef
const socket = io();
const form = document.querySelector('.message-input')
const messages = document.querySelector('.messages')

socket.on('message', (msg) => {
	outputMsg(msg);
} )

form.addEventListener('submit', (event) => {
	event.preventDefault();
	const msg = event.target.elements.msg.value;
	socket.emit('Chat', msg);
})

function outputMsg(msg) { 
	const li = document.createElement('li');
	li.classList.add('message');
	li.innerHTML= `<p>${msg}<p>`;
	messages.appendChild(li);
}