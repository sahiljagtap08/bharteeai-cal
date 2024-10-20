// backend/src/controllers/evaluationController.js
const { generateFinalReport } = require('../services/evaluationService');
const { getInterviewData } = require('../models/interviewModel'); // Implement this function to fetch interview data from your database

exports.generateReport = async (req, res) => {
  try {
    const { interviewId } = req.params;
    const interviewData = await getInterviewData(interviewId);
    const report = await generateFinalReport(interviewData);
    
    // Save the report to the database
    await saveReportToDatabase(interviewId, report);

    res.json({ report });
  } catch (error) {
    console.error('Error generating report:', error);
    res.status(500).json({ error: 'Failed to generate report' });
  }
};