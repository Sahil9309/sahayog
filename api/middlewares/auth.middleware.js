// middlewares/auth.middleware.js

const jwt = require('jsonwebtoken');
const jwtSecret = process.env.JWT_SECRET;

const authenticateToken = (req, res, next) => {
    const { token } = req.cookies;

    if (!token) {
        return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    jwt.verify(token, jwtSecret, {}, (err, userData) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid token.' });
        }
        // Attach user payload to the request object
        req.user = userData; 
        next(); // Proceed to the next middleware or route handler
    });
};

module.exports = { authenticateToken };