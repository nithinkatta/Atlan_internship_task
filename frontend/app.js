import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [user, setUser] = useState(null);
  const [booking, setBooking] = useState(null);

  const login = async (email, password) => {
    try {
      const response = await axios.post('http://localhost:3000/login', { email, password });
      setUser({ token: response.data.token });
    } catch (error) {
      console.error('Login failed', error);
    }
  };

  const createBooking = async (pickupLocation, dropoffLocation, vehicleType) => {
    try {
      const response = await axios.post('http://localhost:3000/bookings', {
        userId: user.id,
        pickupLocation,
        dropoffLocation,
        vehicleType
      }, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setBooking(response.data);
    } catch (error) {
      console.error('Booking creation failed', error);
    }
  };

  return (
    <div>
      {!user ? (
        <LoginForm onLogin={login} />
      ) : (
        <div>
          <h1>Welcome, User!</h1>
          {!booking ? (
            <BookingForm onCreateBooking={createBooking} />
          ) : (
            <BookingDetails booking={booking} />
          )}
        </div>
      )}
    </div>
  );
}

function LoginForm({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin(email, password);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
      />
      <button type="submit">Login</button>
    </form>
  );
}

function BookingForm({ onCreateBooking }) {
  const [pickupLocation, setPickupLocation] = useState('');
  const [dropoffLocation, setDropoffLocation] = useState('');
  const [vehicleType, setVehicleType] = useState('car');

  const handleSubmit = (e) => {
    e.preventDefault();
    onCreateBooking(pickupLocation, dropoffLocation, vehicleType);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={pickupLocation}
        onChange={(e) => setPickupLocation(e.target.value)}
        placeholder="Pickup Location"
        required
      />
      <input
        type="text"
        value={dropoffLocation}
        onChange={(e) => setDropoffLocation(e.target.value)}
        placeholder="Dropoff Location"
        required
      />
      <select value={vehicleType} onChange={(e) => setVehicleType(e.target.value)}>
        <option value="car">Car</option>
        <option value="van">Van</option>
        <option value="truck">Truck</option>
      </select>
      <button type="submit">Create Booking</button>
    </form>
  );
}

function BookingDetails({ booking }) {
  return (
    <div>
      <h2>Booking Confirmed</h2>
      <p>Booking ID: {booking.bookingId}</p>
      {/* Add more booking details here */}
    </div>
  );
}

export default App;