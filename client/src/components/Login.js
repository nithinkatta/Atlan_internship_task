// import React, { useState } from 'react';
// import axios from 'axios';
// import { useNavigate, useLocation } from 'react-router-dom';

// function Login({ setIsAuthenticated, setUserType }) {
//   const [formData, setFormData] = useState({
//     email: '',
//     password: '',
//   });
//   const [error, setError] = useState('');
//   const navigate = useNavigate();
//   const location = useLocation();

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError('');
//     try {
//       const response = await axios.post('http://localhost:5000/api/users/login', formData);
//       localStorage.setItem('token', response.data.token);
//       setIsAuthenticated(true);
//       setUserType(response.data.userType);
      
//       const origin = location.state?.from?.pathname || '/';
//       navigate(origin);
//     } catch (error) {
//       setError(error.response?.data?.message || 'Error logging in');
//     }
//   };

//   return (
//     <div className="card">
//       <h2>Login</h2>
//       {error && <p className="error">{error}</p>}
//       <form onSubmit={handleSubmit}>
//         <input
//           type="email"
//           name="email"
//           placeholder="Email"
//           value={formData.email}
//           onChange={handleChange}
//           required
//         />
//         <input
//           type="password"
//           name="password"
//           placeholder="Password"
//           value={formData.password}
//           onChange={handleChange}
//           required
//         />
//         <button type="submit" className="btn">Login</button>
//       </form>
//     </div>
//   );
// }

// export default Login;
// import React, { useState } from 'react';
// import axios from 'axios';
// import { useNavigate, useLocation } from 'react-router-dom';

// function Login({ setIsAuthenticated, setUserType }) {
//   const [formData, setFormData] = useState({
//     email: '',
//     password: '',
//   });
//   const [error, setError] = useState('');
//   const navigate = useNavigate();
//   const location = useLocation();

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError('');
//     try {
//       const response = await axios.post('http://localhost:5000/api/users/login', formData);
//       localStorage.setItem('token', response.data.token);
//       setIsAuthenticated(true);
//       setUserType(response.data.userType);
      
//       const origin = location.state?.from?.pathname || '/';
//       if (response.data.userType === 'driver') {
//         navigate('/driver-dashboard');
//       } else {
//         navigate(origin);
//       }
//     } catch (error) {
//       setError(error.response?.data?.message || 'Error logging in');
//     }
//   };

//   return (
//     <div className="card">
//       <h2>Login</h2>
//       {error && <p className="error">{error}</p>}
//       <form onSubmit={handleSubmit}>
//         <input
//           type="email"
//           name="email"
//           placeholder="Email"
//           value={formData.email}
//           onChange={handleChange}
//           required
//         />
//         <input
//           type="password"
//           name="password"
//           placeholder="Password"
//           value={formData.password}
//           onChange={handleChange}
//           required
//         />
//         <button type="submit" className="btn">Login</button>
//       </form>
//     </div>
//   );
// }

// export default Login;

import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation, Link } from 'react-router-dom';

function Login({ setIsAuthenticated, setUserType }) {
  const [isDriver, setIsDriver] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await axios.post(`http://localhost:5000/api/users/login${isDriver ? '-driver' : ''}`, formData);
      localStorage.setItem('token', response.data.token);
      setIsAuthenticated(true);
      setUserType(isDriver ? 'driver' : 'user');
      
      const origin = location.state?.from?.pathname || '/';
      navigate(isDriver ? '/driver-dashboard' : origin);
    } catch (error) {
      setError(error.response?.data?.message || 'Error logging in');
    }
  };

  return (
    <div className="card">
      <h2>{isDriver ? 'Driver Login' : 'User Login'}</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <button type="submit" className="btn">Login</button>
      </form>
      <button onClick={() => setIsDriver(!isDriver)} className="btn-link">
        {isDriver ? 'User Login' : 'Driver Login'}
      </button>
      <p>
        Don't have an account? <Link to="/register">Register here</Link>
      </p>
    </div>
  );
}

export default Login;