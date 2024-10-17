import React, { useState, useEffect } from 'react';
import axios from 'axios';
import io from 'socket.io-client';

function Driver() {
  const [activeBookings, setActiveBookings] = useState([]);
  const [currentLocation, setCurrentLocation] = useState({ lat: 0, lng: 0 });

  useEffect(() => {
    const socket = io('http://localhost:5000');
    
    socket.on('newBooking', (booking) => {
      setActiveBookings(prev => [...prev, booking]);
    });

    // Simulating location updates
    const interval = setInterval(() => {
      setCurrentLocation(prev => ({
        lat: prev.lat + (Math.random() - 0.5) * 0.001,
        lng: prev.lng + (Math.random() - 0.5) * 0.001
      }));
    }, 5000);

    return () => {
      socket.disconnect();
      clearInterval(interval);
    };
  }, []);

  const acceptBooking = async (bookingId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`http://localhost:5000/api/bookings/${bookingId}/status`, 
        { status: 'accepted' },
        { headers: { 'x-auth-token': token } }
      );
      setActiveBookings(prev => prev.filter(booking => booking.id !== bookingId));
    } catch (error) {
      console.error('Error accepting booking:', error);
    }
  };

  return (
    <div className="card">
      <h2>Driver Dashboard</h2>
      <p>Current Location: Lat {currentLocation.lat.toFixed(6)}, Lng {currentLocation.lng.toFixed(6)}</p>
      <h3>Active Bookings:</h3>
      {activeBookings.map(booking => (
        <div key={booking.id} className="booking-item">
          <p><strong>Booking ID:</strong> {booking.id}</p>
          <p><strong>Pickup:</strong> {booking.pickup}</p>
          <p><strong>Dropoff:</strong> {booking.dropoff}</p>
          <button onClick={() => acceptBooking(booking.id)} className="btn">Accept Booking</button>
        </div>
      ))}
    </div>
  );
}

export default Driver;