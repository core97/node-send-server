const express = require('express');
const router = express.Router();
const filesController = require('../controllers/file.controller');
const authMiddleware = require('../middleware/auth.middleware');

router.post('/', authMiddleware.isValidToken, filesController.uploadFile);

router.get('/:myFile', filesController.download, filesController.deleteFile);

module.exports = router;