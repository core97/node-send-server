const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { validationResult } = require('express-validator');

module.exports = {
    authenticateUser: async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            res.status(401).json({ msg: 'El usuario no existe' });
            return next();
        }

        // verificar la contraseña con la contraseña encriptada
        if (await bcrypt.compare(password, user.password)) {
            // generar token
            const token = jwt.sign({
                id: user._id,
                name: user.name,
                email: user.email
            }, process.env.HASH_ENCRYPTATION, {
                expiresIn: '8h'
            });

            return res.status(200).json({ token });
        } else {
            return res.status(401).json({ msg: 'Password incorrecto' })

        }
    },
    userAuthenticated:  (req, res, next) => {
        return res.status(200).json({ user: req.user });
    }
}