const expressJwt = require('express-jwt');

function Protect() {
  return expressJwt({
    secret: process.env.JWT_SECRET,
    algorithms: ['HS256'],
    isRevoked: isRevoked
  }).unless({
    path: [
      { url: /\/api\/v1\/products(.*)/, methods: ['GET', 'OPTIONS'] },
      { url: /\/api\/v1\/categories(.*)/, methods: ['GET', 'OPTIONS'] },
      '/api/v1/users/login',
      '/api/v1/users/register'
    ]
  });
}
async function isRevoked(req, payload, done) {
  if (!payload.isAdmin) {
    return done(null, true);
  } else {
    done();
  }
}
module.exports = Protect;
// const jwt = require('jsonwebtoken');
// const { User } = require('../models/User');

// const Protect = async (req, res, next) => {
//   try {
//     let token;
//     if (
//       req.headers.authorization &&
//       req.headers.authorization.startsWith('Bearer')
//     ) {
//       try {
//         token = req.headers.authorization.split(' ')[1];
//         const decode = jwt.verify(token, process.env.JWT_SECRET);
//         req.user = await User.findById(decode.id).select('-password');
//         next();
//       } catch (error) {
//         res.status(401);
//         throw new Error('not authorized , token failed');
//       }
//     }
//     if (!token) {
//       res.status(401);
//       throw new Error('not authorized , no token ');
//     }
//   } catch (error) {
//     res.json({
//       message: error.message
//     });
//   }
// };
// module.exports = { Protect };
