module.exports = (io) => {
  // Listen for driver location updates
  io.on('connection', (socket) => {
    console.log('Socket connected:', socket.id);

    // Example: Listen for driverLocationUpdate
    socket.on('driverLocationUpdate', (data) => {
      // Broadcast to admins
      io.emit('adminDriverLocations', [data]);
      // TODO: Update Driver lastLocation in DB
    });

    socket.on('disconnect', () => {
      console.log('Socket disconnected:', socket.id);
    });
  });
}; 