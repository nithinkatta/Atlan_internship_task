const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
require('dotenv').config();
const bookingsRouter = require('./routes/bookings');
const usersRouter = require('./routes/users');
const driverRouter = require('./routes/driver');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());

app.use('/api/bookings', bookingsRouter);
app.use('/api/users', usersRouter);
app.use('/api/driver', driverRouter);

io.on('connection', (socket) => {
  console.log('New client connected');
  
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// Emit new job to all connected drivers
app.post('/api/bookings', (req, res, next) => {
  io.emit('newJob', req.body);
  next();
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = { app, io };
// const express = require('express');
// const cors = require('cors');
// require('dotenv').config();
// const usersRouter = require('./routes/users');
// const bookingsRouter = require('./routes/bookings');
// const driversRouter = require('./routes/driver');

// const app = express();

// app.use(cors());
// app.use(express.json());

// app.use('/api/users', usersRouter);
// app.use('/api/bookings', bookingsRouter);
// app.use('/api/drivers', driversRouter);

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));