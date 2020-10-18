const shortId = require("shortid");
const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");
const Link = require("../models/Link");
const e = require("express");

module.exports = {
  newLink: async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      originalFilename,
      filename,
      availableDownloads,
      passwordFile,
    } = req.body;

    const link = new Link();
    link.url = shortId.generate();
    link.name = filename;
    link.original_name = originalFilename;

    try {
      // si el usuario está autenticado
      if (req.user) {
        // asignar número de descargas a 'link'
        if (availableDownloads) link.downloads = availableDownloads;
        // asignar contraseña a 'link'
        if (passwordFile) {
          const salt = await bcrypt.genSalt(10);
          link.password = await bcrypt.hash(passwordFile, salt);
        }
        // asignar autor a 'link'
        link.author = req.user.id;
      }

      await link.validate();
      await link.save();

      return res.status(200).json({ url: link.url });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ msg: error });
    }
  },
  getAllLinks: async (req, res, next) => {
    try {
      const links = await Link.find({}).select("url -_id");
      return res.status(200).json({ links });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ msg: error });
    }
  },
  hasPasswordLink: async (req, res, next) => {
    try {
      const { url } = req.params;

      const link = await Link.findOne({ url });

      if (!link) {
        return res.status(404).json({ msg: "No existe ese *link*" });
      }

      if (link.password) {
        return res.status(200).json({
          password: true,
          link: {
            filename: link.name,
            url: link.url,
          },
        });
      }

      return next();
    } catch (error) {
      console.log(error);
      return res.status(500).json({ msg: error });
    }
  },
  verifyPassword: async (req, res, next) => {
    try {
      const { url } = req.params;
      const { filePassword } = req.body;

      const link = await Link.findOne({ url });

      if (bcrypt.compareSync(filePassword, link.password)) {
        next();
      } else {
        return res.status(401).json({ msg: "La contraseña es incorrecta" });
      }
    } catch (error) {
      console.log(error);
    }
  },
  getLink: async (req, res, next) => {
    try {
      const { url } = req.params;

      const link = await Link.findOne({ url });

      if (!link) {
        return res.status(404).json({ msg: "No existe ese *link*" });
      }

      return res.status(200).json({
        password: false,
        link: {
          filename: link.name,
          url: link.url,
        },
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ msg: error });
    }
  },
};
