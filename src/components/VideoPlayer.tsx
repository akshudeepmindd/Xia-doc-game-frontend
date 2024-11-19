import React, { useEffect, useRef } from 'react';

const VideoStream: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    // Initialize WebSocket connection
    wsRef.current = new WebSocket('wss://hwhkmgtm.vnkuvideo.com:8881/apps/dFGPrp04jC2Ep2nYnYqKyg/1730146441/pf1');

    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    // Handle incoming video data
    wsRef.current.onmessage = (event: MessageEvent) => {
      const blob = event.data as Blob;
      const url = URL.createObjectURL(blob);
      const img = new Image();
      img.src = url;

      img.onload = () => {
        // Draw the frame to canvas
        context.drawImage(img, 0, 0, canvas.width, canvas.height);
        URL.revokeObjectURL(url); // Clean up the blob URL
      };
    };

    wsRef.current.onopen = () => {
      console.log('WebSocket connection opened for video stream');
    };

    wsRef.current.onerror = (error) => {
      console.error('WebSocket error: ', error);
    };

    wsRef.current.onclose = () => {
      console.log('WebSocket connection closed');
    };

    // Clean up WebSocket connection on component unmount
    return () => {
      wsRef.current?.close();
    };
  }, []);

  return (
    <div>
      <canvas ref={canvasRef} width={640} height={360}></canvas>
    </div>
  );
};

export default VideoStream;
