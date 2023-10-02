const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const screenshot = require('screenshot-desktop')


const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', (socket) => {
    let close, timeout;
    console.log('Client connected');

    function sendData(){
        screenshot({format: 'png'}).then((img) => {
            socket.emit('data', img.toString('base64'));
            if(!close) timeout = setTimeout(sendData, 16);
        });
    }

    socket.on('screenshot', ({ imageData }) =>{
        socket.broadcast.emit('data:ss', socket.id, imageData);
    });

    socket.on('start-stream', () => {
        // Start screen capture and send frames to the client
        sendData();
    });

    socket.on('disconnect', () => {
        close = true;
        clearTimeout(timeout);
        console.log('Client disconnected');
    });
});

server.listen(3000, () => {
    console.log('Server is listening on port 3000');
});
