import React, { useEffect, useState, useRef } from 'react';
import ReactPlayer from 'react-player';
import { Unity, useUnityContext } from 'react-unity-webgl';
import { useQuery } from '@tanstack/react-query';
import { getRoomDetailService } from '@/services/room';
import { GET_ROOMS_DETAILS } from '@/lib/constants';
import { createLazyFileRoute, useParams } from '@tanstack/react-router';
import { PacmanLoader } from 'react-spinners';
import PrivateRoute from '@/components/PrivateRoute';
import RemoteStream from '@/components/RemoteCam1';
import SecondRemoteStream from '@/components/RemoteCam2';
import ReactHlsPlayer from 'react-hls-player';

const RemoteStreamComponent = React.memo(({ roomId }) => <RemoteStream roomId={roomId} />);

const GameComponent = () => {
  const { roomId } = useParams({ strict: false });
  const [loaded, setLoaded] = useState(false);
  const [size, setSize] = useState({ width: window.innerWidth, height: window.innerHeight });
  const playerref = useRef<HTMLVideoElement | null>(null);

  // Unity context
  const { unityProvider, loadingProgression, isLoaded } = useUnityContext({
    loaderUrl: 'https://unity-build-xoc.s3.eu-north-1.amazonaws.com/Gameplay.loader.js',
    dataUrl: 'https://unity-build-xoc.s3.eu-north-1.amazonaws.com/Gameplay.data',
    frameworkUrl: 'https://unity-build-xoc.s3.eu-north-1.amazonaws.com/Gameplay.framework.js',
    codeUrl: 'https://unity-build-xoc.s3.eu-north-1.amazonaws.com/Gameplay.wasm',
  });

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setSize({ width: window.innerWidth, height: window.innerHeight });
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Set initial size

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    if (isLoaded) {
      setLoaded(true);
    } else {
      setLoaded(false);
    }
  }, [isLoaded]);

  // Fetch room details
  const { data: roomDetails } = useQuery({
    queryKey: [GET_ROOMS_DETAILS],
    queryFn: () => getRoomDetailService(roomId || ''),
    enabled: !!roomId,
    refetchInterval: 1000,
    refetchIntervalInBackground: true,
  });

  // Determine sizes for Unity
  const isMobile = window.innerWidth <= 768;
  const isLandscape = window.innerWidth > window.innerHeight;
  const unityWidth = isMobile && !isLandscape ? size.height : size.width;
  const unityHeight = isMobile && !isLandscape ? size.width : size.height;

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
        >
          <div style={{ color: '#000', fontSize: 30 }}>{Math.round(loadingProgression * 100)}%</div>
          <PacmanLoader color="#000" />
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
          position: 'relative',
        }}
      >
        {!isLandscape && isMobile && (
          <div className="landscape-warning">Please rotate your device to landscape mode.</div>
        )}

        {/* Unity Component */}
        <Unity
          unityProvider={unityProvider}
          style={{
            width: unityWidth,
            height: unityHeight,
            visibility: isLoaded ? 'visible' : 'hidden',
          }}
          devicePixelRatio={window.devicePixelRatio}
          matchWebGLToCanvasSize
        />
        {/* Remote Stream Component */}
        {isLandscape && isMobile && (
          <div className="live-stream-container" style={{ visibility: isLoaded ? 'visible' : 'hidden' }}>
            <iframe src="https://video.thietkewebcobac.com/XocDiaA/" height={'100%'} width={'100%'} loading="lazy" />
            {/* <RemoteStream roomId={roomId} userId={localStorage.getItem('userId')} /> */}
          </div>
        )}
        {!isMobile && (
          <div className="live-stream-container" style={{ visibility: isLoaded ? 'visible' : 'hidden' }}>
            <iframe src="https://video.thietkewebcobac.com/XocDiaA/" height={'100%'} width={'100%'} loading="lazy" />
            {/* <RemoteStream roomId={roomId} userId={localStorage.getItem('userId')} /> */}
          </div>
        )}
        <div className="live-stream-container2" style={{ visibility: isLoaded ? 'visible' : 'hidden' }}>
          <SecondRemoteStream roomId={roomId} />
        </div>
      </div>
    </>
  );
};

export default GameComponent;

export const Route = createLazyFileRoute('/play/$roomId')({
  component: () => (
    <PrivateRoute>
      <GameComponent />
    </PrivateRoute>
  ),
});
