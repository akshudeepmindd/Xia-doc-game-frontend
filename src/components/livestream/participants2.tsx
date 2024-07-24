import React, { useEffect, useMemo, useRef, useState } from 'react';
import Hls from 'hls.js';
import { Loader2 } from 'lucide-react';
import { MeetingConsumer, Constants, MeetingProvider, useMeeting } from '@videosdk.live/react-sdk';

const HLSPlayer = () => {
  const { hlsUrls, hlsState } = useMeeting();
  const playerRef = useRef(null);

  const hlsPlaybackHlsUrl = useMemo(() => hlsUrls.playbackHlsUrl, [hlsUrls]);

  useEffect(() => {
    if (Hls.isSupported()) {
      const hls = new Hls({
        capLevelToPlayerSize: true,
        maxLoadingDelay: 0,
        minAutoBitrate: 0,
        autoStartLoad: true,
        defaultAudioCodec: 'mp4a.40.2',
      });

      let player = document.querySelector('#hlsPlayer2');

      hls.loadSource(hlsPlaybackHlsUrl);
      hls.attachMedia(player);
    } else {
      if (typeof playerRef.current?.play === 'function') {
        playerRef.current.src = hlsPlaybackHlsUrl;
        playerRef.current.play();
      }
    }
  }, [hlsPlaybackHlsUrl, hlsState]);

  return (
    <video
      ref={playerRef}
      id="hlsPlayer2"
      autoPlay
      style={{ width: '100%', height: '100%' }}
      playsInline
      playing
      onError={(err) => console.log(err, 'hls video error')}
    ></video>
  );
};

const Speaker2 = ({ meetingId, authToken }) => {
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
            <HLSPlayer style={{ width: '100%' }} />
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
