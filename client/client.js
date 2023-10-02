const socketio = require('socket.io-client');
const screenshot = require('screenshot-desktop');
const fs = require('fs');

let fallback_url = 'https://sshare.onrender.com/';

const url = process.argv[2] || (fs.existsSync('url.txt') ? fs.readFileSync('url.txt').toString().trim() : fallback_url);

fs.writeFileSync('url.txt', url);

console.log('Server URL: '+url);

let close;
const socket = socketio.connect(url);

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
