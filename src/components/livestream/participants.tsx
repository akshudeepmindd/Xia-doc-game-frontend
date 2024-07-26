import { MeetingConsumer, Constants, MeetingProvider, useMeeting } from '@videosdk.live/react-sdk';
import React, { useEffect, useMemo, useRef } from 'react';
import Hls from 'hls.js';
import { Loader2 } from 'lucide-react';

const HLSPlayer = () => {
  const { hlsUrls, hlsState } = useMeeting();

  const playerRef2 = useRef(null);

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

      let player = document.querySelector('#hlsPlayer');

      hls.loadSource(hlsPlaybackHlsUrl);
      hls.attachMedia(player);
    } else {
      if (typeof playerRef2.current?.play === 'function') {
        playerRef2.current.src = hlsPlaybackHlsUrl;
        playerRef2.current.play();
      }
      console.log(playerRef2, 'playerRef2');
    }
  }, [hlsPlaybackHlsUrl, hlsState]);

  return (
    <video
      ref={playerRef2}
      id="hlsPlayer"
      autoPlay
      style={{ width: '100%', height: '100%' }}
      playsInline
      playing
      onError={(err) => console.log(err, 'hls video error')}
    ></video>
  );
};

const ViewerScreenContainer = ({ meetingId, authToken }: { meetingId: string; authToken: string }) => {
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
            <div className="flex justify-center items-center h-full">
              <Loader2 size={120} color="white" className="w-8 h-8 animate-spin" />
            </div>
          )
        }
      </MeetingConsumer>
    </MeetingProvider>
  );
};

export default ViewerScreenContainer;
