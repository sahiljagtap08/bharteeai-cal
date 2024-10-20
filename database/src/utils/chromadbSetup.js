// backend/src/utils/chromadbSetup.js
const { ChromaClient } = require('chromadb');

async function initializeChromaDB() {
  const client = new ChromaClient();

  // Create a collection for job descriptions
  const jobCollection = await client.createCollection("job_descriptions");

  // Create a collection for resumes
  const resumeCollection = await client.createCollection("resumes");

  return { client, jobCollection, resumeCollection };
}

async function addJobDescription(jobCollection, jobId, description) {
  await jobCollection.add({
    ids: [jobId],
    documents: [description],
    metadatas: [{ jobId }],
  });
}

async function addResume(resumeCollection, candidateId, resumeText) {
  await resumeCollection.add({
    ids: [candidateId],
    documents: [resumeText],
    metadatas: [{ candidateId }],
  });
}

async function searchSimilarDocuments(collection, queryText, nResults = 5) {
  const results = await collection.query({
    queryTexts: [queryText],
    nResults: nResults,
  });

  return results;
}

module.exports = {
  initializeChromaDB,
  addJobDescription,
  addResume,
  searchSimilarDocuments,
};

// Usage in backend/src/services/resumeScreeningService.js
const { initializeChromaDB, addJobDescription, addResume, searchSimilarDocuments } = require('../utils/chromadbSetup');
const { Configuration, OpenAIApi } = require('openai');

let jobCollection, resumeCollection;

async function initializeCollections() {
  const { jobCollection: jc, resumeCollection: rc } = await initializeChromaDB();
  jobCollection = jc;
  resumeCollection = rc;
}

initializeCollections();

const openaiConfig = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(openaiConfig);

async function screenResume(jobId, candidateId) {
  // Fetch job description
  const jobResults = await searchSimilarDocuments(jobCollection, `id:${jobId}`, 1);
  const jobDescription = jobResults.documents[0];

  // Fetch candidate resume
  const resumeResults = await searchSimilarDocuments(resumeCollection, `id:${candidateId}`, 1);
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

async function addNewJob(jobId, description) {
  await addJobDescription(jobCollection, jobId, description);
}

async function addNewResume(candidateId, resumeText) {
  await addResume(resumeCollection, candidateId, resumeText);
}

module.exports = {
  screenResume,
  addNewJob,
  addNewResume,
};