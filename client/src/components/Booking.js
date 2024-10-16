// import React, { useState } from 'react';
// import axios from 'axios';

// function Booking() {
//   const [booking, setBooking] = useState({
//     pickup: '',
//     dropoff: '',
//     vehicleType: '',
//   });

//   const handleChange = (e) => {
//     setBooking({ ...booking, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await axios.post('http://localhost:5000/api/bookings', booking);
//       alert('Booking successful! ID: ' + response.data.id);
//     } catch (error) {
//       alert('Error creating booking');
//     }
//   };

//   return (
//     <div>
//       <h2>Book a Vehicle</h2>
//       <form onSubmit={handleSubmit}>
//         <input
//           type="text"
//           name="pickup"
//           placeholder="Pickup Location"
//           value={booking.pickup}
//           onChange={handleChange}
//           required
//         />
//         <input
//           type="text"
//           name="dropoff"
//           placeholder="Drop-off Location"
//           value={booking.dropoff}
//           onChange={handleChange}
//           required
//         />
//         <select
//           name="vehicleType"
//           value={booking.vehicleType}
//           onChange={handleChange}
//           required
//         >
//           <option value="">Select Vehicle Type</option>
//           <option value="car">Car</option>
//           <option value="van">Van</option>
//           <option value="truck">Truck</option>
//         </select>
//         <button type="submit">Book Now</button>
//       </form>
//     </div>
//   );
// }

// export default Booking;

import React, { useState } from 'react';
import axios from 'axios';

function PriceEstimation() {
  const [estimate, setEstimate] = useState({
    distance: '',
    vehicleType: '',
  });
  const [price, setPrice] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setEstimate({ ...estimate, [e.target.name]: e.target.value });
  };

  const handleEstimate = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const response = await axios.post('http://localhost:5000/api/bookings/price-estimate', estimate);
      setPrice(response.data.price);
    } catch (error) {
      setError('Error estimating price. Please try again.');
      console.error('Error:', error);
    }
  };

  return (
    <div>
      <h2>Price Estimation</h2>
      <form onSubmit={handleEstimate}>
        <input
          type="number"
          name="distance"
          placeholder="Distance (km)"
          value={estimate.distance}
          onChange={handleChange}
          required
        />
        <select
          name="vehicleType"
          value={estimate.vehicleType}
          onChange={handleChange}
          required
        >
          <option value="">Select Vehicle Type</option>
          <option value="car">Car</option>
          <option value="van">Van</option>
          <option value="truck">Truck</option>
        </select>
        <button type="submit">Estimate Price</button>
      </form>
      {price && <p>Estimated Price: ${price}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}

export default PriceEstimation;