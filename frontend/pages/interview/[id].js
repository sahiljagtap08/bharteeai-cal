// frontend/pages/interview/[id].js
import { useState } from 'react';
import dynamic from 'next/dynamic';
import VideoCall from '../../components/VideoCall';

const CodeEditor = dynamic(() => import('../../components/CodeEditor'), { ssr: false });

export default function Interview() {
  const [code, setCode] = useState('// Write your code here');
  const [language, setLanguage] = useState('javascript');

  const handleCodeChange = (newCode) => {
    setCode(newCode);
  };

  const handleLanguageChange = (event) => {
    setLanguage(event.target.value);
  };

  const handleSubmit = async () => {
    // Send code to backend for evaluation
    const response = await fetch('/api/evaluate-code', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, language }),
    });
    const result = await response.json();
    console.log(result);
  };

  return (
    <div>
      <h1>Technical Interview</h1>
      <VideoCall channelName="interview-channel" token="your-agora-token" />
      <div>
        <select value={language} onChange={handleLanguageChange}>
          <option value="javascript">JavaScript</option>
          <option value="python">Python</option>
          <option value="java">Java</option>
        </select>
      </div>
      <CodeEditor language={language} code={code} onChange={handleCodeChange} />
      <button onClick={handleSubmit}>Submit Code</button>
    </div>
  );
}
