const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // here, (see below)
        //split by . will give malformed token error, because of Bearer token, so we need to split it and get the actual token
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Invalid token.' });
    }
}

module.exports = verifyToken;