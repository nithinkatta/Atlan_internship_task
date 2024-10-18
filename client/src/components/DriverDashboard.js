import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './DriverDashboard.css';

function DriverDashboard() {
  const [driverInfo, setDriverInfo] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [preferences, setPreferences] = useState({
    is_available: false,
    preferred_from: '',
    preferred_to: '',
    any_location: false
  });

  useEffect(() => {
    fetchDriverInfo();
    fetchBookings();
  }, []);

  const fetchDriverInfo = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/drivers/info', {
        headers: { 'x-auth-token': token }
      });
      setDriverInfo(response.data);
      setPreferences(response.data);
    } catch (error) {
      console.error('Error fetching driver info:', error);
    }
  };

  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/drivers/bookings', {
        headers: { 'x-auth-token': token }
      });
      setBookings(response.data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    }
  };

  const handlePreferenceChange = (e) => {
    const { name, value, type, checked } = e.target;
    setPreferences(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const updatePreferences = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.put('http://localhost:5000/api/drivers/preferences', preferences, {
        headers: { 'x-auth-token': token }
      });
      alert('Preferences updated successfully');
      fetchDriverInfo(); // Refresh driver info after updating preferences
    } catch (error) {
      console.error('Error updating preferences:', error);
      alert('Error updating preferences');
    }
  };

  return (
    <div className="driver-dashboard">
      <h2>Driver Dashboard</h2>
      {driverInfo && (
        <div className="driver-info">
          <h3>Driver Information</h3>
          <p>Name: {driverInfo.name}</p>
          <p>Email: {driverInfo.email}</p>
          <p>Vehicle Type: {driverInfo.vehicle_type}</p>
          <p>Status: {preferences.is_available ? 'Available' : 'Not Available'}</p>
        </div>
      )}
      <div className="preferences">
        <h3>Set Preferences</h3>
        <label>
          <input
            type="checkbox"
            name="is_available"
            checked={preferences.is_available}
            onChange={handlePreferenceChange}
          />
          Available for bookings
        </label>
        <input
          type="text"
          name="preferred_from"
          placeholder="Preferred starting location"
          value={preferences.preferred_from}
          onChange={handlePreferenceChange}
        />
        <input
          type="text"
          name="preferred_to"
          placeholder="Preferred destination"
          value={preferences.preferred_to}
          onChange={handlePreferenceChange}
        />
        <label>
          <input
            type="checkbox"
            name="any_location"
            checked={preferences.any_location}
            onChange={handlePreferenceChange}
          />
          Any location is fine
        </label>
        <button onClick={updatePreferences} className="btn">Update Preferences</button>
      </div>
      <div className="bookings">
        <h3>Your Bookings</h3>
        {bookings.map(booking => (
          <div key={booking.id} className="booking-item">
            <p>Booking ID: {booking.id}</p>
            <p>From: {booking.pickup}</p>
            <p>To: {booking.dropoff}</p>
            <p>Status: {booking.status}</p>
            <p>User: {booking.user_name} (Phone: {booking.user_phone})</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DriverDashboard;