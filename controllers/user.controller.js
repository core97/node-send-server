const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');
const User = require('../models/User');

module.exports = {
    newUser: async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const user = new User(req.body);
            await user.validate();

            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(user.password, salt);

            await user.save();

            res.status(200).json({ user });
        } catch (error) {
            console.log(error);
            res.status(500).json({ error });
        }
    }
}