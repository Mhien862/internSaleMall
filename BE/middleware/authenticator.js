import jwt from 'jsonwebtoken'
require('dotenv').config();

const verifyJWT = (req, res, next) => {
    let authHeader = req.headers.authorization || req.headers.Authorization

    if (!authHeader?.startsWith('Bearer ')) {
        return res.status(401).send('Unauthorized')
    }
    let token = authHeader.split(' ')[1]
    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        (err, decoded) => {
            if (err) return res.status(403).send('invalid token');
            req.user = decoded.username;
            return next();
        }
    );
}

module.exports = verifyJWT