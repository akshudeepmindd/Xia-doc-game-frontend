import { useEffect, useState, useCallback } from 'react';
import ReactPlayer from 'react-player';
import { Unity, useUnityContext } from 'react-unity-webgl';
import { useQuery } from '@tanstack/react-query';
import { getRoomDetailService } from '@/services/room';
import { GET_ROOMS_DETAILS } from '@/lib/constants';
import { createLazyFileRoute, useParams } from '@tanstack/react-router';
import { PacmanLoader } from 'react-spinners';
const GameComponent = () => {
  const { roomId } = useParams({ strict: false });
  const [loaded, setLoaded] = useState(false);
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

  const [streamKey, setStreamKey] = useState('');
  const [streamKey2, setStreamKey2] = useState('');

  const updateStreamKey1 = useCallback(() => {
    if (roomDetails?.livestream_camera1_playbackid && streamKey !== roomDetails.livestream_camera1_playbackid) {
      setStreamKey(roomDetails.livestream_camera1_playbackid);
    }
  }, [roomDetails?.livestream_camera1_playbackid, streamKey]);

  const updateStreamKey2 = useCallback(() => {
    if (roomDetails?.livestream_camera2_playbackid && streamKey2 !== roomDetails.livestream_camera2_playbackid) {
      setStreamKey2(roomDetails.livestream_camera2_playbackid);
    }
  }, [roomDetails?.livestream_camera2_playbackid, streamKey2]);

  // Effect to handle stream key changes
  useEffect(() => {
    updateStreamKey1();
    updateStreamKey2();
  }, [updateStreamKey1, updateStreamKey2]);

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
        <Unity
          unityProvider={unityProvider}
          style={{
            width: '100%',
            height: '100%',
            visibility: isLoaded ? 'visible' : 'hidden',
          }}
          devicePixelRatio={window.devicePixelRatio}
        />

        <div className="live-stream-container" style={{ visibility: isLoaded ? 'visible' : 'hidden' }}>
          <ReactPlayer url={`https://stream.mux.com/${streamKey}.m3u8`} playing controls width="100%" height="100%" />
        </div>

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
          <ReactPlayer url={`https://stream.mux.com/${streamKey2}.m3u8`} playing controls width="100%" height="100%" />
        </div>
      </div>
    </>
  );

  // );
};

export const Route = createLazyFileRoute('/play/$roomId')({
  component: GameComponent,
});
