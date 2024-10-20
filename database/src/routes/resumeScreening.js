// backend/src/routes/resumeScreening.js
const express = require('express');
const router = express.Router();
const { handleResumeScreening, addNewJob, addNewResume } = require('../controllers/resumeScreeningController');

router.post('/screen', handleResumeScreening);
router.post('/job', addNewJob);
router.post('/resume', addNewResume);

module.exports = router;