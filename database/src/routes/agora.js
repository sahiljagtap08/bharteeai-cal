// backend/src/routes/agora.js
const express = require('express');
const router = express.Router();
const { generateToken } = require('../controllers/agoraController');

router.post('/token', generateToken);

module.exports = router;