const express = require('express');
const { check } = require('express-validator');
const router = express.Router();
const linkController = require('../controllers/link.controller');
const authMiddleware = require('../middleware/auth.middleware');

router.post('/', [
    check('name', 'Sube un archivo').not().isEmpty(),
    check('original_name', 'Sube un archivo').not().isEmpty(),
    authMiddleware
], linkController.newLink);

module.exports = router;