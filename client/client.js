const socketio = require('socket.io-client');
const screenshot = require('screenshot-desktop');

let close;
const socket = socketio.connect(process.argv[2] || 'http://localhost:3000');

socket.on('connect', () => {
	console.log('ID: '+socket.id);
	sendData();
});

function sendData(){
	screenshot({format: 'png'}).then((img) => {
		socket.emit('screenshot', { room: socket.id, imageData: img.toString('base64')});
		if(!close) sendData();
	});
}
