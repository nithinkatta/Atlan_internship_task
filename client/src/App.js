// import React, { useState, useEffect } from 'react';
// import { BrowserRouter as Router, Route, Routes, Link, Navigate, useLocation } from 'react-router-dom';
// import Register from './components/Register';
// import Login from './components/Login';
// import Booking from './components/Booking';
// import Tracking from './components/Tracking';
// import PriceEstimation from './components/PriceEstimation';
// import Driver from './components/Driver';
// import './styles/global.css';

// function App() {
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [userType, setUserType] = useState(null);

//   useEffect(() => {
//     const token = localStorage.getItem('token');
//     if (token) {
//       setIsAuthenticated(true);
//       setUserType('user');
//     }
//   }, []);

//   const handleLogout = () => {
//     localStorage.removeItem('token');
//     setIsAuthenticated(false);
//     setUserType(null);
//   };

//   return (
//     <Router>
//       <div className="App">
//         <nav>
//           <ul>
//             {!isAuthenticated && (
//               <>
//                 <li><Link to="/register">Register</Link></li>
//                 <li><Link to="/login">Login</Link></li>
//               </>
//             )}
//             {isAuthenticated && (
//               <>
//                 <li><Link to="/">Home</Link></li>
//                 <li><Link to="/booking">Book a Ride</Link></li>
//                 <li><Link to="/tracking">Track Your Ride</Link></li>
//                 <li><Link to="/price-estimation">Price Estimation</Link></li>
//                 {userType === 'driver' && <li><Link to="/driver">Driver Dashboard</Link></li>}
//                 <li><button className="btn" onClick={handleLogout}>Logout</button></li>
//               </>
//             )}
//           </ul>
//         </nav>

//         <div className="container">
//           <Routes>
//             <Route path="/register" element={<Register />} />
//             <Route 
//               path="/login" 
//               element={
//                 <Login 
//                   setIsAuthenticated={setIsAuthenticated} 
//                   setUserType={setUserType} 
//                 />
//               } 
//             />
//             <Route
//               path="/booking"
//               element={
//                 <PrivateRoute isAuthenticated={isAuthenticated}>
//                   <Booking />
//                 </PrivateRoute>
//               }
//             />
//             <Route
//               path="/tracking"
//               element={
//                 <PrivateRoute isAuthenticated={isAuthenticated}>
//                   <Tracking />
//                 </PrivateRoute>
//               }
//             />
//             <Route path="/price-estimation" element={<PriceEstimation />} />
//             <Route
//               path="/driver"
//               element={
//                 <PrivateRoute isAuthenticated={isAuthenticated} userType={userType}>
//                   <Driver />
//                 </PrivateRoute>
//               }
//             />
//             <Route 
//               path="/" 
//               element={
//                 isAuthenticated ? (
//                   <div className="card">
//                     <h1>Welcome to the Logistics Platform</h1>
//                     <p>Choose an option from the navigation menu to get started.</p>
//                   </div>
//                 ) : (
//                   <Navigate to="/login" replace />
//                 )
//               } 
//             />
//           </Routes>
//         </div>
//       </div>
//     </Router>
//   );
// }

// function PrivateRoute({ children, isAuthenticated, userType }) {
//   const location = useLocation();

//   if (!isAuthenticated) {
//     return <Navigate to="/login" state={{ from: location }} replace />;
//   }

//   if (userType === 'driver' && location.pathname !== '/driver') {
//     return <Navigate to="/driver" replace />;
//   }

//   return children;
// }

// export default App;


import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, Navigate, useLocation } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import Booking from './components/Booking';
import Tracking from './components/Tracking';
import PriceEstimation from './components/PriceEstimation';
import DriverDashboard from './components/DriverDashboard';
import './styles/global.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userType, setUserType] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
      // You might want to verify the token here and set the user type
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setUserType(null);
  };

  return (
    <Router>
      <div className="App">
        <nav>
          <ul>
            {!isAuthenticated && (
              <>
                <li><Link to="/register">Register</Link></li>
                <li><Link to="/login">Login</Link></li>
              </>
            )}
            {isAuthenticated && userType === 'user' && (
              <>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/booking">Book a Ride</Link></li>
                <li><Link to="/tracking">Track Your Ride</Link></li>
                <li><Link to="/price-estimation">Price Estimation</Link></li>
              </>
            )}
            {isAuthenticated && userType === 'driver' && (
              <li><Link to="/driver-dashboard">Driver Dashboard</Link></li>
            )}
            {isAuthenticated && (
              <li><button className="btn" onClick={handleLogout}>Logout</button></li>
            )}
          </ul>
        </nav>

        <div className="container">
          <Routes>
            <Route path="/register" element={<Register />} />
            <Route 
              path="/login" 
              element={
                <Login 
                  setIsAuthenticated={setIsAuthenticated} 
                  setUserType={setUserType} 
                />
              } 
            />
            <Route
              path="/booking"
              element={
                <PrivateRoute isAuthenticated={isAuthenticated} userType="user">
                  <Booking />
                </PrivateRoute>
              }
            />
            <Route
              path="/tracking"
              element={
                <PrivateRoute isAuthenticated={isAuthenticated} userType="user">
                  <Tracking />
                </PrivateRoute>
              }
            />
            <Route path="/price-estimation" element={<PriceEstimation />} />
            <Route
              path="/driver-dashboard"
              element={
                <PrivateRoute isAuthenticated={isAuthenticated} userType="driver">
                  <DriverDashboard />
                </PrivateRoute>
              }
            />
            <Route 
              path="/" 
              element={
                isAuthenticated ? (
                  userType === 'user' ? (
                    <div className="card">
                      <h1>Welcome to the Logistics Platform</h1>
                      <p>Choose an option from the navigation menu to get started.</p>
                    </div>
                  ) : (
                    <Navigate to="/driver-dashboard" replace />
                  )
                ) : (
                  <Navigate to="/login" replace />
                )
              } 
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

function PrivateRoute({ children, isAuthenticated, userType }) {
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (userType === 'driver' && location.pathname !== '/driver-dashboard') {
    return <Navigate to="/driver-dashboard" replace />;
  }

  if (userType === 'user' && location.pathname === '/driver-dashboard') {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default App;