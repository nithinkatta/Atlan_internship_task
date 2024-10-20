import React, { useState, useEffect } from 'react';
import axios from 'axios';
import io from 'socket.io-client';

function Tracking() {
  const [bookingId, setBookingId] = useState('');
  const [trackingInfo, setTrackingInfo] = useState(null);

  useEffect(() => {
    const socket = io('http://localhost:5000');
    
    socket.on('trackingUpdate', (data) => {
      if (data.bookingId === bookingId) {
        setTrackingInfo(data);
      }
    });

    return () => socket.disconnect();
  }, [bookingId]);

  const handleTrack = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:5000/api/bookings/${bookingId}`, {
        headers: { 'x-auth-token': token }
      });
      setTrackingInfo(response.data);
    } catch (error) {
      alert('Error fetching tracking information');
    }
  };

  return (
    <div>
      <h2>Track Your Booking</h2>
      <input
        type="text"
        placeholder="Enter Booking ID"
        value={bookingId}
        onChange={(e) => setBookingId(e.target.value)}
      />
      <button onClick={handleTrack}>Track</button>
      {trackingInfo && (
        <div>
          <p>Status: {trackingInfo.status}</p>
          <p>Pickup: {trackingInfo.pickup}</p>
          <p>Dropoff: {trackingInfo.dropoff}</p>
          <p>Vehicle Type: {trackingInfo.vehicle_type}</p>
        </div>
      )}
    </div>
  );
}

export default Tracking;