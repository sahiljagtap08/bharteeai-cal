/ frontend/components/VideoCall.js
import { useState, useEffect } from 'react';
import AgoraRTC from 'agora-rtc-sdk-ng';

const client = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });

export default function VideoCall({ channelName, token }) {
  const [localVideoTrack, setLocalVideoTrack] = useState(null);
  const [remoteUsers, setRemoteUsers] = useState([]);

  useEffect(() => {
    const init = async () => {
      client.on('user-published', async (user, mediaType) => {
        await client.subscribe(user, mediaType);
        if (mediaType === 'video') {
          setRemoteUsers(prevUsers => [...prevUsers, user]);
        }
      });

      client.on('user-unpublished', (user) => {
        setRemoteUsers(prevUsers => prevUsers.filter(u => u.uid !== user.uid));
      });

      await client.join(process.env.NEXT_PUBLIC_AGORA_APP_ID, channelName, token, null);
      const tracks = await AgoraRTC.createMicrophoneAndCameraTracks();
      setLocalVideoTrack(tracks[1]);
      await client.publish(tracks);
    };

    init();

    return () => {
      if (localVideoTrack) {
        localVideoTrack.stop();
        localVideoTrack.close();
      }
      client.removeAllListeners();
      client.leave();
    };
  }, [channelName, token]);

  return (
    <div>
      <div id="local-video">
        {localVideoTrack && <LocalVideoTrack track={localVideoTrack} />}
      </div>
      {remoteUsers.map(user => (
        <RemoteVideoTrack key={user.uid} user={user} />
      ))}
    </div>
  );
}

function LocalVideoTrack({ track }) {
  useEffect(() => {
    const container = document.getElementById('local-video');
    track.play(container);
    return () => {
      track.stop();
    };
  }, [track]);

  return null;
}

function RemoteVideoTrack({ user }) {
  useEffect(() => {
    const container = document.getElementById(`remote-video-${user.uid}`);
    user.videoTrack.play(container);
    return () => {
      user.videoTrack.stop();
    };
  }, [user]);

  return <div id={`remote-video-${user.uid}`} />;
}
