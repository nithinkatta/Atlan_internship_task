const express = require('express');
const router = express.Router();
const db = require('../config/db');
const authMiddleware = require('../middleware/auth');


router.post('/', authMiddleware, async (req, res) => {
  try {
    const { pickup, dropoff, vehicleType } = req.body;
    const userId = req.user;

    const price = await calculatePrice(pickup, dropoff, vehicleType);
    const [availableDriver] = await db.execute(
      'SELECT id FROM drivers WHERE vehicle_type = ? AND is_available = TRUE LIMIT 1',
      [vehicleType]
    );

    if (availableDriver.length === 0) {
      return res.status(400).json({ message: 'No available drivers' });
    }

    const driverId = availableDriver[0].id;

    const [result] = await db.execute(
      'INSERT INTO bookings (user_id, driver_id, pickup, dropoff, vehicle_type, status, amount) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [userId, driverId, pickup, dropoff, vehicleType, 'pending', price]
    );

    await db.execute('UPDATE drivers SET is_available = FALSE WHERE id = ?', [driverId]);

    res.status(201).json({ 
      message: 'Booking created successfully', 
      bookingId: result.insertId 
    });
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ message: 'Error creating booking', error: error.message });
  }
});

router.post('/available-drivers', async (req, res) => {
  try {
    const { pickup, dropoff, vehicleType } = req.body;
    
    const [availableDrivers] = await db.execute(
      `SELECT d.id FROM drivers d
       WHERE d.vehicle_type = ? AND d.is_available = TRUE
       AND (d.any_location = TRUE 
            OR (d.preferred_location_from = ? AND d.preferred_location_to = ?))`,
      [vehicleType, pickup, dropoff]
    );

    res.json(availableDrivers);
  } catch (error) {
    console.error('Error fetching available drivers:', error);
    res.status(500).json({ message: 'Error fetching available drivers', error: error.message });
  }
});



// Get all bookings for a user
router.get('/', authMiddleware, async (req, res) => {
  try {
    const [rows] = await db.execute(
      `SELECT b.*, d.name AS driver_name, d.phone AS driver_phone 
       FROM bookings b 
       LEFT JOIN drivers d ON b.driver_id = d.id 
       WHERE b.user_id = ? 
       ORDER BY b.created_at DESC`,
      [req.user]
    );

    res.json(rows);
  } catch (error) {
    console.error('Error fetching user bookings:', error);
    res.status(500).json({ message: 'Error fetching user bookings', error: error.message });
  }
});

// Cancel a booking
router.patch('/:id/cancel', authMiddleware, async (req, res) => {
  try {
    const [result] = await db.execute(
      'UPDATE bookings SET status = "cancelled" WHERE id = ? AND user_id = ? AND status = "pending"',
      [req.params.id, req.user]
    );

    if (result.affectedRows === 0) {
      return res.status(400).json({ message: 'Booking not found or cannot be cancelled' });
    }

    // Make the driver available again
    await db.execute(
      'UPDATE drivers SET is_available = TRUE WHERE id = (SELECT driver_id FROM bookings WHERE id = ?)',
      [req.params.id]
    );

    res.json({ message: 'Booking cancelled successfully' });
  } catch (error) {
    console.error('Error cancelling booking:', error);
    res.status(500).json({ message: 'Error cancelling booking', error: error.message });
  }
});

// Price estimation endpoint
router.post('/price-estimate', async (req, res) => {
  try {
    const { pickup, dropoff, vehicleType } = req.body;
    const price = await calculatePrice(pickup, dropoff, vehicleType);
    res.json({ price });
  } catch (error) {
    console.error('Error calculating price estimate:', error);
    res.status(500).json({ message: 'Error calculating price estimate', error: error.message });
  }
});

// Helper function to calculate price
async function calculatePrice(pickup, dropoff, vehicleType) {
  // In a real application, you would use a mapping service to calculate the distance
  // For this example, we'll use a simple random distance
  const distance = Math.floor(Math.random() * 50) + 1; // Random distance between 1 and 50 km

  const basePricePerKm = {
    car: 1.5,
    van: 2.0,
    truck: 2.5
  };

  let price = distance * basePricePerKm[vehicleType];

  if (distance > 20) {
    price *= 1.1; // 10% surcharge for distances over 20km
  }

  // Add a fixed booking fee
  price += 5;

  // Round to 2 decimal places
  return Math.round(price * 100) / 100;
}

module.exports = router;