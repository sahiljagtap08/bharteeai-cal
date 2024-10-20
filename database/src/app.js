// backend/src/app.js
const express = require('express');
const cors = require('cors');
const { config } = require('dotenv');
const authRoutes = require('./routes/auth');
const interviewRoutes = require('./routes/interview');
const codeEvaluationRoutes = require('./routes/codeEvaluation');
const evaluationRoutes = require('./routes/evaluation');
const http = require('http');
const socketIo = require('socket.io');
const { setupTranscriptionSocket } = require('./services/transcriptionService');

const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

setupTranscriptionSocket(io);

server.listen(3000, () => console.log('Server running on port 3000'));

config(); // Load environment variables



const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/interview', interviewRoutes);

app.use('/api/code', codeEvaluationRoutes);

app.use('/api/evaluation', evaluationRoutes);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
