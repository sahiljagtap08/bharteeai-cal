// backend/src/controllers/codeEvaluationController.js
const { exec } = require('child_process');
const fs = require('fs').promises;
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const TEMP_DIR = path.join(__dirname, '../temp');

async function ensureTempDir() {
  try {
    await fs.mkdir(TEMP_DIR, { recursive: true });
  } catch (error) {
    console.error('Error creating temp directory:', error);
  }
}

ensureTempDir();

function getFileExtension(language) {
  switch (language) {
    case 'javascript':
      return 'js';
    case 'python':
      return 'py';
    case 'java':
      return 'java';
    default:
      throw new Error('Unsupported language');
  }
}

function getExecutionCommand(language, filePath) {
  switch (language) {
    case 'javascript':
      return `node ${filePath}`;
    case 'python':
      return `python ${filePath}`;
    case 'java':
      const className = path.basename(filePath, '.java');
      return `javac ${filePath} && java -cp ${path.dirname(filePath)} ${className}`;
    default:
      throw new Error('Unsupported language');
  }
}

exports.evaluateCode = async (req, res) => {
  const { code, language } = req.body;
  const fileExtension = getFileExtension(language);
  const fileName = `${uuidv4()}.${fileExtension}`;
  const filePath = path.join(TEMP_DIR, fileName);

  try {
    await fs.writeFile(filePath, code);
    const command = getExecutionCommand(language, filePath);

    exec(command, { timeout: 5000 }, (error, stdout, stderr) => {
      fs.unlink(filePath);

      if (error) {
        console.error(`Execution error: ${error}`);
        return res.status(400).json({ error: 'Execution failed', details: stderr });
      }

      res.json({ output: stdout });
    });
  } catch (error) {
    console.error('Error writing file:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};