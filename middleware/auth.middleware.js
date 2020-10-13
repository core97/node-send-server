const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const authHeader = req.get('Authorization');

    if (authHeader) {
        try {
            const token = authHeader.split(' ')[1];
            const user = jwt.verify(token, process.env.HASH_ENCRYPTATION);
            req.user = user;
        } catch (error) {
            return res.status(401).json({ msg: 'JWT no valid' });
        }
    }

    return next();
}