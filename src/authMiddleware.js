const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
  const header = req.headers.authorization || '';
  const [scheme, token] = header.split(' ');
  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({ error: 'Authentication required. Send Authorization: Bearer <token>.' });
  }
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET, { algorithms: ['HS256'] });
    return next();
  } catch {
    return res.status(401).json({ error: 'Token is invalid or expired.' });
  }
}

module.exports = authenticateToken;
