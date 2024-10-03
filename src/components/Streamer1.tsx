import React, { useEffect, useRef, useState } from 'react';
import Camera1SignalServer from '@/utils/Camera1Serverclass'; // Import your SignalServer class

const VideoStreamer: React.FC<{ roomId: string }> = ({ roomId }) => {
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const [peerConnection, setPeerConnection] = useState<RTCPeerConnection | null>(null);
  const channel = useRef<Camera1SignalServer | null>(null); // Use ref for SignalServer instance
  const [isVideoStarted, setIsVideoStarted] = useState(false);
  const [isStreamButtonDisabled, setIsStreamButtonDisabled] = useState(true);

  // Initialize the signaling server once per room
  useEffect(() => {
    channel.current = new Camera1SignalServer(roomId); // Create a new SignalServer instance

    // Handle incoming messages from the signaling server
    const handleIncomingMessage = (e: any) => {
      if (e.data.type === 'icecandidate') {
        peerConnection?.addIceCandidate(e.data.candidate);
      } else if (e.data.type === 'answer') {
        console.log('Received answer');
        peerConnection?.setRemoteDescription(new RTCSessionDescription(e.data));
      }
    };

    const currentChannel = channel.current;
    currentChannel.onmessage = handleIncomingMessage;

    return () => {
    //   currentChannel?.onmessage = null; // Clean up on component unmount
    //   currentChannel?.close(); // Ensure to close the signaling channel if needed
    };
  }, [roomId, peerConnection]); // Add peerConnection dependency if it's modified elsewhere

  // Function to start video stream
  const startVideo = async () => {
    setIsVideoStarted(true);
    setIsStreamButtonDisabled(false);
    if (localVideoRef.current) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
        localVideoRef.current.srcObject = stream;
      } catch (error) {
        console.error('Error accessing media devices.', error);
      }
    }
  };

  // Function to initiate streaming
  const streamVideo = () => {
    setIsStreamButtonDisabled(true);
    const config = {
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
    setPeerConnection(newPeerConnection); // Set the new peer connection

    newPeerConnection.addEventListener('icecandidate', (e) => {
      if (e.candidate) {
        const candidate = {
          candidate: e.candidate.candidate,
          sdpMid: e.candidate.sdpMid,
          sdpMLineIndex: e.candidate.sdpMLineIndex,
        };
        channel.current?.postMessage({ type: 'icecandidate', candidate }); // Use optional chaining
      }
    });

    const localStream = localVideoRef.current?.srcObject as MediaStream;
    if (localStream) {
      localStream.getTracks().forEach((track) => {
        newPeerConnection.addTrack(track, localStream);
      });

      newPeerConnection.createOffer({ offerToReceiveAudio: true, offerToReceiveVideo: true }).then(async (offer) => {
        await newPeerConnection.setLocalDescription(offer);
        console.log('Created offer, sending...');
        channel.current?.postMessage({ type: 'offer', sdp: offer.sdp }); // Use optional chaining
      });
    }
  };

  return (
    <div>
      <video id="local" ref={localVideoRef} autoPlay muted></video>
      <button onClick={startVideo} disabled={isVideoStarted}>
        Start Video
      </button>
      <button onClick={streamVideo} id="stream" disabled={isStreamButtonDisabled}>
        Stream Video
      </button>
    </div>
  );
};

export default VideoStreamer;
