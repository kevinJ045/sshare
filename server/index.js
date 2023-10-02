const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');


const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', (socket) => {
    console.log('Client connected');

    socket.on('screenshot', ({ room, imageData }) =>{
        socket.broadcast.emit('data:'+room, imageData);
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});


const port = process.env.PORT || 3000;
server.listen(port, () => {
    console.log('Server is listening on port '+port);
});
