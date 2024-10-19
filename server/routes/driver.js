const express = require('express');
const router = express.Router();
const db = require('../config/db');
const authMiddleware = require('../middleware/auth');

// Get available jobs
router.get('/available-jobs', authMiddleware, async (req, res) => {
  try {
    const [rows] = await db.execute(
      'SELECT * FROM bookings WHERE status = "pending" AND driver_id IS NULL'
    );
    res.json(rows);
  } catch (error) {
    console.error('Error fetching available jobs:', error);
    res.status(500).json({ message: 'Error fetching available jobs', error: error.message });
  }
});

// Get job history for a driver
router.get('/job-history', authMiddleware, async (req, res) => {
  try {
    const [rows] = await db.execute(
      'SELECT * FROM bookings WHERE driver_id = ? AND status = "completed" ORDER BY created_at DESC',
      [req.user]
    );
    res.json(rows);
  } catch (error) {
    console.error('Error fetching job history:', error);
    res.status(500).json({ message: 'Error fetching job history', error: error.message });
  }
});

// Accept a job
router.post('/accept-job/:jobId', authMiddleware, async (req, res) => {
  try {
    const [result] = await db.execute(
      'UPDATE bookings SET driver_id = ?, status = "accepted" WHERE id = ? AND status = "pending"',
      [req.user, req.params.jobId]
    );

    if (result.affectedRows === 0) {
      return res.status(400).json({ message: 'Job not found or already accepted' });
    }

    res.json({ message: 'Job accepted successfully' });
  } catch (error) {
    console.error('Error accepting job:', error);
    res.status(500).json({ message: 'Error accepting job', error: error.message });
  }
});

// Update job status
router.post('/update-job-status/:jobId', authMiddleware, async (req, res) => {
  try {
    const { status } = req.body;
    const [result] = await db.execute(
      'UPDATE bookings SET status = ? WHERE id = ? AND driver_id = ?',
      [status, req.params.jobId, req.user]
    );

    if (result.affectedRows === 0) {
      return res.status(400).json({ message: 'Job not found or not assigned to this driver' });
    }

    res.json({ message: 'Job status updated successfully' });
  } catch (error) {
    console.error('Error updating job status:', error);
    res.status(500).json({ message: 'Error updating job status', error: error.message });
  }
});

module.exports = router;
// const express = require('express');
// const router = express.Router();
// const db = require('../config/db');
// const authMiddleware = require('../middleware/auth');

// router.get('/info', authMiddleware, async (req, res) => {
//   try {
//     const [rows] = await db.execute(
//       'SELECT * FROM drivers WHERE user_id = ?',
//       [req.user.userId]
//     );
    
//     if (rows.length === 0) {
//       return res.status(404).json({ message: 'Driver not found' });
//     }

//     res.json(rows[0]);
//   } catch (error) {
//     console.error('Error fetching driver info:', error);
//     res.status(500).json({ message: 'Error fetching driver info', error: error.message });
//   }
// });

// router.put('/preferences', authMiddleware, async (req, res) => {
//   try {
//     const { is_available, preferred_from, preferred_to, any_location } = req.body;
    
//     await db.execute(
//       'UPDATE drivers SET is_available = ?, preferred_from = ?, preferred_to = ?, any_location = ? WHERE user_id = ?',
//       [is_available, preferred_from, preferred_to, any_location, req.user.userId]
//     );

//     res.json({ message: 'Preferences updated successfully' });
//   } catch (error) {
//     console.error('Error updating preferences:', error);
//     res.status(500).json({ message: 'Error updating preferences', error: error.message });
//   }
// });

// router.get('/bookings', authMiddleware, async (req, res) => {
//   try {
//     const [rows] = await db.execute(
//       `SELECT b.*, u.name AS user_name, u.phone AS user_phone
//        FROM bookings b
//        JOIN users u ON b.user_id = u.id
//        WHERE b.driver_id = (SELECT id FROM drivers WHERE user_id = ?)
//        ORDER BY b.created_at DESC`,
//       [req.user.userId]
//     );

//     res.json(rows);
//   } catch (error) {
//     console.error('Error fetching driver bookings:', error);
//     res.status(500).json({ message: 'Error fetching driver bookings', error: error.message });
//   }
// });

// module.exports = router;