// backend/src/routes/interview.js
const express = require('express');
const router = express.Router();
const { startInterview, processAnswer } = require('../controllers/interviewController');

router.post('/start', startInterview);
router.post('/answer', processAnswer);

module.exports = router;