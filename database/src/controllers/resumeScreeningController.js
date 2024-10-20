// backend/src/controllers/resumeScreeningController.js
const { screenResume, addJobDescription, addResume } = require('../services/resumeScreeningService');

exports.handleResumeScreening = async (req, res) => {
  try {
    const { jobId, candidateId } = req.body;
    const result = await screenResume(jobId, candidateId);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Error screening resume', error: error.message });
  }
};

exports.addNewJob = async (req, res) => {
  try {
    const { jobId, description } = req.body;
    await addJobDescription(jobId, description);
    res.json({ message: 'Job description added successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error adding job description', error: error.message });
  }
};

exports.addNewResume = async (req, res) => {
  try {
    const { candidateId, resumeText } = req.body;
    await addResume(candidateId, resumeText);
    res.json({ message: 'Resume added successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error adding resume', error: error.message });
  }
};
