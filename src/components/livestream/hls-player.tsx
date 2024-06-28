import { useMeeting } from '@videosdk.live/react-sdk';
import { useEffect, useMemo, useRef } from 'react';
import Hls from 'hls.js';
import ReactPlayer from 'react-player';

const HlsPlayer = () => {
  const { hlsUrls, hlsState } = useMeeting();

  const playerRef = useRef<HTMLMediaElement | null>(null);

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

      const player = document.querySelector('#hlsPlayer') as HTMLMediaElement;

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
    <ReactPlayer
      playsinline
      muted
      pip={false}
      light={false}
      playing={true}
      url={hlsPlaybackHlsUrl}
      height={'80%'}
      width={'70%'}
      onError={(error) => console.log(error)}
    />
  );
};

export default HlsPlayer;
