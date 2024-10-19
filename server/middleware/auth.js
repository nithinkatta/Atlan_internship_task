const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const token = req.header('x-auth-token');

  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.userId;
    req.userType = decoded.userType;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};
// const jwt = require('jsonwebtoken');

// module.exports = (requiredUserType) => (req, res, next) => {
//   const token = req.header('x-auth-token');

//   if (!token) {
//     return res.status(401).json({ message: 'No token, authorization denied' });
//   }

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = decoded;

//     if (requiredUserType && req.user.userType !== requiredUserType) {
//       return res.status(403).json({ message: 'Access denied' });
//     }

//     next();
//   } catch (error) {
//     res.status(401).json({ message: 'Token is not valid' });
//   }
// };