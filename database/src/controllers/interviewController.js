// backend/src/controllers/interviewController.js
const { generateQuestion, evaluateAnswer } = require('../services/aiInterviewerService');

exports.startInterview = async (req, res) => {
  try {
    const { jobId, candidateId } = req.body;
    // Fetch job and candidate details from the database
    // Generate initial question
    const initialQuestion = await generateQuestion(`Job ID: ${jobId}, Candidate ID: ${candidateId}`);
    res.json({ question: initialQuestion });
  } catch (error) {
    res.status(500).json({ message: 'Error starting interview', error: error.message });
  }
};

exports.processAnswer = async (req, res) => {
  try {
    const { question, answer } = req.body;
    const evaluation = await evaluateAnswer(question, answer);
    const nextQuestion = await generateQuestion(`Previous question: ${question}, Evaluation: ${JSON.stringify(evaluation)}`);
    res.json({ evaluation, nextQuestion });
  } catch (error) {
    res.status(500).json({ message: 'Error processing answer', error: error.message });
  }
};
