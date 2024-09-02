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
  const [selectResult, setSelectResult] = useState<string>();
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
    <div className="bg-auto bg-no-repeat bg-center bg-cover bg-[url('/game.png')] relative h-[100vh]">
      <div className="flex flex-col h-screen ">
        <Navbar roomId={roomId} isDealer={true} />
        <div className="flex-1 flex flex-col gap-y-2">
          <div className="flex items-center justify-between px-10 gap-x-4">
            <div className="w-1/4 h-40 flex items-center justify-center">
              <div className="w-24 h-24 flex items-center justify-center text-background border-2 rounded-full text-3xl font-medium font-mono">
                {countdown > 0 ? countdown : <span className="text-xl">Start</span>}
              </div>
            </div>
            <div className="w-[43rem]  overflow-hidden">
              {startLive ? (
                <SpeakerScreen meetingId={meetingId} name={username} authToken={authToken} player="1" />
              ) : (
                <div className="flex justify-center items-center h-25">Live Need to Start from Bottom</div>
              )}
            </div>
            <div className="w-1/4 border rounded-xl mt-40">
              <div className="table w-full text-white p-2 ">
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
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between px-10 gap-x-4">
            <EvenSelectionBoard selectResult={selectResult} setSelectResult={handleResultSelect} />
            <div className="w-1/4 bg-slate-50 h-64">
              {startLive ? (
                <SpeakerScreen2 meetingId={cameraId} authToken={cameratoken} player="2" />
              ) : (
                <div className="flex justify-center items-center h-25">Live Need to Start from Bottom</div>
              )}
            </div>
            <OddSelectionBoard selectResult={selectResult} setSelectResult={handleResultSelect} />
          </div>
          {roomId && roomDetails?.dealerLiveStreamId && roomDetails?.streamingToken && (
            <>
              <MeetingProvider
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
              >
                <DealerFooter
                  roomId={roomId}
                  round={roundDetails?.message}
                  setMeetingId={setMeetingId}
                  setStartLive={setStartLive}
                  startLive={startLive}
                  setAuthToken={setAuthToken}
                  cameraId={cameraId}
                  setCameraId={setCameraId}
                  cameraToken={cameratoken}
                  setCameraToken={setCameratoken}
                  meetingId={meetingId}
                  authToken={authToken}
                  selectResult={selectResult}
                  setSelectResult={setSelectResult}
                  resultDeclare={handleDeclareResult}
                  roundStatus={roundDetails?.message?.data?.roundStatus}
                  countdown={countdown}
                  setCountDown={setCountdown}
                />
              </MeetingProvider>
            </>
          )}
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
