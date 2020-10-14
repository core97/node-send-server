const express = require('express');
const { check } = require('express-validator');
const router = express.Router();
const linkController = require('../controllers/link.controller');
const filesController = require('../controllers/file.controller');
const authMiddleware = require('../middleware/auth.middleware');

router.post('/', [
    check('name', 'Sube un archivo').not().isEmpty(),
    check('original_name', 'Sube un archivo').not().isEmpty(),
    authMiddleware
], linkController.newLink);

router.get('/:url', linkController.getLink, filesController.deleteFile);

module.exports = router;