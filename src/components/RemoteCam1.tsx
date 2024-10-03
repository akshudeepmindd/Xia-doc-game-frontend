import React, { useEffect, useRef, useState } from 'react';
import Camera1SignalServer from '@/utils/Camera1Serverclass';

// Ensure SignalServer is globally accessible
declare global {
  interface Window {
    SignalServer: any;
  }
}

const RemoteStream: React.FC<{ roomId: string }> = ({ roomId }) => {
  const remoteVideoRef = useRef<HTMLVideoElement>(null); // Ref for the remote video element
  const [peerConnection, setPeerConnection] = useState<RTCPeerConnection | null>(null); // Peer connection state
  const iceCandidatesQueue = useRef<RTCIceCandidate[]>([]); // Queue for ICE candidates before connection is established
  const channel = useRef<Camera1SignalServer | null>(null);

  useEffect(() => {
    // Initialize the signaling server
    if (!channel.current) {
      channel.current = new Camera1SignalServer(roomId);
    }

    // Handle incoming messages from the signaling server
    channel.current.onmessage = (e: any) => {
      if (e.data.type === 'icecandidate') {
        peerConnection?.addIceCandidate(e.data.candidate);
      } else if (e.data.type === 'offer') {
        console.log('Received offer');
        handleOffer(e.data);
      }
    };

    // Cleanup when the component unmounts
    return () => {
      if (peerConnection) {
        peerConnection.close();
      }
    };
  }, [roomId, peerConnection]); // Added roomId and peerConnection dependencies

  const handleOffer = (offer: RTCSessionDescriptionInit) => {
    const config: RTCConfiguration = {
      iceServers: [
        { urls: 'stun:64.20.39.42:3478' }, // Public STUN server
        {
          urls: 'turn:64.20.39.42:3478',
          username: 'xocdia',
          credential: 'xocdia1234',
        },
      ],
    };

    const newPeerConnection = new RTCPeerConnection(config);

    // Handle receiving remote media streams
    newPeerConnection.addEventListener('track', (e: RTCTrackEvent) => {
      console.log(e, 'eeeeeeeeee12312321321312');
      if (e.streams && e.streams.length > 0) {
        console.log(e.streams[0], 'streammmasdasdsad');
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = e.streams[0]; // Set the remote stream directly
        }
      } else {
        console.error('No streams received in the track event');
      }
    });

    // Handle ICE candidates
    newPeerConnection.addEventListener('icecandidate', (e: RTCPeerConnectionIceEvent) => {
      if (e.candidate) {
        console.log('Generated local ICE candidate:', e.candidate);
        const candidate = {
          candidate: e.candidate.candidate,
          sdpMid: e.candidate.sdpMid,
          sdpMLineIndex: e.candidate.sdpMLineIndex,
        };
        channel.current?.postMessage({ type: 'icecandidate', candidate, userId: localStorage.getItem('userId') });
      }
    });

    // Set remote offer description and create an answer
    newPeerConnection
      .setRemoteDescription(offer)
      .then(() => newPeerConnection.createAnswer())
      .then(async (answer) => {
        await newPeerConnection.setLocalDescription(answer);
        console.log('Created answer, sending...');
        channel.current?.postMessage({
          type: 'answer',
          sdp: answer.sdp,
          userId: localStorage.getItem('userId'),
        });

        // Add any queued ICE candidates
        iceCandidatesQueue.current.forEach((candidate) => {
          newPeerConnection.addIceCandidate(candidate);
        });
        iceCandidatesQueue.current = []; // Clear the queue after processing
      });

    // Update the peer connection state
    setPeerConnection(newPeerConnection);
  };

  return (
    <div>
      {/* Render the video element */}
      <video ref={remoteVideoRef} autoPlay playsInline style={{ width: '100%', height: 'auto' }} />
    </div>
  );
};

export default RemoteStream;
