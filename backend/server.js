const http = require('http');
const app = require('./app');
const { Server } = require('socket.io');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const PORT = process.env.PORT || 4000;

// Create HTTP server
const server = http.createServer(app);

// Socket.IO setup with CORS
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000", "http://localhost:3001"],
    methods: ["GET", "POST"],
    credentials: true
  },
  transports: ['websocket', 'polling']
});

// Socket event handling
require('./sockets/socketHandler')(io);

// Start server with proper error handling
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}).on('error', err => {
  console.error('Server error:', err);
  process.exit(1);
});

module.exports = { app, server, io };
