const express = require('express');
const router = express.Router();
const filesController = require('../controllers/file.controller');
const authMiddleware = require('../middleware/auth.middleware');

router.post('/', [
    authMiddleware
], filesController.uploadFile);

module.exports = router;