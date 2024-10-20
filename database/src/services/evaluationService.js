// backend/src/services/evaluationService.js
const { Configuration, OpenAIApi } = require('openai');

const openaiConfig = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(openaiConfig);

async function generateFinalReport(interviewData) {
  const { resumeScreeningResult, interviewResponses, codingAssessments } = interviewData;

  const prompt = `
    Generate a comprehensive evaluation report based on the following interview data:

    Resume Screening Result:
    ${JSON.stringify(resumeScreeningResult)}

    Interview Responses:
    ${JSON.stringify(interviewResponses)}

    Coding Assessments:
    ${JSON.stringify(codingAssessments)}

    Provide an overall assessment, highlighting strengths and areas for improvement. Include a final recommendation (Hire, Consider, or Reject) and a score out of 100.
  `;

  const response = await openai.createCompletion({
    model: 'text-davinci-002',
    prompt: prompt,
    maxTokens: 500,
  });

  return response.data.choices[0].text.trim();
}

module.exports = { generateFinalReport };