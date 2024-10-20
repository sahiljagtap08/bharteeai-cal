// backend/src/services/resumeScreeningService.js
const { ChromaClient } = require('chromadb');
const { Configuration, OpenAIApi } = require('openai');

const chromaClient = new ChromaClient();
const jobCollection = chromaClient.getCollection('job_descriptions');
const resumeCollection = chromaClient.getCollection('resumes');

const openaiConfig = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(openaiConfig);

async function screenResume(jobId, candidateId) {
  // Fetch job description
  const jobResults = await jobCollection.query({
    queryTexts: [`id:${jobId}`],
    nResults: 1,
  });
  const jobDescription = jobResults.documents[0];

  // Fetch candidate resume
  const resumeResults = await resumeCollection.query({
    queryTexts: [`id:${candidateId}`],
    nResults: 1,
  });
  const resume = resumeResults.documents[0];

  // Use GPT-3 to analyze the match
  const prompt = `Job Description: ${jobDescription}\n\nResume: ${resume}\n\nAnalyze the match between the job description and the resume. Provide a score from 0 to 100 and a brief explanation.`;

  const response = await openai.createCompletion({
    model: 'text-davinci-002',
    prompt: prompt,
    maxTokens: 150,
  });

  const analysis = response.data.choices[0].text.trim();

  // Extract score and explanation
  const scoreMatch = analysis.match(/Score: (\d+)/);
  const score = scoreMatch ? parseInt(scoreMatch[1]) : 0;
  const explanation = analysis.replace(/Score: \d+/, '').trim();

  return { score, explanation };
}

async function addJobDescription(jobId, description) {
  await jobCollection.add({
    ids: [jobId],
    documents: [description],
    metadatas: [{ jobId }],
  });
}

async function addResume(candidateId, resumeText) {
  await resumeCollection.add({
    ids: [candidateId],
    documents: [resumeText],
    metadatas: [{ candidateId }],
  });
}

module.exports = {
  screenResume,
  addJobDescription,
  addResume,
};
