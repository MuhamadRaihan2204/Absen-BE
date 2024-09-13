const jwt = require('jsonwebtoken');
const User = require('../models/user');
const redisClient = require('../config/redisClient');

const authenticateToken = async (req, res, next) => {
  const token = req.headers.authorization && req.headers.authorization.split(' ')[1];

  if (token == null) return res.status(401).json({ error: "Token required" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const redisToken = await redisClient.get(`user:${decoded.id}:token`);
    if (redisToken !== token) return res.status(403).json({ error: "Invalid token" });

    const user = await User.findByPk(decoded.id);
    if (!user) return res.status(403).json({ error: "User not found" });

    req.user = user;
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Token has expired" });
    } else {
      return res.status(403).json({ error: "Invalid token" });
    }
  }
};

module.exports = authenticateToken;
