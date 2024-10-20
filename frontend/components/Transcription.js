// frontend/components/Transcription.js
import { useEffect, useState } from 'react';
import io from 'socket.io-client';

export default function Transcription() {
  const [transcript, setTranscript] = useState('');
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io('http://localhost:3000');
    setSocket(newSocket);

    newSocket.on('transcription', (data) => {
      setTranscript((prevTranscript) => prevTranscript + ' ' + data.text);
    });

    return () => newSocket.close();
  }, []);

  const startTranscription = () => {
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then((stream) => {
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0 && socket) {
            socket.emit('stream-data', event.data);
          }
        };
        mediaRecorder.start(250);
      })
      .catch((error) => console.error('Error accessing microphone:', error));
  };

  return (
    <div>
      <button onClick={startTranscription}>Start Transcription</button>
      <div>{transcript}</div>
    </div>
  );
}
