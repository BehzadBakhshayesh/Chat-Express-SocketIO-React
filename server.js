const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: ['http://localhost:3000', 'http://localhost:3001'],
        methods: ['GET', 'POST'],
        allowedHeaders: ['Content-Type'],
    },
});

app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:3001'],
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
}));

app.use(express.static('public'));

io.on('connection', (socket) => {
    console.log('a person connected', socket);

    socket.on('chat message', (msg) => {
        console.log('msg recived: ' + msg);
        io.emit('chat message', msg);
    });

    socket.on('disconnect', () => {
        console.log('a person left.');
    });
});

const port = 5000;
server.listen(port, () => {
    console.log(`app running on ${port}`);
});
