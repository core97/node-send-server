const express = require("express");
const { check } = require("express-validator");
const router = express.Router();
const linkController = require("../controllers/link.controller");
const authMiddleware = require("../middleware/auth.middleware");

router.post(
  "/",
  [
    check("filename", "Sube un archivo").not().isEmpty(),
    check("originalFilename", "Sube un archivo").not().isEmpty(),
    authMiddleware.isValidToken,
  ],
  linkController.newLink
);

router.post("/:url", linkController.verifyPassword, linkController.getLink);

router.get("/", linkController.getAllLinks);

router.get("/:url", linkController.hasPasswordLink, linkController.getLink);

module.exports = router;
