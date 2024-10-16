// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import io from 'socket.io-client';

// function Driver() {
//   const [activeBookings, setActiveBookings] = useState([]);
//   const [currentLocation, setCurrentLocation] = useState({ lat: 0, lng: 0 });

//   useEffect(() => {
//     const socket = io('http://localhost:5000');
    
//     socket.on('newBooking', (booking) => {
//       setActiveBookings(prev => [...prev, booking]);
//     });

//     // Simulating location updates
//     const interval = setInterval(() => {
//       setCurrentLocation(prev => ({
//         lat: prev.lat + (Math.random() - 0.5) * 0.001,
//         lng: prev.lng + (Math.random() - 0.5) * 0.001
//       }));
//     }, 5000);

//     return () => {
//       socket.disconnect();
//       clearInterval(interval);
//     };
//   }, []);

//   const acceptBooking = async (bookingId) => {
//     try {
//       await axios.post(`http://localhost:5000/api/bookings/${bookingId}/accept`);
//       setActiveBookings(prev => prev.filter(booking => booking.id !== bookingId));
//     } catch (error) {
//       console.error('Error accepting booking:', error);
//     }
//   };

//   return