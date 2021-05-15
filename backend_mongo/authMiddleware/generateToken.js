const jwt = require('jsonwebtoken');

function generateToken(user) {
  return jwt.sign(
    {
      userId: user._id,
      isAdmin: user.isAdmin
    },
    process.env.JWT_SECRET,
    {
      expiresIn: '10d'
    }
  );
}

module.exports = generateToken;
