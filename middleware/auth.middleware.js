const jwt = require("jsonwebtoken");

module.exports = {
  isValidToken: (req, res, next) => {
    const authHeader = req.get("Authorization");

    if (authHeader) {
      const token = authHeader.split(" ")[1];
      if (token) {
        try {
          const user = jwt.verify(token, process.env.HASH_ENCRYPTATION);
          req.user = user;
        } catch (error) {
          console.log(error.message);
          return res.status(401).json({ msg: "JWT no valid" });
        }
      }
    }
    return next();
  },
};
