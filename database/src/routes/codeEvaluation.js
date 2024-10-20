// backend/src/routes/codeEvaluation.js
const express = require('express');
const router = express.Router();
const { evaluateCode } = require('../controllers/codeEvaluationController');

router.post('/evaluate', evaluateCode);

module.exports = router;