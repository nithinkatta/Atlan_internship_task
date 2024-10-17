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