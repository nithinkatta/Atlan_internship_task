// const express = require('express');
// const router = express.Router();
// const db = require('../config/db');

// router.post('/', async (req, res) => {
//   try {
//     const { pickup, dropoff, vehicleType } = req.body;
//     const [result] = await db.execute(
//       'INSERT INTO bookings (pickup, dropoff, vehicle_type) VALUES (?, ?, ?)',
//       [pickup, dropoff, vehicleType]
//     );
//     res.status(201).json({ id: result.insertId });
//   } catch (error) {
//     res.status(500).json({ message: 'Error creating booking' });
//   }
// });

// router.get('/:id', async (req, res) => {
//   try {
//     const [rows] = await db.execute('SELECT * FROM bookings WHERE id = ?', [req.params.id]);
//     if (rows.length === 0) {
//       return res.status(404).json({ message: 'Booking not found' });
//     }
//     res.json(rows[0]);
//   } catch (error) {
//     res.status(500).json({ message: 'Error fetching booking' });
//   }
// });

// module.exports = router;

const express = require('express');
const router = express.Router();
const db = require('../config/db');

// ... existing routes ...

router.post('/price-estimate', (req, res) => {
  const { distance, vehicleType } = req.body;
  
  // Base price per km
  const basePricePerKm = {
    car: 1.5,
    van: 2.0,
    truck: 2.5
  };

  // Calculate base price
  let price = distance * basePricePerKm[vehicleType];

  // Add a surcharge for longer distances
  if (distance > 100) {
    price *= 1.1; // 10% surcharge for distances over 100km
  }

  // Add a fixed booking fee
  price += 5;

  // Round to 2 decimal places
  price = Math.round(price * 100) / 100;

  res.json({ price });
});

module.exports = router;