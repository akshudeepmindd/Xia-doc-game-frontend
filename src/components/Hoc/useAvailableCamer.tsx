import { useState, useEffect } from 'react';

const useAvailableCameras = () => {
  const [cameras, setCameras] = useState<MediaDeviceInfo[]>([]);

  useEffect(() => {
    const getCameras = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter((device) => device.kind === 'videoinput');
        setCameras(videoDevices);
      } catch (error) {
        console.error('Error fetching cameras:', error);
      }
    };

    getCameras();
  }, []);

  return cameras;
};

export default useAvailableCameras;
