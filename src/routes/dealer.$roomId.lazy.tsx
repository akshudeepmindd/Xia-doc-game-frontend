import DealerFooter from '@/components/dealer-footer';
import SpeakerScreen from '@/components/livestream/speaker';
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
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import SpeakerScreen2 from '@/components/livestream/participants2';

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
  const [selectResult, setSelectResult] = useState<string>('');
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const { mutateAsync: updateResult } = useMutation({
    mutationFn: updateRound,
  });

  useEffect(() => {
    socket.on(SOCKET_ROUND_START, (data: any) => {
      console.log('SOCKET DATA', data);
      setCountdown(45);
    });

    return () => {
      socket.off(SOCKET_ROUND_START);
    };
  }, []);

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
  const { mutateAsync: declareResult } = useMutation({
    mutationFn: declareResultService,
  });
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

  const [streamKey, setStreamKey] = useState('');
  const [muxPlaybackId, setMuxPlaybackId] = useState('');

  const { data: roomDetails } = useQuery({
    queryKey: [GET_ROOMS_DETAILS],
    queryFn: async () => getRoomDetailService(roomId || ''),
  });

  useEffect(() => {
    if (roomDetails) {
      setStreamKey(roomDetails?.muxStreamKey);
      setMuxPlaybackId(roomDetails?.muxPlaybackId);
    }
  }, [roomDetails]);

  const startStreaming = async () => {
    if (!streamKey) return;

    try {
      streamRef.current = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      if (videoRef.current) {
        videoRef.current.srcObject = streamRef.current;
      }

      const mediaRecorder = new MediaRecorder(streamRef.current, {
        mimeType: 'video/webm',
      });

      mediaRecorder.ondataavailable = async (event) => {
        if (event.data.size > 0) {
          const formData = new FormData();
          formData.append('file', event.data, 'video.webm');

          await fetch(`https://stream.mux.com/${streamKey}`, {
            method: 'POST',
            body: formData,
          });
        }
      };

      mediaRecorder.start(1000); // Send data every second
    } catch (err) {
      console.error('Error starting stream:', err);
    }
  };

  const handleDeclareResult = async (result: string) => {
    if (roundDetails?.message?.data?._id) {
      await declareResult({ roundId: roundDetails?.message?.data?._id, result });
    }
  };

  useEffect(() => {
    if (streamKey) {
      startStreaming();
    }
  }, [streamKey]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-auto bg-no-repeat bg-center bg-cover bg-[url('/game.png')] relative h-[100vh]">
      <div className="flex flex-col h-screen">
        <Navbar roomId={roomId} isDealer={true} />
        <div className="flex-1 flex flex-col gap-y-2">
          <div className="flex items-center justify-between px-10 gap-x-4">
            <div className="w-1/4 h-40 flex items-center justify-center">
              <div className="w-24 h-24 flex items-center justify-center text-background border-2 rounded-full text-3xl font-medium font-mono">
                {countdown > 0 ? countdown : <span className="text-xl">Start</span>}
              </div>
            </div>
            <div className="w-[43rem] overflow-hidden">
              <video ref={videoRef} autoPlay muted className="w-full h-full" />
            </div>
            <div className="w-1/4 border rounded-xl mt-40">
              <div className="table w-full text-white p-2 ">
                <div className="table-header-group">
                  <div className="table-row rounded-xl p-2">
                    <div className="table-cell text-center">Bet</div>
                    <div className="table-cell text-center">Win</div>
                  </div>
                </div>
                <div className="table-row-group">
                  <div className="table-row text-center">
                    <div className="table-cell">$2500</div>
                    <div className="table-cell">$3000</div>
                  </div>
                  <div className="table-row text-center">
                    <div className="table-cell">$2500</div>
                    <div className="table-cell">$3000</div>
                  </div>
                  <div className="table-row text-center">
                    <div className="table-cell">$2500</div>
                    <div className="table-cell">$3000</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between px-10 gap-x-4">
            <EvenSelectionBoard selectResult={selectResult} setSelectResult={handleResultSelect} />
            <div className="w-1/4 bg-slate-50 h-64">
              <div className="flex justify-center items-center h-25">Webcam Streaming to Mux</div>
            </div>
            <OddSelectionBoard selectResult={selectResult} setSelectResult={handleResultSelect} />
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
    <div className="w-1/4 h-72 flex flex-col gap-y-6">
      <div className="grid gap-6">
        <div className="bg-[#0099C3] rounded-lg">
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
            'flex flex-col justify-around w-full border-background p-26 rounded p-2 bg-[#0099C3]',
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
            'flex flex-col justify-around w-full border border-background p-26 rounded p-2 bg-[#0099C3]',
            selectResult === BetType.TWO_BLACK_TWO_WHITE ? 'bg-white/10 glow' : '',
          )}
          onClick={() => setSelectResult(BetType.TWO_BLACK_TWO_WHITE)}
        >
          <h3 className="flex items-center justify-around w-full">
            <span className="text-background text-sm">White 2</span>
            <span className="text-background text-sm">Red 2</span>
          </h3>
          <div className="w-full flex items-center justify-around">
            <RedCircle />
            <RedCircle />
            <WhiteCircle />
            <WhiteCircle />
          </div>
        </div>
        <div
          className={cn(
            'flex flex-col justify-around w-full border border-background h-24 rounded p-2',
            selectResult === BetType.EVEN ? 'bg-white/10 glow' : '',
          )}
          onClick={() => setSelectResult(BetType.EVEN)}
        >
          <div className="w-full flex items-center justify-around 4xl text-background">EVEN</div>
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
    <div className="w-1/4 h-72 flex flex-col gap-y-6">
      <div className="grid  gap-6">
        <div className="bg-[#972b46] rounded-lg p-8">
          <h1 className="text-background text-2xl font-medium text-center">Odd</h1>
        </div>
        <div
          className={cn(
            'flex flex-col justify-around w-full border border-background h-24 rounded p-2',
            selectResult === BetType.THREE_WHITE_ONE_BLACK ? 'bg-white/10 glow' : '',
          )}
          onClick={() => setSelectResult(BetType.THREE_WHITE_ONE_BLACK)}
        >
          <h3 className="flex items-center justify-around w-full">
            <span className="text-background">White 3</span>
            <span className="text-background">Red 1</span>
          </h3>
          <div className="w-full flex items-center justify-around">
            <WhiteCircle />
            <WhiteCircle />
            <WhiteCircle />
            <RedCircle />
          </div>
        </div>
        <div
          className={cn(
            'flex flex-col justify-around w-full border border-background h-24 rounded p-2',
            selectResult === BetType.THREE_BLACK_ONE_WHITE ? 'bg-white/10 glow' : '',
          )}
          onClick={() => setSelectResult(BetType.THREE_BLACK_ONE_WHITE)}
        >
          <h3 className="flex items-center justify-around w-full">
            <span className="text-background">White 1</span>
            <span className="text-background">Red 3</span>
          </h3>
          <div className="w-full flex items-center justify-around">
            <WhiteCircle />
            <RedCircle />
            <RedCircle />
            <RedCircle />
          </div>
        </div>
        <div
          className={cn(
            'flex flex-col justify-around w-full border border-background h-24 rounded p-2',
            selectResult === BetType.ODD ? 'bg-white/10 glow' : '',
          )}
          onClick={() => setSelectResult(BetType.ODD)}
        >
          <div className="w-full flex items-center justify-around 4xl text-background">ODD</div>
        </div>
      </div>
    </div>
  );
};

export const Route = createLazyFileRoute('/dealer/$roomId')({
  component: DealerComponent,
});
