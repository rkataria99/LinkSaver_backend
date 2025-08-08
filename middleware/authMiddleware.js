const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  const header = req.header('Authorization') || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ msg: 'No token, access denied' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev-insecure');
    req.user = decoded.id;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};
