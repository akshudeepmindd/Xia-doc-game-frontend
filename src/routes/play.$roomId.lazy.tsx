import { useEffect, useState, useCallback, useRef } from 'react';
import ReactPlayer from 'react-player';
import { Unity, useUnityContext } from 'react-unity-webgl';
import { useQuery } from '@tanstack/react-query';
import { getRoomDetailService } from '@/services/room';
import { GET_ROOMS_DETAILS } from '@/lib/constants';
import { createLazyFileRoute, useParams } from '@tanstack/react-router';
import { PacmanLoader } from 'react-spinners';
import PrivateRoute from '@/components/PrivateRoute';
import Camera1SignalServer from '../utils/Camera1Serverclass';
import Camera2SignalServer from '@/utils/Camera2Serverclass';
type SignalServerMessage = {
  type: string;
  candidate?: RTCIceCandidateInit;
  sdp?: string;
};
const GameComponent = () => {
  const { roomId } = useParams({ strict: false });
  const [loaded, setLoaded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: window.innerWidth, height: window.innerHeight });
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
  const peerConnection = useRef<RTCPeerConnection | null>(null);
  const peerConnection2 = useRef<RTCPeerConnection | null>(null);
  const remoteVideoRef2 = useRef<HTMLVideoElement | null>(null);
  // const peerConnection = useRef<RTCPeerConnection | null>(null);
  useEffect(() => {
    const handleResize = () => {
      setSize({ width: window.innerWidth, height: window.innerHeight });
    };

    handleResize(); // Set initial size
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  useEffect(() => {
    const remote = remoteVideoRef.current;
    const channel = new Camera1SignalServer(roomId);

    channel.onmessage = (e: { data: SignalServerMessage }) => {
      if (e.data.type === 'icecandidate' && peerConnection.current) {
        peerConnection2.current.addIceCandidate(e.data.candidate);
      } else if (e.data.type === 'offer') {
        console.log('Received offer');
        handleOffer(e.data);
      }
    };

    const handleOffer = (offer: RTCSessionDescriptionInit) => {
      const config: RTCConfiguration = {};
      peerConnection2.current = new RTCPeerConnection(config);

      // Add track event listener
      peerConnection2.current.addEventListener('track', (e: RTCTrackEvent) => {
        if (remote) {
          remote.srcObject = e.streams[0];
        }
      });

      // Handle ICE candidates
      peerConnection2.current.addEventListener('icecandidate', (e: RTCPeerConnectionIceEvent) => {
        if (e.candidate) {
          const candidate = {
            candidate: e.candidate.candidate,
            sdpMid: e.candidate.sdpMid,
            sdpMLineIndex: e.candidate.sdpMLineIndex,
          };
          channel.postMessage({ type: 'icecandidate', candidate });
        }
      });

      // Set remote description and create answer
      peerConnection2.current
        .setRemoteDescription(offer)
        .then(() => peerConnection2.current?.createAnswer())
        .then(async (answer) => {
          if (peerConnection2.current) {
            await peerConnection2.current.setLocalDescription(answer);
            console.log('Created answer, sending...');
            channel.postMessage({
              type: 'answer',
              sdp: answer.sdp,
            });
          }
        });
    };

    // Optional cleanup function on component unmount
    return () => {
      if (peerConnection2.current) {
        peerConnection2.current.close();
      }
    };
  }, []);
  useEffect(() => {
    const remote = remoteVideoRef2.current;
    const channel = new Camera2SignalServer(roomId);

    channel.onmessage = (e: { data: SignalServerMessage }) => {
      if (e.data.type === 'icecandidate' && peerConnection.current) {
        peerConnection.current.addIceCandidate(e.data.candidate);
      } else if (e.data.type === 'offer') {
        console.log('Received offer');
        handleOffer(e.data);
      }
    };

    const handleOffer = (offer: RTCSessionDescriptionInit) => {
      const config: RTCConfiguration = {};
      peerConnection.current = new RTCPeerConnection(config);

      // Add track event listener
      peerConnection.current.addEventListener('track', (e: RTCTrackEvent) => {
        if (remote) {
          remote.srcObject = e.streams[0];
        }
      });

      // Handle ICE candidates
      peerConnection.current.addEventListener('icecandidate', (e: RTCPeerConnectionIceEvent) => {
        if (e.candidate) {
          const candidate = {
            candidate: e.candidate.candidate,
            sdpMid: e.candidate.sdpMid,
            sdpMLineIndex: e.candidate.sdpMLineIndex,
          };
          channel.postMessage({ type: 'icecandidate', candidate });
        }
      });

      // Set remote description and create answer
      peerConnection.current
        .setRemoteDescription(offer)
        .then(() => peerConnection.current?.createAnswer())
        .then(async (answer) => {
          if (peerConnection.current) {
            await peerConnection.current.setLocalDescription(answer);
            console.log('Created answer, sending...');
            channel.postMessage({
              type: 'answer',
              sdp: answer.sdp,
            });
          }
        });
    };

    // Optional cleanup function on component unmount
    return () => {
      if (peerConnection.current) {
        peerConnection.current.close();
      }
    };
  }, []);
  // Update size based on orientation
  const isMobile = window.innerWidth <= 768;
  const isLandscape = window.innerWidth > window.innerHeight;

  const unityWidth = isMobile && !isLandscape ? size.height : size.width;
  const unityHeight = isMobile && !isLandscape ? size.width : size.height;
  const [streamReady1, setStreamReady1] = useState(false); // For camera 1
  const [streamReady2, setStreamReady2] = useState(false); // For camera 2
  const { unityProvider, loadingProgression, isLoaded } = useUnityContext({
    loaderUrl: '/Build/Gameplay.loader.js',
    dataUrl: '/Build/Gameplay.data',
    frameworkUrl: '/Build/Gameplay.framework.js',
    codeUrl: '/Build/Gameplay.wasm',
  });
  useEffect(() => {
    if (isLoaded) {
      setLoaded(true);
    } else {
      setLoaded(false);
    }
  }, [isLoaded]);
  const { data: roomDetails } = useQuery({
    queryKey: [GET_ROOMS_DETAILS],
    queryFn: async () => getRoomDetailService(roomId || ''),
    enabled: !!roomId,
    refetchInterval: 1000, // Fetch every 1 second to get the latest stream keys
    refetchIntervalInBackground: true,
  });

  return (
    <>
      {!isLoaded && (
        <div
          style={{
            width: '100%',
            height: '100vh',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            background: '#0000',
          }}
          className="bg-[#000] bg-no-repeat bg-cover"
        >
          <div style={{ color: '#000', fontSize: 30 }}> {Math.round(loadingProgression * 100)}%</div>
          <div>
            <PacmanLoader color="#000" />
          </div>
        </div>
      )}
      <div
        style={{
          width: '100%',
          height: '100vh',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          background: '#000',
        }}
        className="bg-[#000] bg-no-repeat bg-cover"
      >
        {!isLandscape && isMobile && (
          <div className="landscape-warning">Please rotate your device to landscape mode.</div>
        )}
        <Unity
          unityProvider={unityProvider}
          style={{
            width: unityWidth,
            height: unityHeight,
            visibility: isLoaded ? 'visible' : 'hidden',
          }}
          devicePixelRatio={window.devicePixelRatio}
        />
        {/* {streamReady1 && ( */}
        <div className="live-stream-container" style={{ visibility: isLoaded ? 'visible' : 'hidden' }}>
          <video ref={remoteVideoRef} autoPlay></video>
        </div>
        {/* )}{' '} */}
        {/* {streamReady2 && ( */}
        <div
          className="live-stream-container2"
          style={{
            position: 'absolute',
            top: '24%',
            left: '34%',
            height: '25% !important',
            visibility: isLoaded ? 'visible' : 'hidden',
          }}
        >
          <video ref={remoteVideoRef2} autoPlay></video>
        </div>
        {/* )} */}
      </div>
    </>
  );

  // );
};

export const Route = createLazyFileRoute('/play/$roomId')({
  component: () => (
    <PrivateRoute>
      <GameComponent />
    </PrivateRoute>
  ),
});
