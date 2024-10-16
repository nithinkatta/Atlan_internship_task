// const express = require('express');
// const cors = require('cors');
// const bookingsRouter = require('./routes/bookings');
// const usersRouter = require('./routes/users');

// const app = express();

// app.use(cors());
// app.use(express.json());

// app.use('/api/bookings', bookingsRouter);
// app.use('/api/users', usersRouter);

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

const express = require('express');
   const cors = require('cors');
   require('dotenv').config();
   const bookingsRouter = require('./routes/bookings');
   const usersRouter = require('./routes/users');

   const app = express();

   app.use(cors());
   app.use(express.json());

   app.use('/api/bookings', bookingsRouter);
   app.use('/api/users', usersRouter);

   // Global error handler
   app.use((err, req, res, next) => {
     console.error(err.stack);
     res.status(500).send('Something broke!');
   });

   const PORT = process.env.PORT || 5000;
   app.listen(PORT, () => console.log(`Server running on port ${PORT}`));