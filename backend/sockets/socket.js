const socketIO = require('socket.io');

// Default IDs for testing
const DEFAULT_ADMIN_ID = '67f8aeb64eae41bd3cbd31a5';
const DEFAULT_DRIVER_ID = '67f8aeb84eae41bd3cbd31b6';

const initializeSocket = (server) => {
  const io = socketIO(server, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"]
    }
  });

  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    // No token verification needed
    socket.join('admin-room');
    socket.join('driver-room');

    socket.on('location-update', (data) => {
      // Broadcast to admin room
      io.to('admin-room').emit('driver-location', {
        driverId: DEFAULT_DRIVER_ID,
        location: data.location
      });
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });

  return io;
};

module.exports = initializeSocket; 