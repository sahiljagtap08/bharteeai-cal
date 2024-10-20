// backend/src/routes/evaluation.js
const express = require('express');
const router = express.Router();
const { generateReport } = require('../controllers/evaluationController');

router.get('/report/:interviewId', generateReport);

module.exports = router;
