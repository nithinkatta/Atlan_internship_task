// const express = require('express');
// const router = express.Router();
// const db = require('../config/db');
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');

// router.post('/register', async (req, res) => {
//   try {
//     const { name, email, password, userType, vehicleType } = req.body;
//     const hashedPassword = await bcrypt.hash(password, 10);
    
//     const [userResult] = await db.execute(
//       'INSERT INTO users (name, email, password, user_type) VALUES (?, ?, ?, ?)',
//       [name, email, hashedPassword, userType]
//     );

//     if (userType === 'driver') {
//       await db.execute(
//         'INSERT INTO drivers (user_id, name, email, vehicle_type) VALUES (?, ?, ?, ?)',
//         [userResult.insertId, name, email, vehicleType]
//       );
//     }

//     res.status(201).json({ message: 'User registered successfully' });
//   } catch (error) {
//     console.error('Registration error:', error);
//     res.status(500).json({ message: 'Error registering user', error: error.message });
//   }
// });

// router.post('/login', async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     const [rows] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
    
//     if (rows.length === 0) {
//       return res.status(400).json({ message: 'Invalid credentials' });
//     }

//     const user = rows[0];
//     const isMatch = await bcrypt.compare(password, user.password);
    
//     if (!isMatch) {
//       return res.status(400).json({ message: 'Invalid credentials' });
//     }

//     const token = jwt.sign({ userId: user.id, userType: user.user_type }, process.env.JWT_SECRET, { expiresIn: '1h' });
//     res.json({ token, userType: user.user_type });
//   } catch (error) {
//     console.error('Login error:', error);
//     res.status(500).json({ message: 'Error logging in', error: error.message });
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
    
    const [userResult] = await db.execute(
      'INSERT INTO users (name, email, password, user_type) VALUES (?, ?, ?, ?)',
      [name, email, hashedPassword, 'user']
    );

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Error registering user', error: error.message });
  }
});

router.post('/register-driver', async (req, res) => {
  try {
    const { name, email, password, vehicleType } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const [userResult] = await db.execute(
      'INSERT INTO users (name, email, password, user_type) VALUES (?, ?, ?, ?)',
      [name, email, hashedPassword, 'driver']
    );

    await db.execute(
      'INSERT INTO drivers (id, name, email, vehicle_type) VALUES (?, ?, ?, ?)',
      [userResult.insertId, name, email, vehicleType]
    );

    res.status(201).json({ message: 'Driver registered successfully' });
  } catch (error) {
    console.error('Driver registration error:', error);
    res.status(500).json({ message: 'Error registering driver', error: error.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const [rows] = await db.execute('SELECT * FROM users WHERE email = ? AND user_type = "user"', [email]);
    
    if (rows.length === 0) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user.id, userType: 'user' }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, userType: 'user' });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Error logging in', error: error.message });
  }
});

router.post('/login-driver', async (req, res) => {
  try {
    const { email, password } = req.body;
    const [rows] = await db.execute('SELECT * FROM users WHERE email = ? AND user_type = "driver"', [email]);
    
    if (rows.length === 0) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user.id, userType: 'driver' }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, userType: 'driver' });
  } catch (error) {
    console.error('Driver login error:', error);
    res.status(500).json({ message: 'Error logging in', error: error.message });
  }
});

module.exports = router;