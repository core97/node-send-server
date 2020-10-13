const express = require('express');
const { check } = require('express-validator');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const authMiddleware = require('../middleware/auth.middleware');

router.post('/', [
    check('email', 'Introduce un *email* válido').isEmail(),
    check('password', 'La *password* debe ser al menos 6 caracteres').isLength({ min: 6 }),
], authController.authenticateUser);

router.get('/', [authMiddleware], authController.userAuthenticated);

module.exports = router;