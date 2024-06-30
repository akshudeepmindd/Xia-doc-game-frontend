import { MeetingConsumer, Constants, MeetingProvider, useMeeting } from '@videosdk.live/react-sdk';
import React, { useEffect, useMemo, useRef } from 'react';
import Hls from 'hls.js';

const HLSPlayer = () => {
  const { hlsUrls, hlsState } = useMeeting();

  const playerRef = useRef(null);

  const hlsPlaybackHlsUrl = useMemo(() => hlsUrls.playbackHlsUrl, [hlsUrls]);

  useEffect(() => {
    if (Hls.isSupported()) {
      const hls = new Hls({
        capLevelToPlayerSize: true,
        maxLoadingDelay: 4,
        minAutoBitrate: 0,
        autoStartLoad: true,
        defaultAudioCodec: 'mp4a.40.2',
      });

      let player = document.querySelector('#hlsPlayer');

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
      id="hlsPlayer"
      autoPlay
      style={{ width: '100%', height: '100%' }}
      playsInline
      playing
      onError={(err) => console.log(err, 'hls video error')}
    ></video>
  );
};

const ViewerScreenContainer = ({ meetingId, authToken }) => {
  return (
    <MeetingProvider
      token={authToken}
      config={{
        meetingId,
        name: 'C.V. Raman',
        mode: 'VIEWER',
        webcamEnabled: false,
      }}
      joinWithoutUserInteraction
    >
      <MeetingConsumer>
        {({ hlsState }) =>
          hlsState === Constants.hlsEvents.HLS_PLAYABLE ? (
            <HLSPlayer style={{ width: '100%' }} />
          ) : (
            <p>Waiting for host to start stream...</p>
          )
        }
      </MeetingConsumer>
    </MeetingProvider>
  );
};

export default ViewerScreenContainer;
