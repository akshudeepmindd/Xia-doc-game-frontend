import DealerFooter from '@/components/dealer-footer';
import SpeakerScreen from '@/components/livestream/speaker';
import io from 'socket.io-client';
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
  const videoRef = useRef<HTMLVideoElement>(null);
  const [livestream, setStream] = useState<MediaStream | null>(null);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [isCameraOn, setIsCameraOn] = useState(false);
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
      startStream();
      setStartLive(true);
    }
  };

  const stopStream = () => {
    if (mediaRecorder) {
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
    const socket2 = new WebSocket('https://deepminddsvisualss.com/ws/');
    // const socket2 = new WebSocket('ws://localhost:4200');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setStream(stream);
      setIsCameraOn(true);
      setStartLive(true);
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

      // const socket = new WebSocket('ws://localhost:4200');
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
                  {countdown > 0 ? countdown : <span className="text-xl">Start</span>}
                </div>
              </div>
              <div className="w-[30rem]  overflow-hidden mt-5">
                {/* {startLive ? ( */}
                <video ref={videoRef} autoPlay muted>
                  Live Need to Start from Bottom
                </video>
                {/* ) : (
                  <div className="flex justify-center items-center bg-white h-[200px] ">
                    Live Need to Start from Bottom
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
                {startLive ? (
                  <video ref={videoRef} />
                ) : (
                  <div className="flex justify-center items-center h-25">Live Need to Start from Bottom</div>
                )}
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
                startStream={startStream}
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
          <h2 className="text-center text-white p-8 text-xl">Even</h2>
        </div>
        <div
          className={cn(
            'flex flex-col justify-around w-full border-background p-26 rounded p-2 bg-[#0099C3]',
            selectResult === BetType.FOUR_WHITE ? 'bg-white/10 glow' : '',
          )}
          onClick={() => setSelectResult(BetType.FOUR_WHITE)}
        >
          <h3 className="flex items-center justify-between w-full p-2">
            <span className="text-background text-sm">White 4</span>
            <span className="text-background text-sm">Red 0</span>
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
            <span className="text-background text-sm">White 0</span>
            <span className="text-background text-sm">Red 4</span>
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
            <span className="text-background text-sm">White 2</span>
            <span className="text-background text-sm">Red 2</span>
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
          <h1 className="text-background text-2xl font-medium text-center">Odd</h1>
        </div>
        <div
          className={cn(
            'flex flex-col justify-around w-full bg-[#972b46] h-24 rounded p-2',
            selectResult === BetType.THREE_WHITE_ONE_BLACK ? 'bg-white/10 glow' : '',
          )}
          onClick={() => setSelectResult(BetType.THREE_WHITE_ONE_BLACK)}
        >
          <h3 className="flex items-center justify-between w-full">
            <span className="text-background text-sm">White 3</span>
            <span className="text-background text-sm">Red 1</span>
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
            <span className="text-background text-sm">White 1</span>
            <span className="text-background text-sm">Red 3</span>
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
