import React, { useEffect, useRef } from 'react';
import Hls from 'hls.js';

const VideoPlayer = ({ videoRef }) => {
  // const videoRef = useRef(null);

  useEffect(() => {
    if (Hls.isSupported()) {
      const video = videoRef.current;
      const hls = new Hls();
      hls.attachMedia(video);
      hls.on(Hls.Events.MEDIA_ATTACHED, () => {
        hls.loadSource(
          'https://customer-f33zs165nr7gyfy4.cloudflarestream.com/6b9e68b07dfee8cc2d116e4c51d6a957/manifest/video.m3u8',
        );
        video.play();
      });
    }
  }, []);

  return <video ref={videoRef} controls style={{ width: '100%', height: 'auto' }} />;
};

export default VideoPlayer;
