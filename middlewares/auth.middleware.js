const jwt = require('jsonwebtoken');
require('dotenv').config();

const authHandler = async (req, res, next) => {
    const token = req.headers.authorization;
    if (token) {
        try {
            const decoded = jwt.verify(token, process.env['secret_key']);
            req.user = { userId: decoded.userId }
            return next();
        } catch (error) {
            console.log("error in auth middleware", error);
            res.status(401).json({ success: false, message: "unauthorized access, please add the token" })
        }
    } else {
        res.status(401).json({ success: false, message: "unauthorized access, please add the token" })
    }
}
module.exports = { authHandler }