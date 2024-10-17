const express = require('express');
const router = express.Router();
const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

router.post('/register', async (req, res) => {
  try {
    const { name, email, password, userType } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    
    let table = userType === 'driver' ? 'drivers' : 'users';
    
    const [result] = await db.execute(
      `INSERT INTO ${table} (name, email, password) VALUES (?, ?, ?)`,
      [name, email, hashedPassword]
    );
    res.status(201).json({ message: `${userType} registered successfully` });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Error registering user', error: error.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password, userType } = req.body;
    console.log(`Login attempt for ${userType} with email:`, email);

    let table = userType === 'driver' ? 'drivers' : 'users';

    const [rows] = await db.execute(`SELECT * FROM ${table} WHERE email = ?`, [email]);
    if (rows.length === 0) {
      console.log(`No ${userType} found with email:`, email);
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log(`Password mismatch for ${userType} with email:`, email);
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET is not set in environment variables');
      return res.status(500).json({ message: 'Internal server error' });
    }

    const token = jwt.sign({ userId: user.id, userType }, process.env.JWT_SECRET, { expiresIn: '1h' });
    console.log(`Login successful for ${userType} with email:`, email);
    res.json({ token, userType });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Error logging in', error: error.message });
  }
});

module.exports = router;