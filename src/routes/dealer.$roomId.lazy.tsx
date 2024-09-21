import DealerFooter from '@/components/dealer-footer';
import SpeakerScreen from '@/components/livestream/speaker';
import io from 'socket.io-client';
import Webcam from 'react-webcam';
import Navbar from '@/components/navbar';
import { GET_ROUND_DETAILS, SOCKET_ROUND_START } from '@/lib/constants';
import { socket } from '@/services';
import { declareResultService, getRoundDetails, updateRound } from '@/services/round';
import { useMutation, useQuery } from '@tanstack/react-query';
import { createLazyFileRoute, useParams } from '@tanstack/react-router';
import useProfile from '@/hooks/useProfile';
import { GET_ROOMS_DETAILS } from '@/lib/constants';
import { getRoomDetailService } from '@/services/room';
import { MeetingProvider } from '@videosdk.live/react-sdk';
import { differenceInSeconds, parseISO } from 'date-fns';
import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import SpeakerScreen2 from '@/components/livestream/participants2';
import { eventNames } from 'node:process';
import { FormattedMessage } from 'react-intl';

const BetType = {
  FOUR_BLACK: 'FOUR_BLACK',
  FOUR_WHITE: 'FOUR_WHITE',
  THREE_BLACK_ONE_WHITE: 'THREE_BLACK_ONE_WHITE',
  THREE_WHITE_ONE_BLACK: 'THREE_WHITE_ONE_BLACK',
  TWO_BLACK_TWO_WHITE: 'TWO_BLACK_TWO_WHITE',
  EVEN: 'EVEN',
  ODD: 'ODD',
};

const DealerComponent = () => {
  const { roomId } = useParams({ strict: false });
  const [countdown, setCountdown] = useState(0);
  const [selectResult, setSelectResult] = useState<string>();
  const [selectedCamera1Index, setSelectedCamera1Index] = useState(0);
  const [selectedCamera2Index, setSelectedCamera2Index] = useState(1);
  const socketConnect1 = useRef<WebSocket | null>(null);
  const socketConnect2 = useRef<WebSocket | null>(null);
  const videoRef = useRef<Webcam>(null);
  const videoRef2 = useRef<Webcam>(null);
  const mediaRecorderRef1 = useRef<MediaRecorder | null>(null);
  const mediaRecorderRef2 = useRef<MediaRecorder | null>(null);
  const [livestream, setStream] = useState<MediaStream | null>(null);
  const [livestream2, setStream2] = useState<MediaStream | null>(null);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [c1streamkey, setc1streamkey] = useState('');
  const [c2streamkey, setc2streamkey] = useState('');
  const [videoDevices, setVideoDevices] = useState<MediaDeviceInfo[]>([]);

  const getVideoDevices = async () => {
    const deviceInfos = await navigator.mediaDevices.enumerateDevices();
    const filteredDevices = deviceInfos.filter(
      (device) => device.kind === 'videoinput' && !device.label.includes('OBS'),
    );
    setVideoDevices(filteredDevices);
  };

  useEffect(() => {
    getVideoDevices();
  }, []);

  // socket.current =
  // const []
  useEffect(() => {
    socket.on(SOCKET_ROUND_START, (data: any) => {
      console.log('SOCKET DATA', data);
      setCountdown(45);
    });

    return () => {
      socket.off(SOCKET_ROUND_START);
    };
  }, []);
  const { mutateAsync: updateResult } = useMutation({
    mutationFn: updateRound,
  });
  const handleResultSelect = (result: string) => {
    setSelectResult(result);
    updateResult({ roundId: roundDetails?.message?.data?._id, round: { roundResult: result } });
  };

  const { isLoading, data: roundDetails } = useQuery({
    queryKey: [GET_ROUND_DETAILS],
    queryFn: () => getRoundDetails(roomId ? roomId : ''),
    enabled: !!roomId,
    refetchInterval: 1000,
    refetchIntervalInBackground: true,
  });
  const toggleCamera = async () => {
    if (isCameraOn) {
      stopStream();
    } else {
      capture();
      setStartLive(true);
    }
  };
  const socket2 = new WebSocket('https://deepminddsvisualss.com/ws/');
  // Capture the first camera stream
  const capture = async () => {
    try {
      const deviceInfos = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = deviceInfos.filter(
        (device) => device.kind === 'videoinput' && !device.label.includes('OBS'),
      );

      if (videoDevices.length === 0) {
        console.error('No video input devices found');
        return;
      }

      const firstCamera = videoDevices[selectedCamera1Index];
      console.log('Selected camera 1:', firstCamera);

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { deviceId: { exact: firstCamera.deviceId } },
      });

      if (videoRef.current) {
        const videoElement = videoRef.current.video as HTMLVideoElement;
        videoElement.srcObject = stream;

        console.log('Video Call 1');
        // setStartLive(true);
        setStream(stream);
        // setIsCameraOn(true);

        // WebSocket logic for first stream
        if (socket2 && socket2.readyState === WebSocket.OPEN) {
          socket2.send(
            JSON.stringify({
              eventName: 'createLiveStream',
              data: { roomId, cameraNumber: 1 },
            }),
          );

          const handleSocketMessage1 = (event) => {
            const streamkey = JSON.parse(event.data)?.data;
            console.log(streamkey, 'streamkey 1');
            setc1streamkey(streamkey);
            sendVideoStream(stream, streamkey);
          };

          // Attach a listener for the first stream, ensure the listener is not overwritten by the second stream
          socket2.addEventListener('message', handleSocketMessage1);
        }
      } else {
        console.error('Video element is not available');
      }
    } catch (error) {
      console.error('Error capturing video:', error);
    }
  };

  // Capture the second camera stream
  const capture2 = async () => {
    try {
      const deviceInfos = await navigator.mediaDevices.enumerateDevices();
      console.log('Available video devices:', deviceInfos);
      const videoDevices = deviceInfos.filter(
        (device) => device.kind === 'videoinput' && !device.label.includes('OBS'),
      );

      if (videoDevices.length < 2) {
        console.error('Not enough video devices available');
        return;
      }

      const secondCamera = videoDevices[selectedCamera2Index];
      console.log('Selected camera 2:', secondCamera);

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { deviceId: { exact: secondCamera.deviceId } },
        audio: true,
      });
      console.log('Stream for camera 2:', stream);

      if (videoRef2.current) {
        const videoElement = videoRef2.current.video as HTMLVideoElement;
        videoElement.srcObject = stream;

        console.log('Video Call 2');
        // setStartLive(true);
        setStream2(stream);
        // setIsCameraOn(true);

        // WebSocket logic for second stream
        if (socket2 && socket2.readyState === WebSocket.OPEN) {
          socket2.send(
            JSON.stringify({
              eventName: 'createLiveStream',
              data: { roomId, cameraNumber: 2 },
            }),
          );

          const handleSocketMessage2 = (event) => {
            const streamkey = JSON.parse(event.data)?.data;
            console.log(streamkey, 'streamkey 2');
            setc2streamkey(streamkey);
            sendVideoStream2(stream, streamkey);
          };

          // Attach a listener for the second stream, ensure the listener is specific to the second stream
          socket2.addEventListener('message', handleSocketMessage2);
        }
      } else {
        console.error('Video element is not available');
      }
    } catch (error) {
      console.error('Error capturing video from the second camera:', error);
    }
  };

  const HandleSettingMediaStream1 = async (index) => {
    setSelectedCamera1Index(index);
    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        deviceId: videoDevices[selectedCamera1Index].deviceId
          ? { exact: videoDevices[selectedCamera1Index].deviceId }
          : undefined,
      },
      audio: true,
    });
    if (videoRef.current) {
      const videoElement = videoRef.current.video as HTMLVideoElement;
      videoElement.srcObject = stream;
    }
  };
  const HandleSettingMediaStream2 = async (index) => {
    setSelectedCamera2Index(index);
    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        deviceId: videoDevices[selectedCamera2Index].deviceId
          ? { exact: videoDevices[selectedCamera2Index].deviceId }
          : undefined,
      },
      audio: true,
    });
    if (videoRef2.current) {
      const videoElement = videoRef2.current.video as HTMLVideoElement;
      videoElement.srcObject = stream;
    }
  };
  const sendVideoStream = (videoSrc: MediaStream, streamkey: string) => {
    console.log(streamkey, 'streakeyyyyy');
    if (streamkey) {
      console.log('GETSTREAM KEY');
      // const socketConnection = new WebSocket(https://deepminddsvisualss.com/live/?roomId=${streamkey});
      socketConnect1.current = new WebSocket(`https://deepminddsvisualss.com/live/?roomId=${streamkey}`);
      mediaRecorderRef1.current = new MediaRecorder(videoSrc, { mimeType: 'video/webm' });

      mediaRecorderRef1.current.ondataavailable = async (event: BlobEvent) => {
        if (event.data && event.data.size > 0) {
          console.log(event.data, 'stream');

          // // Example: Using WebSocket to send data chunks
          // const obj = { roomId: roomId, frame: event.data };
          // const message = JSON.stringify({
          //   eventName: 'sendFrame',
          //   data: obj,
          // });
          if (socketConnect1.current) await socketConnect1.current.send(event.data);
          // socket.send(event.data);
        }
      };

      mediaRecorderRef1.current.start(1000); // Send data every second
    }
  };
  const sendVideoStream2 = (videoSrc: MediaStream, streamkey: string) => {
    console.log(streamkey, 'streakeyyyyy');
    if (streamkey) {
      console.log('GETSTREAM KEY');
      // const socketConnection = new WebSocket(https://deepminddsvisualss.com/live/?roomId=${streamkey});
      socketConnect2.current = new WebSocket(`https://deepminddsvisualss.com/live2/?roomId=${streamkey}`);
      mediaRecorderRef2.current = new MediaRecorder(videoSrc, { mimeType: 'video/webm' });

      mediaRecorderRef2.current.ondataavailable = async (event: BlobEvent) => {
        if (event.data && event.data.size > 0) {
          console.log(event.data, 'Stream 2');

          // // Example: Using WebSocket to send data chunks
          // const obj = { roomId: roomId, frame: event.data };
          // const message = JSON.stringify({
          //   eventName: 'sendFrame',
          //   data: obj,
          // });
          if (socketConnect2.current) await socketConnect2.current.send(event.data);
          // socket.send(event.data);
        }
      };

      mediaRecorderRef2.current.start(1000); // Send data every second
    }
  };
  const stopStream = () => {
    if (mediaRecorder) {
      const socketConnection = new WebSocket(`https://deepminddsvisualss.com/live/?roomId=${c1streamkey}`);
      socketConnection.send('stop');
      mediaRecorder.stop();
    }
    if (livestream) {
      livestream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    setIsCameraOn(false);
    setStartLive(false);
  };
  const startStream = async () => {
    // if (!videoRef.current) return; // Ensure the video element is rendered before starting the stream
    // const socket2 = new WebSocket('https://deepminddsvisualss.com/ws/');
    const socket2 = new WebSocket('https://localhost:4200');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setStream(stream);
      setIsCameraOn(true);
      setStartLive(true);
      const videoTrack = stream.getVideoTracks()[0];

      // Get the capabilities of the video track
      const capabilities = videoTrack.getCapabilities();

      console.log('Video Capabilities:');
      console.log('Width range: ', capabilities.width);
      console.log('Height range: ', capabilities.height);
      console.log('Frame rate range: ', capabilities.frameRate);
      console.log('Aspect ratio: ', capabilities.aspectRatio);
      // console.log('Facing mode: ', capabilities.);
      // console.log('Resize mode: ', capabilities.resizeMode);
      if (videoRef.current) {
        socket2.send(
          JSON.stringify({
            eventName: 'createLiveStream',
            roomId: roomId,
          }),
        );
        // Check if videoRef.current exists
        videoRef.current.srcObject = stream;
      }

      // const socket = new WebSocket('https://localhost:4200');
      const mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm' });

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          const reader = new FileReader();
          reader.onload = async () => {
            try {
              console.log(reader?.result);
              // Ensure reader.result is a valid ArrayBuffer
              // if (!(reader.result instanceof ArrayBuffer)) {
              //   throw new Error('Invalid data format. Expected ArrayBuffer');
              // }
              if (reader?.result !== null) {
                const base64String = reader?.result && reader?.result?.replace(/^data:(.*?);base64,/, '');
                console.log(base64String);
                // const base64String = reader?.result?.split(',')[1];
                const obj = { roomId: roomId, frame: base64String };

                if (socket2.readyState === WebSocket.OPEN) {
                  const message = JSON.stringify({
                    eventName: 'sendFrame',
                    data: obj,
                  });
                  await socket2.send(message);
                } else {
                  console.error('WebSocket connection is not open');
                }
              }
            } catch (error) {
              console.error('Error sending frame:', error);
              // Optionally send an error message to the backend
            }
          };
          reader.readAsDataURL(event.data);
        }
      };

      mediaRecorder.start(1000);
    } catch (err) {
      console.error('Error accessing webcam:', err);
    }
  };

  useEffect(() => {
    if (roundDetails) {
      const futureTime = parseISO(roundDetails.message.data?.createdAt);

      // Get current time
      const currentTime = new Date();

      // Calculate difference in seconds
      const secondsLeft = differenceInSeconds(currentTime, futureTime);

      setCountdown(45 - secondsLeft);
    }
  }, [roundDetails?.message?.data?.createdAt]);

  useEffect(() => {
    if (countdown > 0 && roundDetails) {
      const timer = setInterval(() => {
        setCountdown((prevCountdown) => prevCountdown - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [countdown, roundDetails?.message?.data?.createdAt]);

  const [meetingId, setMeetingId] = useState('');
  const [startLive, setStartLive] = useState(false);
  const [authToken, setAuthToken] = useState('');
  const [cameraId, setCameraId] = useState('');
  const [cameratoken, setCameratoken] = useState('');
  const { username } = useProfile();
  // useEffect(() => {
  //   // Ensure that the stream starts after the video element is rendered
  //   if (startLive && videoRef.current) {
  //     startStream();
  //   }
  // }, [startLive, videoRef]);
  const { data: roomDetails } = useQuery({
    queryKey: [GET_ROOMS_DETAILS],
    queryFn: async () => getRoomDetailService(roomId || ''),
  });

  useEffect(() => {
    if (roomDetails) {
      setMeetingId(roomDetails?.dealerLiveStreamId);
      setAuthToken(roomDetails?.streamingToken);
      setCameraId(roomDetails?.cameraLiveStreamId);
      setCameratoken(roomDetails?.camerastreamingToken);
    }
  }, [roomDetails]);

  const { mutateAsync: declareResult } = useMutation({
    mutationFn: declareResultService,
  });

  const handleDeclareResult = async (result: string) => {
    if (roundDetails?.message?.data?._id) {
      await declareResult({ roundId: roundDetails?.message?.data?._id, result });
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }
  // eslint-disable-next-line react-hooks/rules-of-hooks

  return (
    <div className="dealer-container">
      <div className=" bg-auto bg-no-repeat bg-center bg-cover bg-[url('/game.png')] relative ">
        <div className="flex flex-col ">
          <Navbar roomId={roomId} isDealer={true} />
          <div className="flex-1 flex flex-col gap-y-2">
            <div className="flex items-center justify-between px-10 gap-x-4">
              <div className="w-1/4 h-40 flex items-center justify-center">
                <div className="w-24 h-24 flex items-center justify-center text-background border-2 rounded-full text-3xl font-medium font-mono">
                  {countdown > 0 ? (
                    countdown
                  ) : (
                    <span className="text-xl">
                      <FormattedMessage id="app.start" />{' '}
                    </span>
                  )}
                </div>
              </div>
              <div className="w-[30rem]  overflow-hidden mt-5">
                {/* {startLive ? ( */}
                <Webcam
                  audio={true}
                  ref={videoRef}
                  screenshotFormat="image/jpeg"
                  videoConstraints={{
                    width: 1280,
                    height: 720,
                    facingMode: 'user',
                  }}
                />
                {/* ) : (
                  <div className="flex justify-center items-center bg-white h-[200px] ">
                    <FormattedMessage id="app.liveneedtostart"/>
                  </div>
                )} */}
              </div>
              <div className="w-1/4  mt-40">
                {/* <div className="table w-full text-white p-2 ">
                <div className="table-header-group">
                  <div className="table-row  rounded-xl p-2">
                    <div className="table-cell text-center ...">Bet</div>
                    <div className="table-cell  text-center">Win</div>
                  </div>
                </div>
                <div className="table-row-group">
                  <div className="table-row text-center">
                    <div className="table-cell ...">$2500</div>
                    <div className="table-cell ...">$3000</div>
                  </div>
                  <div className="table-row text-center">
                    <div className="table-cell ...">$2500</div>
                    <div className="table-cell ...">$3000</div>
                  </div>
                  <div className="table-row text-center">
                    <div className="table-cell ...">$2500</div>
                    <div className="table-cell ...">$3000</div>
                  </div>
                </div>
              </div> */}
              </div>
            </div>
            <div className="flex items-center justify-between px-10 gap-x-4">
              <EvenSelectionBoard selectResult={selectResult} setSelectResult={handleResultSelect} />
              <div className="w-1/4 bg-slate-50 h-64">
                <Webcam
                  audio={true}
                  ref={videoRef2}
                  screenshotFormat="image/jpeg"
                  videoConstraints={{
                    width: 1280,
                    height: 720,
                    facingMode: 'user',
                  }}
                />
              </div>
              <OddSelectionBoard selectResult={selectResult} setSelectResult={handleResultSelect} />
            </div>
            {/* {roomId && ( */}
            <>
              {/* <MeetingProvider
                  config={{
                    meetingId: roomDetails?.dealerLiveStreamId,
                    mode: 'CONFERENCE',
                    name: 'Name',
                    micEnabled: true,
                    webcamEnabled: true,
                    debugMode: false,
                  }}
                  token={roomDetails?.streamingToken}
                  joinWithoutUserInteraction
                > */}
              <DealerFooter
                roomId={roomId ?? ''}
                round={roundDetails?.message}
                setMeetingId={setMeetingId}
                setStartLive={setStartLive}
                startLive={startLive}
                setAuthToken={setAuthToken}
                cameraId={cameraId}
                isCameraOn={isCameraOn}
                stopStream={stopStream}
                setCameraId={setCameraId}
                startStream={capture}
                startStream2={capture2}
                videoDevices={videoDevices}
                setSelectedCamera1Index={HandleSettingMediaStream1}
                setSelectedCamera2Index={HandleSettingMediaStream2}
                cameraToken={cameratoken}
                setCameraToken={setCameratoken}
                meetingId={meetingId}
                authToken={authToken}
                toggleCamera={toggleCamera}
                selectResult={selectResult}
                setSelectResult={setSelectResult}
                resultDeclare={handleDeclareResult}
                roundStatus={roundDetails?.message?.data?.roundStatus}
                countdown={countdown}
                setCountDown={setCountdown}
              />
              {/* </MeetingProvider> */}
            </>
            {/* )} */}
          </div>
        </div>
      </div>
    </div>
  );
};



export const RedCircle = () => {
  return <div className="w-8 h-8 bg-red-500 rounded-full"></div>;
};

export const WhiteCircle = () => {
  return <div className="w-8 h-8 bg-white rounded-full customBorder box-border"></div>;
};

const EvenSelectionBoard = ({
  selectResult,
  setSelectResult,
}: {
  selectResult: string | undefined;
  setSelectResult: (result: string) => void;
}) => {
  return (
    <div className="w-1/4 box-container flex flex-col gap-y-6">
      <div className="grid gap-6">
        <div
          className={cn(
            'flex flex-col justify-around w-full border-background p-26 rounded p-2 bg-[#0099C3]',
            selectResult === BetType.EVEN ? 'bg-white/10 glow' : '',
          )}
          onClick={() => setSelectResult(BetType.EVEN)}
        >
          <h2 className="text-center text-white p-8 text-xl">
            <FormattedMessage id="app.even" />
          </h2>
        </div>
        <div
          className={cn(
            'flex flex-col justify-around w-full border-background p-26 rounded p-2 bg-[#0099C3]',
            selectResult === BetType.FOUR_WHITE ? 'bg-white/10 glow' : '',
          )}
          onClick={() => setSelectResult(BetType.FOUR_WHITE)}
        >
          <h3 className="flex items-center justify-between w-full p-2">
            <span className="text-background text-sm">
              <FormattedMessage id="app.white" /> 4
            </span>
            <span className="text-background text-sm">
              <FormattedMessage id="app.red" /> 0
            </span>
          </h3>
          <div className="w-full flex items-center justify-center gap-4 pb-2">
            <WhiteCircle />
            <WhiteCircle />
            <WhiteCircle />
            <WhiteCircle />
          </div>
        </div>
        <div
          className={cn(
            'flex flex-col justify-around w-full  p-26 rounded p-2 bg-[#0099C3]',
            selectResult === BetType.FOUR_BLACK ? 'bg-white/10 glow' : '',
          )}
          onClick={() => setSelectResult(BetType.FOUR_BLACK)}
        >
          <h3 className="flex items-center justify-between w-full p-2">
            <span className="text-background text-sm">
              <FormattedMessage id="app.white" /> 0
            </span>
            <span className="text-background text-sm">
              <FormattedMessage id="app.red" /> 4
            </span>
          </h3>
          <div className="w-full flex items-center justify-center gap-4 pb-2">
            <RedCircle />
            <RedCircle />
            <RedCircle />
            <RedCircle />
          </div>
        </div>
        <div
          className={cn(
            'flex flex-col justify-between w-full  p-26 rounded p-2 bg-[#0099C3] ',
            selectResult === BetType.TWO_BLACK_TWO_WHITE ? 'bg-white/10 glow' : '',
          )}
          onClick={() => setSelectResult(BetType.TWO_BLACK_TWO_WHITE)}
        >
          <h3 className="flex items-center justify-between w-full p-2">
            <span className="text-background text-sm">
              <FormattedMessage id="app.white" /> 2
            </span>
            <span className="text-background text-sm">
              <FormattedMessage id="app.red" /> 2
            </span>
          </h3>
          <div className="w-full flex items-center justify-center gap-2 pb-2">
            <RedCircle />
            <RedCircle />
            <WhiteCircle />
            <WhiteCircle />
          </div>
        </div>
      </div>
    </div>
  );
};

const OddSelectionBoard = ({
  selectResult,
  setSelectResult,
}: {
  selectResult: string | undefined;
  setSelectResult: (result: string) => void;
}) => {
  return (
    <div className="w-1/4 box-container flex flex-col gap-y-6">
      <div className="grid  gap-6">
        <div
          className={cn('bg-[#972b46] rounded-lg p-8', selectResult === BetType.ODD ? 'bg-white/10 glow' : '')}
          onClick={() => setSelectResult(BetType.ODD)}
        >
          <h1 className="text-background text-2xl font-medium text-center">
            <FormattedMessage id="app.odd" />{' '}
          </h1>
        </div>
        <div
          className={cn(
            'flex flex-col justify-around w-full bg-[#972b46] h-24 rounded p-2',
            selectResult === BetType.THREE_WHITE_ONE_BLACK ? 'bg-white/10 glow' : '',
          )}
          onClick={() => setSelectResult(BetType.THREE_WHITE_ONE_BLACK)}
        >
          <h3 className="flex items-center justify-between w-full">
            <span className="text-background text-sm">
              <FormattedMessage id="app.white" /> 3
            </span>
            <span className="text-background text-sm">
              <FormattedMessage id="app.red" /> 1
            </span>
          </h3>
          <div className="w-full flex items-center justify-center gap-3">
            <WhiteCircle />
            <WhiteCircle />
            <WhiteCircle />
            <RedCircle />
          </div>
        </div>
        <div
          className={cn(
            'flex flex-col justify-between w-full bg-[#972b46] h-24 rounded p-2',
            selectResult === BetType.THREE_BLACK_ONE_WHITE ? 'bg-white/10 glow' : '',
          )}
          onClick={() => setSelectResult(BetType.THREE_BLACK_ONE_WHITE)}
        >
          <h3 className="flex items-center justify-between w-full">
            <span className="text-background text-sm">
              <FormattedMessage id="app.white" /> 1
            </span>
            <span className="text-background text-sm">
              <FormattedMessage id="app.red" /> 3
            </span>
          </h3>
          <div className="w-full flex items-center justify-center gap-4 pb-2">
            <WhiteCircle />
            <RedCircle />
            <RedCircle />
            <RedCircle />
          </div>
        </div>
      </div>
    </div>
  );
};

export const Route = createLazyFileRoute('/dealer/$roomId')({
  component: DealerComponent,
});
