// backend/src/services/transcriptionService.js
const { Deepgram } = require('@deepgram/sdk');
const deepgram = new Deepgram(process.env.DEEPGRAM_API_KEY);

function setupTranscriptionSocket(io) {
  io.on('connection', (socket) => {
    console.log('Client connected for transcription');

    const deepgramLive = deepgram.transcription.live({
      punctuate: true,
      interim_results: true,
    });

    deepgramLive.addListener('transcriptReceived', (transcription) => {
      const { text } = transcription.channel;
      socket.emit('transcription', { text });
    });

    socket.on('stream-data', (data) => {
      deepgramLive.send(data);
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected from transcription');
      deepgramLive.finish();
    });
  });
}

module.exports = { setupTranscriptionSocket };