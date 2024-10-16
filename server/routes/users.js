// const express = require('express');
// const router = express.Router();
// const db = require('../config/db');

// router.post('/', async (req, res) => {
//   try {
//     const { name, email, password } = req.body;
//     const [result] = await db.execute(
//       'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
//       [name, email, password]
//     );
//     res.status(201).json({ id: result.insertId });
//   } catch (error) {
//     res.status(500).json({ message: 'Error creating user' });
//   }
// });

// router.get('/:id', async (req, res) => {
//   try {
//     const [rows] = await db.execute('SELECT id, name, email FROM users WHERE id = ?', [req.params.id]);
//     if (rows.length === 0) {
//       return res.status(404).json({ message: 'User not found' });
//     }
//     res.json(rows[0]);
//   } catch (error) {
//     res.status(500).json({ message: 'Error fetching user' });
//   }
// });

// module.exports = router;



const express = require('express');
const router = express.Router();
const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await db.execute(
      'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
      [name, email, hashedPassword]
    );
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Error registering user', error: error.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Login attempt for email:', email);

    const [rows] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
    if (rows.length === 0) {
      console.log('No user found with email:', email);
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log('Password mismatch for email:', email);
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET is not set in environment variables');
      return res.status(500).json({ message: 'Internal server error' });
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    console.log('Login successful for email:', email);
    res.json({ token, userType: user.user_type || 'user' });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Error logging in', error: error.message });
  }
});

module.exports = router;