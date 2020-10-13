const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { check } = require('express-validator');

router.post('/', [
    check('name', 'El *name* es obligatorio').not().isEmpty(),
    check('email', 'Introduce un *email* correcto').isEmail(),
    check('password', 'La *password* debe ser al menos 6 caracteres').isLength({ min: 6 }),
], userController.newUser);

module.exports = router;