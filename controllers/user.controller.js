const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");
const User = require("../models/User");

module.exports = {
  newUser: async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      if (await User.findOne({ email: req.body.email })) {
        return res.status(422).json({ msg: "El usuario ya existe" });
      }

      const user = new User(req.body);
      await user.validate();

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(user.password, salt);

      await user.save();

      req.user = { email: user.email, password: req.body.password };
      // autenticar usuario nuevo generando el token
      return next();
    } catch (error) {
      console.log(error);
      res.status(500).json({ error });
    }
  },
};
