// backend/src/services/s3Service.js
const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const s3 = new AWS.S3();

async function uploadInterviewRecording(interviewId, recordingBuffer) {
  const params = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: `interviews/${interviewId}/${uuidv4()}.webm`,
    Body: recordingBuffer,
    ContentType: 'video/webm',
  };

  try {
    const result = await s3.upload(params).promise();
    return result.Location;
  } catch (error) {
    console.error('Error uploading to S3:', error);
    throw error;
  }
}

async function getInterviewRecording(interviewId, fileName) {
  const params = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: `interviews/${interviewId}/${fileName}`,
  };

  try {
    const result = await s3.getObject(params).promise();
    return result.Body;
  } catch (error) {
    console.error('Error getting object from S3:', error);
    throw error;
  }
}

module.exports = {
  uploadInterviewRecording,
  getInterviewRecording,
};

// Usage in a controller
const { uploadInterviewRecording } = require('../services/s3Service');

exports.saveInterviewRecording = async (req, res) => {
  try {
    const { interviewId } = req.params;
    const recordingBuffer = req.file.buffer;
    const recordingUrl = await uploadInterviewRecording(interviewId, recordingBuffer);
    res.json({ recordingUrl });
  } catch (error) {
    res.status(500).json({ error: 'Failed to save interview recording' });
  }
};