import React, { useEffect, useMemo, useRef, useState } from 'react';
import Hls from 'hls.js';
import { Loader2 } from 'lucide-react';
import { MeetingConsumer, Constants, MeetingProvider, useMeeting } from '@videosdk.live/react-sdk';

const HLSPlayer = ({player}) => {
  const { hlsUrls, hlsState } = useMeeting();
  const playerRef = useRef(null);

  const hlsPlaybackHlsUrl = useMemo(() => hlsUrls.playbackHlsUrl, [hlsUrls]);

  useEffect(() => {
    const player = playerRef.current;
    if (Hls.isSupported() && hlsPlaybackHlsUrl) {
      const hls = new Hls({
        capLevelToPlayerSize: true,
        maxLoadingDelay: 0,
        minAutoBitrate: 0,
        autoStartLoad: true,
        defaultAudioCodec: 'mp4a.40.2',
      });

      hls.loadSource(hlsPlaybackHlsUrl);
      hls.attachMedia(player);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        player.play();
      });

      hls.on(Hls.Events.ERROR, (event, data) => {
        console.error('HLS error', data);
      });

      return () => {
        hls.destroy();
      };
    } else if (player && typeof player.play === 'function') {
      player.src = hlsPlaybackHlsUrl;
      player.play();
    }
  }, [hlsPlaybackHlsUrl, hlsState]);

  return (
    <video
      ref={playerRef}
      id={`hlsPlayer-${player}`}
      autoPlay
      style={{ width: '100%', height: '100%' }}
      playsInline
      onError={(err) => console.log(err, 'hls video error')}
    ></video>
  );
};

const Speaker2 = ({ meetingId, authToken, player }) => {
  const [externalCamAvailable, setExternalCamAvailable] = useState(false);

  useEffect(() => {
    const checkCameras = async () => {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const externalCameras = devices.filter(
        (device) => device.kind === 'videoinput' && device.label.toLowerCase().includes('external'),
      );
      setExternalCamAvailable(externalCameras.length > 0);
    };

    checkCameras();
  }, []);

  return (
    <MeetingProvider
      token={authToken}
      config={{
        meetingId,
        name: 'C.V. Raman',
        mode: 'VIEWER',
        webcamEnabled: true,
      }}
      joinWithoutUserInteraction
    >
      <MeetingConsumer>
        {({ hlsState }) =>
          hlsState === Constants.hlsEvents.HLS_PLAYABLE ? (
            <HLSPlayer style={{ width: '100%' }} player={player}/>
          ) : (
            <div className="flex justify-center items-center h-full">
              <Loader2 size={120} color="white" className="w-8 h-8 animate-spin" />
            </div>
          )
        }
      </MeetingConsumer>
    </MeetingProvider>
  );
};

export default Speaker2;
