// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import './Booking.css'; // We'll create this file for component-specific styles

// function Booking() {
//   const [booking, setBooking] = useState({
//     pickup: '',
//     dropoff: '',
//     vehicleType: '',
//   });
//   const [estimatedPrice, setEstimatedPrice] = useState(null);
//   const [message, setMessage] = useState('');
//   const [bookedRides, setBookedRides] = useState([]);
//   const [selectedRide, setSelectedRide] = useState(null);

//   useEffect(() => {
//     fetchBookedRides();
//   }, []);

//   const fetchBookedRides = async () => {
//     try {
//       const token = localStorage.getItem('token');
//       const response = await axios.get('http://localhost:5000/api/bookings', {
//         headers: { 'x-auth-token': token }
//       });
//       setBookedRides(response.data);
//     } catch (error) {
//       console.error('Error fetching booked rides:', error);
//     }
//   };

//   const handleChange = (e) => {
//     setBooking({ ...booking, [e.target.name]: e.target.value });
//   };

//   const estimatePrice = async () => {
//     try {
//       const response = await axios.post('http://localhost:5000/api/bookings/price-estimate', {
//         pickup: booking.pickup,
//         dropoff: booking.dropoff,
//         vehicleType: booking.vehicleType
//       });
//       setEstimatedPrice(response.data.price);
//     } catch (error) {
//       console.error('Error estimating price:', error);
//       setEstimatedPrice(null);
//     }
//   };

//   useEffect(() => {
//     if (booking.pickup && booking.dropoff && booking.vehicleType) {
//       estimatePrice();
//     } else {
//       setEstimatedPrice(null);
//     }
//   }, [booking.pickup, booking.dropoff, booking.vehicleType]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const token = localStorage.getItem('token');
//       const response = await axios.post('http://localhost:5000/api/bookings', booking, {
//         headers: { 'x-auth-token': token }
//       });
//       setMessage(`Booking successful! ID: ${response.data.bookingId}`);
//       fetchBookedRides(); // Refresh the list of booked rides
//     } catch (error) {
//       setMessage('Error creating booking');
//     }
//   };

//   const cancelRide = async (bookingId) => {
//     try {
//       const token = localStorage.getItem('token');
//       await axios.patch(`http://localhost:5000/api/bookings/${bookingId}/cancel`, {}, {
//         headers: { 'x-auth-token': token }
//       });
//       fetchBookedRides(); // Refresh the list of booked rides
//     } catch (error) {
//       console.error('Error cancelling ride:', error);
//     }
//   };

//   return (
//     <div className="booking-container">
//       <div className="booking-form card">
//         <h2>Book a Ride</h2>
//         <form onSubmit={handleSubmit}>
//           <input
//             type="text"
//             name="pickup"
//             placeholder="Pickup Location"
//             value={booking.pickup}
//             onChange={handleChange}
//             required
//           />
//           <input
//             type="text"
//             name="dropoff"
//             placeholder="Drop-off Location"
//             value={booking.dropoff}
//             onChange={handleChange}
//             required
//           />
//           <select
//             name="vehicleType"
//             value={booking.vehicleType}
//             onChange={handleChange}
//             required
//           >
//             <option value="">Select Vehicle Type</option>
//             <option value="car">Car</option>
//             <option value="van">Van</option>
//             <option value="truck">Truck</option>
//           </select>
//           {estimatedPrice && (
//             <p className="estimated-price">Estimated Price: ${estimatedPrice}</p>
//           )}
//           <button type="submit" className="btn">Book Now</button>
//         </form>
//         {message && <p className="message">{message}</p>}
//       </div>

//       <div className="booked-rides">
//         {/* <h3>Your Booked Rides</h3> */}
        
//         {bookedRides.map(ride => (
//           <div key={ride.id} className="ride-card" onClick={() => setSelectedRide(ride)}>
//             <p><strong>From:</strong> {ride.pickup}</p>
//             <p><strong>To:</strong> {ride.dropoff}</p>
//             <p><strong>Vehicle:</strong> {ride.vehicle_type}</p>
//             <p><strong>Status:</strong> {ride.status}</p>
//             <p><strong>Amount:</strong> ${ride.amount}</p>
//             {ride.status === 'pending' && (
//               <button onClick={() => cancelRide(ride.id)} className="btn cancel-btn">Cancel Ride</button>
//             )}
//           </div>
//         ))}
//       </div>

//       {selectedRide && (
//         <div className="ride-details-modal">
//           <div className="ride-details-content">
//             <h3>Ride Details</h3>
//             <p><strong>Booking ID:</strong> {selectedRide.id}</p>
//             <p><strong>From:</strong> {selectedRide.pickup}</p>
//             <p><strong>To:</strong> {selectedRide.dropoff}</p>
//             <p><strong>Vehicle:</strong> {selectedRide.vehicle_type}</p>
//             <p><strong>Status:</strong> {selectedRide.status}</p>
//             <p><strong>Amount:</strong> ${selectedRide.amount}</p>
//             <p><strong>Driver Name:</strong> {selectedRide.driver_name}</p>
//             <p><strong>Driver Phone:</strong> {selectedRide.driver_phone}</p>
//             <div className="map-placeholder">
//               {/* Here you would integrate a map showing the route */}
//               <p>Map showing route from {selectedRide.pickup} to {selectedRide.dropoff}</p>
//             </div>
//             <button onClick={() => setSelectedRide(null)} className="btn">Close</button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default Booking;
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Booking.css';

function Booking() {
  const [booking, setBooking] = useState({
    pickup: '',
    dropoff: '',
    vehicleType: '',
  });
  const [estimatedPrice, setEstimatedPrice] = useState(null);
  const [message, setMessage] = useState('');
  const [bookedRides, setBookedRides] = useState([]);
  const [selectedRide, setSelectedRide] = useState(null);
  const [availableDrivers, setAvailableDrivers] = useState([]);

  useEffect(() => {
    fetchBookedRides();
  }, []);

  useEffect(() => {
    if (booking.pickup && booking.dropoff && booking.vehicleType) {
      estimatePrice();
      fetchAvailableDrivers();
    } else {
      setEstimatedPrice(null);
      setAvailableDrivers([]);
    }
  }, [booking.pickup, booking.dropoff, booking.vehicleType]);

  const fetchBookedRides = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/bookings', {
        headers: { 'x-auth-token': token }
      });
      setBookedRides(response.data);
    } catch (error) {
      console.error('Error fetching booked rides:', error);
    }
  };

  const handleChange = (e) => {
    setBooking({ ...booking, [e.target.name]: e.target.value });
  };

  const estimatePrice = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/bookings/price-estimate', booking);
      setEstimatedPrice(response.data.price);
    } catch (error) {
      console.error('Error estimating price:', error);
      setEstimatedPrice(null);
    }
  };

  const fetchAvailableDrivers = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/bookings/available-drivers', booking);
      setAvailableDrivers(response.data);
    } catch (error) {
      console.error('Error fetching available drivers:', error);
      setAvailableDrivers([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:5000/api/bookings', booking, {
        headers: { 'x-auth-token': token }
      });
      setMessage(`Booking successful! ID: ${response.data.bookingId}`);
      fetchBookedRides();
    } catch (error) {
      setMessage('Error creating booking');
    }
  };

  const cancelRide = async (bookingId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`http://localhost:5000/api/bookings/${bookingId}/cancel`, {}, {
        headers: { 'x-auth-token': token }
      });
      fetchBookedRides();
    } catch (error) {
      console.error('Error cancelling ride:', error);
    }
  };

  return (
    <div className="booking-container">
      <div className="booking-form card">
        <h2>Book a Ride</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="pickup"
            placeholder="Pickup Location"
            value={booking.pickup}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="dropoff"
            placeholder="Drop-off Location"
            value={booking.dropoff}
            onChange={handleChange}
            required
          />
          <select
            name="vehicleType"
            value={booking.vehicleType}
            onChange={handleChange}
            required
          >
            <option value="">Select Vehicle Type</option>
            <option value="car">Car</option>
            <option value="van">Van</option>
            <option value="truck">Truck</option>
          </select>
          {estimatedPrice && (
            <p className="estimated-price">Estimated Price: ${estimatedPrice}</p>
          )}
          {availableDrivers.length > 0 ? (
            <button type="submit" className="btn">Book Now</button>
          ) : (
            <p>No available drivers for this route and vehicle type.</p>
          )}
        </form>
        {message && <p className="message">{message}</p>}
      </div>

      <h3>Your Booked Rides</h3>
      <div className="booked-rides">
        {bookedRides.map(ride => (
          <div key={ride.id} className="ride-card" onClick={() => setSelectedRide(ride)}>
            <p><strong>From:</strong> {ride.pickup}</p>
            <p><strong>To:</strong> {ride.dropoff}</p>
            <p><strong>Vehicle:</strong> {ride.vehicle_type}</p>
            <p><strong>Status:</strong> {ride.status}</p>
            <p><strong>Amount:</strong> ${ride.amount}</p>
            {ride.status === 'pending' && (
              <button onClick={() => cancelRide(ride.id)} className="btn cancel-btn">Cancel Ride</button>
            )}
          </div>
        ))}
      </div>

      {selectedRide && (
        <div className="ride-details-modal">
          <div className="ride-details-content">
            <h3>Ride Details</h3>
            <p><strong>Booking ID:</strong> {selectedRide.id}</p>
            <p><strong>From:</strong> {selectedRide.pickup}</p>
            <p><strong>To:</strong> {selectedRide.dropoff}</p>
            <p><strong>Vehicle:</strong> {selectedRide.vehicle_type}</p>
            <p><strong>Status:</strong> {selectedRide.status}</p>
            <p><strong>Amount:</strong> ${selectedRide.amount}</p>
            <p><strong>Driver Name:</strong> {selectedRide.driver_name}</p>
            <p><strong>Driver Phone:</strong> {selectedRide.driver_phone}</p>
            <div className="map-placeholder">
              <p>Map showing route from {selectedRide.pickup} to {selectedRide.dropoff}</p>
            </div>
            <button onClick={() => setSelectedRide(null)} className="btn">Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Booking;