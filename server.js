// server.js
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static('public'));

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('join', (room) => {
    socket.join(room);
    socket.to(room).emit('user-joined', socket.id);
  });

  socket.on('offer', (data) => {
    socket.to(data.room).emit('offer', {
      sdp: data.sdp,
      sender: socket.id,
    });
  });

  socket.on('answer', (data) => {
    socket.to(data.room).emit('answer', {
      sdp: data.sdp,
      sender: socket.id,
    });
  });

  socket.on('ice-candidate', (data) => {
    socket.to(data.room).emit('ice-candidate', {
      candidate: data.candidate,
      sender: socket.id,
    });
  });

  socket.on('chat-message', (data) => {
    io.to(data.room).emit('chat-message', {
      message: data.message,
      sender: socket.id,
    });
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
