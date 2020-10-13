const shortId = require('shortid');
const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');
const Link = require('../models/Link');

module.exports = {
    newLink: async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { original_name } = req.body;

        const link = new Link();
        link.url = shortId.generate();
        link.name = shortId.generate();
        link.original_name = original_name;

        try {
            // usuarios autenticados
            if (req.user) {
                const { password, downloads } = req.body;

                // asignar número de descargas a 'link'
                if (downloads) link.downloads = downloads;
                // asignar contraseña a 'link'
                if (password) {
                    const salt = await bcrypt.genSalt(10);
                    link.password = await bcrypt.hash(password, salt);
                }
                // asignar autor a 'link'
                link.author = req.user.id;
            }

            await link.validate();
            await link.save();

            return res.status(200).json({ msg: link.url });
        } catch (error) {
            console.log(error);
        }
    }
}