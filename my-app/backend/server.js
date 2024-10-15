const express = require('express');
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
app.use(express.json());

// Database connection
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'Nithin281',
  database: 'goods',
  waitForConnections: true,
  connectionLimit: 10000,
  queueLimit: 0
});

// User registration
app.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const [result] = await pool.query(
      'INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)',
      [username, email, hashedPassword]
    );
    
    res.status(201).json({ message: 'User registered successfully', userId: result.insertId });
  } catch (error) {
    res.status(500).json({ error: 'Error registering user' });
  }
});

// User login
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    
    if (rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const user = rows[0];
    const passwordMatch = await bcrypt.compare(password, user.password_hash);
    
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const token = jwt.sign({ userId: user.id }, 'your_jwt_secret', { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: 'Error logging in' });
  }
});

// Create a booking
app.post('/bookings', async (req, res) => {
  try {
    const { userId, pickupLocation, dropoffLocation, vehicleType } = req.body;
    
    // Here you would implement the logic to find an available driver and vehicle
    // For simplicity, let's assume we have a driver and vehicle
    const [result] = await pool.query(
      'INSERT INTO bookings (user_id, driver_id, vehicle_id, pickup_location, dropoff_location) VALUES (?, 1, 1, ?, ?)',
      [userId, pickupLocation, dropoffLocation]
    );
    
    res.status(201).json({ message: 'Booking created successfully', bookingId: result.insertId });
  } catch (error) {
    res.status(500).json({ error: 'Error creating booking' });
  }
});

// Update GPS location (for drivers)
app.post('/update-location', async (req, res) => {
  try {
    const { driverId, latitude, longitude } = req.body;
    
    await pool.query(
      'INSERT INTO gps_tracking (driver_id, latitude, longitude) VALUES (?, ?, ?)',
      [driverId, latitude, longitude]
    );
    
    res.json({ message: 'Location updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error updating location' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));