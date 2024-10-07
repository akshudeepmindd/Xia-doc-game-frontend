import DealerFooter from '@/components/dealer-footer';
import Webcam from 'react-webcam';
import Navbar from '@/components/navbar';
import { GET_ROUND_DETAILS } from '@/lib/constants';
import { toast } from 'sonner';
import { addRound, declareResultService, getRoundDetails, updateRound } from '@/services/round';
import { useMutation, useQuery } from '@tanstack/react-query';
import { createLazyFileRoute, useParams } from '@tanstack/react-router';
import { GET_ROOMS_DETAILS } from '@/lib/constants';
import { getRoomDetailService } from '@/services/room';
import { differenceInSeconds, parseISO } from 'date-fns';
import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { FormattedMessage } from 'react-intl';
import PrivateRoute from '@/components/PrivateRoute';
import Camera1SignalServer from '../utils/Camera1Serverclass';
import Camera2SignalServer from '../utils/Camera2Serverclass';

const BetType = {
  FOUR_BLACK: 'FOUR_BLACK',
  FOUR_WHITE: 'FOUR_WHITE',
  THREE_BLACK_ONE_WHITE: 'THREE_BLACK_ONE_WHITE',
  THREE_WHITE_ONE_BLACK: 'THREE_WHITE_ONE_BLACK',
  TWO_BLACK_TWO_WHITE: 'TWO_BLACK_TWO_WHITE',
  EVEN: 'EVEN',
  ODD: 'ODD',
};
type Camera1SignalServertype = {
  postMessage: (message: any) => void;
  onmessage: ((event: { data: any }) => void) | null;
};

const DealerComponent = () => {
  const { roomId } = useParams({ strict: false });
  const [countdown, setCountdown] = useState(0);
  const [isVideoStarted, setIsVideoStarted] = useState(false);
  const [selectResult, setSelectResult] = useState<string>();
  const [selectedCamera1Index, setSelectedCamera1Index] = useState(0);
  const [selectedCamera2Index, setSelectedCamera2Index] = useState(1);
  const localVideoRef1 = useRef<HTMLVideoElement | null>(null); // To reference the local video element
  const localVideoRef2 = useRef<HTMLVideoElement | null>(null); // To reference the local video element
  const peerConnection = useRef<RTCPeerConnection | null>(null);
  const [peerConnection2, setPeerConnection2] = useState<RTCPeerConnection | null>(null); // Track peer connection state
  const signalServerRef = useRef<Camera1SignalServer | null>(null);
  const signalServerRef2 = useRef<Camera2SignalServer | null>(null);
  const [videoDevices, setVideoDevices] = useState<MediaDeviceInfo[]>([]);
  const createRound = useMutation({
    mutationFn: addRound,
  });

  const updateRoundStatus = useMutation({
    mutationFn: updateRound,
  });
  const handleUpdateRoundStatus = () => {
    const roundId = roundDetails.message?.data?._id;
    setSelectResult('');
    setCountdown(0);
    return updateRoundStatus.mutate({ roundId, round: { roundStatus: 'roundend' } });
  };
  // Fetch available video devices
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
  useEffect(() => {
    // Initialize signaling servers only once
    if (!signalServerRef.current) {
      const signalServer = new Camera1SignalServer(roomId);
      signalServerRef.current = signalServer;

      signalServer.onmessage = (e) => {
        if (e.data.type === 'icecandidate') {
          console.log(e.data);
          peerConnection.current?.addIceCandidate(e.data.candidate);
        } else if (e.data.type === 'answer') {
          console.log('Received answer');
          peerConnection.current?.setRemoteDescription(e.data);
        }
      };
    }

    // if (!signalServerRef2.current) {
    //   const signalServer2 = new Camera2SignalServer(roomId);
    //   signalServerRef2.current = signalServer2;

    //   signalServer2.onmessage = (e) => {
    //     if (e.data.type === 'icecandidate') {
    //       console.log(e.data);
    //       peerConnection2?.addIceCandidate(e.data.candidate);
    //     } else if (e.data.type === 'answer') {
    //       console.log('Received answer');
    //       peerConnection2?.setRemoteDescription(e.data);
    //     }
    //   };
    // }

    return () => {
      // Cleanup on component unmount
      if (peerConnection.current) {
        peerConnection.current.close();
      }
      // if (peerConnection2) {
      //   peerConnection2.close();
      // }
    };
  }, [roomId]);
  useEffect(() => {
    const socket = new WebSocket('wss://SocketXocDia_BanA.thietkewebcobac.com');

    socket.onopen = () => {
      console.log('WebSocket connection established.');
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log('Message from server: ', data);

      // Check if the event is 'start-bet'
      if (data.event === 'start-bet') {
        toast.info('Bạn có thể bắt đầu ván ngay bây giờ.');
        // handleRoundStart();
      } else if (data.event === 'stop-bet') {
        toast.info('Bạn có thể kết thúc ván');
        // handleUpdateRoundStatus();
      } else if (data.event === 'game-result') {
        toast.info(`Kết quả trong video ${data.data}`);
      }
    };
    return () => {
      socket.close();
    };
  }, []);
  // useEffect(() => {

  // }, []);
  const requestMediaPermissions = () => {
    return new Promise<MediaStream>((resolve, reject) => {
      setIsVideoStarted(true); // Set video started state

      // Request camera and microphone access
      navigator.mediaDevices
        .getUserMedia({ audio: true, video: true })
        .then((stream) => {
          if (localVideoRef1.current) {
            localVideoRef1.current.srcObject = stream; // Set the stream to video element
          }
          resolve(stream); // Resolve the promise with the stream
        })
        .catch((err) => {
          console.error('Error accessing media devices.', err);
          reject(err); // Reject the promise with the error
        });
    });
  };

  const startStreaming = async () => {
    // setIsStreaming(true);
    await requestMediaPermissions();
    // Define ICE servers
    const config = {
      iceServers: [
        { urls: 'stun:64.20.39.42:3478' }, // Public STUN server
        {
          urls: 'turn:64.20.39.42:3478',
          username: 'xocdia',
          credential: 'xocdia1234',
        },
      ],
    };

    // Create PeerConnection
    peerConnection.current = new RTCPeerConnection(config);

    // Send ICE candidates to the signaling server
    peerConnection.current.addEventListener('icecandidate', (e) => {
      if (e.candidate) {
        const candidate = {
          candidate: e.candidate.candidate,
          sdpMid: e.candidate.sdpMid,
          sdpMLineIndex: e.candidate.sdpMLineIndex,
        };
        signalServerRef.current?.postMessage({ type: 'icecandidate', candidate });
      }
    });

    // Add media tracks to peer connection
    const stream = localVideoRef1.current?.srcObject as MediaStream;

    stream?.getTracks().forEach((track) => {
      peerConnection.current?.addTrack(track, stream);
    });

    // Create and send offer
    const offer = await peerConnection.current?.createOffer({
      offerToReceiveAudio: true,
      offerToReceiveVideo: true,
    });
    await peerConnection.current?.setLocalDescription(offer);

    console.log('Created offer, sending...');
    signalServerRef.current?.postMessage({ type: 'offer', sdp: offer?.sdp });
  };
  // const StartCamer1Streaming = async () => {
  //   // if (peerConnection) {
  //   //   console.log('Peer connection already established');
  //   //   return; // If connection is already established, exit
  //   // }
  //   const config = {
  //     iceServers: [
  //       { urls: 'stun:64.20.39.42:3478' }, // Public STUN server
  //       {
  //         urls: 'turn:64.20.39.42:3478',
  //         username: 'xocdia',
  //         credential: 'xocdia1234',
  //       },
  //     ],
  //   };
  //   const newPeerConnection = new RTCPeerConnection(config);
  //   setPeerConnection(newPeerConnection);

  //   newPeerConnection.addEventListener('icecandidate', (e) => {
  //     let candidate = null;
  //     if (e.candidate !== null) {
  //       candidate = {
  //         candidate: e.candidate.candidate,
  //         sdpMid: e.candidate.sdpMid,
  //         sdpMLineIndex: e.candidate.sdpMLineIndex,
  //       };
  //     }
  //     signalServerRef.current && signalServerRef.current.postMessage({ type: 'icecandidate', candidate });
  //   });

  //   // Ensure that we have valid selected camera indices
  //   if (videoDevices.length > 0) {
  //     const selectedCamera1 = videoDevices[selectedCamera1Index];
  //     const selectedCamera2 = videoDevices[selectedCamera2Index];

  //     try {
  //       // Request media stream from the selected camera
  //       const stream1 = await navigator.mediaDevices.getUserMedia({
  //         video: {
  //           deviceId: selectedCamera1 ? { exact: selectedCamera1.deviceId } : undefined,
  //         },
  //       });

  //       // const stream2 = await navigator.mediaDevices.getUserMedia({
  //       //   video: {
  //       //     deviceId: selectedCamera2 ? { exact: selectedCamera2.deviceId } : undefined,
  //       //   },
  //       // });

  //       // Attach streams to local video elements
  //       if (localVideoRef1.current && stream1) {
  //         localVideoRef1.current.srcObject = stream1;
  //       }

  //       // if (localVideoRef1.current && stream2) {
  //       //   // Assuming you want to handle both streams in the same element
  //       //   localVideoRef1.current.srcObject = stream2; // Alternatively, use a different ref for stream2
  //       // }

  //       // Add tracks from the selected cameras to the peer connection
  //       stream1.getTracks().forEach((track) => {
  //         console.log(track);
  //         return newPeerConnection.addTrack(track, localVideoRef1.current.srcObject);
  //       });
  //       // stream2.getTracks().forEach((track) => newPeerConnection.addTrack(track, stream2));

  //       // Create and send an offer to the remote peer
  //       const offer = await newPeerConnection.createOffer({
  //         offerToReceiveAudio: true,
  //         offerToReceiveVideo: true,
  //       });

  //       await newPeerConnection.setLocalDescription(offer);
  //       console.log('Created offer, sending...');
  //       signalServerRef.current && signalServerRef.current.postMessage({ type: 'offer', sdp: offer.sdp });
  //       setStartLive(true);
  //     } catch (error) {
  //       console.error('Error accessing media devices:', error);
  //     }
  //   }
  // };
  const StartCamer2Streaming = async () => {
    // if (peerConnection2) {
    //   console.log('Peer connection 2 already established');
    //   return;
    // }
    const config = {
      iceServers: [
        { urls: 'stun:64.20.39.42:3478' }, // Public STUN server
        {
          url: 'turn:numb.viagenie.ca',
          credential: 'muazkh',
          username: 'webrtc@live.com',
        },
      ],
    };
    const newPeerConnection = new RTCPeerConnection(config);
    setPeerConnection2(newPeerConnection);
    signalServerRef2.current.postMessage({ type: 'icecandidate', candidate });
    newPeerConnection.addEventListener('icecandidate', (e) => {
      let candidate;
      if (e.candidate !== null) {
        candidate = {
          candidate: e.candidate.candidate,
          sdpMid: e.candidate.sdpMid,
          sdpMLineIndex: e.candidate.sdpMLineIndex,
        };
      }
      signalServerRef2.current && signalServerRef2.current.postMessage({ type: 'icecandidate', candidate });
    });

    // Ensure that we have valid selected camera indices
    if (videoDevices.length > 0) {
      const selectedCamera1 = videoDevices[selectedCamera1Index];
      const selectedCamera2 = videoDevices[selectedCamera2Index];

      try {
        // Request media stream from the selected camera
        // const stream1 = await navigator.mediaDevices.getUserMedia({
        //   video: {
        //     deviceId: selectedCamera1 ? { exact: selectedCamera1.deviceId } : undefined,
        //   },
        // });

        const stream2 = await navigator.mediaDevices.getUserMedia({
          video: {
            deviceId: selectedCamera2 ? { exact: selectedCamera2.deviceId } : undefined,
          },
        });

        // Attach streams to local video elements
        // if (localVideoRef1.current && stream1) {
        //   localVideoRef1.current.srcObject = stream1;
        // }

        if (localVideoRef2.current && stream2) {
          // Assuming you want to handle both streams in the same element
          localVideoRef2.current.srcObject = stream2; // Alternatively, use a different ref for stream2
        }

        // Add tracks from the selected cameras to the peer connection
        // stream1.getTracks().forEach((track) => newPeerConnection.addTrack(track, stream1));
        stream2.getTracks().forEach((track) => newPeerConnection.addTrack(track, stream2));

        // Create and send an offer to the remote peer
        const offer = await newPeerConnection.createOffer({
          offerToReceiveAudio: true,
          offerToReceiveVideo: true,
        });

        await newPeerConnection.setLocalDescription(offer);
        console.log('Created offer, sending...');
        signalServerRef2.current && signalServerRef2.current.postMessage({ type: 'offer', sdp: offer.sdp });
        setStartLive(true);
      } catch (error) {
        console.error('Error accessing media devices:', error);
      }
    }
  };

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
  const handleRoundStart = () => {
    let roundId = 1;
    console.log(roundDetails?.message && roundDetails?.message?.data, 'roundeDetails');
    if (roundDetails?.message && roundDetails?.message?.data?.roundNumber) {
      roundId += roundDetails?.message?.data?.roundNumber;
    }
    setSelectResult('');
    const futureTime = parseISO(roundDetails.message.data?.createdAt);
    const currentTime = new Date();
    const secondsLeft = differenceInSeconds(currentTime, futureTime);
    setCountdown(45 - secondsLeft);
    return createRound.mutate({ roomId, round: { roundNumber: roundId, gameroom: roomId, roundCountdown: true } });
  };
  useEffect(() => {
    if (roundDetails) {
      const futureTime = parseISO(roundDetails.message.data?.createdAt);
      const currentTime = new Date();
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
                {/* <div className="live-stream-container" style={{ visibility: isLoaded ? 'visible' : 'hidden' }}> */}
                <iframe src="https://video.thietkewebcobac.com/XocDiaA/" height={250} width={400} />
                {/* <RemoteStream roomId={roomId} userId={localStorage.getItem('userId')} /> */}
                {/* </div> */}
              </div>
              <div className="w-1/4  mt-40"></div>
            </div>
            <div className="flex items-center justify-between px-10 gap-x-4">
              <EvenSelectionBoard selectResult={selectResult} setSelectResult={handleResultSelect} />
              <div className="w-1/4 bg-slate-50 h-64">
                <video ref={localVideoRef2} autoPlay />
              </div>
              <OddSelectionBoard selectResult={selectResult} setSelectResult={handleResultSelect} />
            </div>
            <DealerFooter
              roomId={roomId ?? ''}
              round={roundDetails?.message}
              setMeetingId={setMeetingId}
              setStartLive={setStartLive}
              startLive={startLive}
              setAuthToken={setAuthToken}
              cameraId={cameraId}
              isCameraOn={false}
              stopStream={startStreaming}
              setCameraId={setCameraId}
              startStream={startStreaming}
              startStream2={StartCamer2Streaming}
              videoDevices={videoDevices}
              setSelectedCamera1Index={setSelectedCamera1Index}
              setSelectedCamera2Index={setSelectedCamera2Index}
              cameraToken={cameratoken}
              setCameraToken={setCameratoken}
              meetingId={meetingId}
              authToken={authToken}
              toggleCamera={() => {}}
              selectResult={selectResult}
              setSelectResult={setSelectResult}
              resultDeclare={handleDeclareResult}
              roundStatus={roundDetails?.message?.data?.roundStatus}
              countdown={countdown}
              setCountDown={setCountdown}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DealerComponent;

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
  component: () => (
    <PrivateRoute>
      <DealerComponent />
    </PrivateRoute>
  ),
});

