import DealerFooter from '@/components/dealer-footer';
import SpeakerScreen from '@/components/livestream/speaker';
import Navbar from '@/components/navbar';
import { GET_ROUND_DETAILS, SOCKET_ROUND_START } from '@/lib/constants';
import { socket } from '@/services';
import { declareResultService, getRoundDetails } from '@/services/round';
import { useMutation, useQuery } from '@tanstack/react-query';
import { createLazyFileRoute, useParams } from '@tanstack/react-router';
import useProfile from '@/hooks/useProfile';
import { GET_ROOMS_DETAILS } from '@/lib/constants';
import { getRoomDetailService } from '@/services/room';
import { MeetingProvider } from '@videosdk.live/react-sdk';
import { differenceInSeconds, parseISO } from 'date-fns';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

const BetType = {
  FOUR_BLACK: 'FOUR_BLACK',
  FOUR_WHITE: 'FOUR_WHITE',
  THREE_BLACK_ONE_WHITE: 'THREE_BLACK_ONE_WHITE',
  THREE_WHITE_ONE_BLACK: 'THREE_WHITE_ONE_BLACK',
  TWO_BLACK_TWO_WHITE: 'TWO_BLACK_TWO_WHITE',
  EVEN: 'EVEN',
  ODD: 'ODD',
}

const DealerComponent = () => {
  const { roomId } = useParams({ strict: false });
  const [countdown, setCountdown] = useState(0);
  const [selectResult, setSelectResult] = useState<string>();

  useEffect(() => {
    socket.on(SOCKET_ROUND_START, (data: any) => {
      console.log('SOCKET DATA', data);
      setCountdown(45);
    });

    return () => {
      socket.off(SOCKET_ROUND_START);
    };
  }, []);

  const { isLoading, data: roundDetails } = useQuery({
    queryKey: [GET_ROUND_DETAILS],
    queryFn: () => getRoundDetails(roomId ? roomId : ''),
    enabled: !!roomId,
    refetchInterval: 1000,
    refetchIntervalInBackground: true
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
  }, [roundDetails?.message?.data?.createdAt])

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
  const { username } = useProfile();

  const { data: roomDetails } = useQuery({
    queryKey: [GET_ROOMS_DETAILS],
    queryFn: async () => getRoomDetailService(roomId || ''),
  });

  useEffect(() => {
    if (roomDetails) {
      setMeetingId(roomDetails?.dealerLiveStreamId);
      setAuthToken(roomDetails?.streamingToken);
    }
  }, [roomDetails]);

  const { mutateAsync: declareResult } = useMutation({
    mutationFn: declareResultService
  })

  const handleDeclareResult = async (result: string) => {
    if (roundDetails?.message?.data?._id) {
      await declareResult({ roundId: roundDetails?.message?.data?._id, result })
    }
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col h-screen bg-primary">
      <Navbar roomId={roomId} isDealer={true} />
      <div className="flex-1 flex flex-col gap-y-2">
        <div className="flex items-center justify-between px-10 gap-x-4">
          {' '}
          <div className="w-1/4 h-80 flex items-center justify-center">
            <div className="w-24 h-24 flex items-center justify-center text-background border-2 rounded-full text-3xl font-medium font-mono">
              {countdown > 0 ? countdown : <span className="text-xl">Start</span>}
            </div>
          </div>
          <div className="w-[43rem] h-96 overflow-hidden">
            {startLive ? (
              <SpeakerScreen meetingId={meetingId} name={username} authToken={authToken} />
            ) : (
              <div className="flex justify-center items-center h-25">Live Need to Start from Bottom</div>
            )}
          </div>
          <div className="w-1/4 bg-slate-50">Table</div>
        </div>
        <div className="flex items-center justify-between px-10 gap-x-4">
          <EvenSelectionBoard selectResult={selectResult} setSelectResult={setSelectResult} />
          <div className="w-1/4 bg-slate-50 h-64"></div>
          <OddSelectionBoard selectResult={selectResult} setSelectResult={setSelectResult} />
        </div>
        {roomId && (
          <>
            {meetingId !== '' && (
              <MeetingProvider
                config={{
                  meetingId: meetingId ?? 'qovc-ryn6-y2dk',
                  mode: 'CONFERENCE',
                  name: 'Name',
                  micEnabled: true,
                  webcamEnabled: true,
                  debugMode: false,
                }}
                token={
                  authToken ??
                  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcGlrZXkiOiIwZWMyYWVkOC03Mzc2LTRjODEtYjc4YS1kMTU0ZTk3ZmU4MDMiLCJwZXJtaXNzaW9ucyI6WyJhbGxvd19qb2luIl0sInZlcnNpb24iOjIsImV4cGlyZXNJbiI6IjI0aCIsImlhdCI6MTcxOTcwNzc1MSwiZXhwIjoxNzE5Nzk0MTUxfQ.AcD8vOjAoLUpScH3y1Rjs3QU-ThH4nAY5eeHoikifcQ'
                }
                joinWithoutUserInteraction
              >
                <DealerFooter
                  roomId={roomId}
                  round={roundDetails?.message}
                  setMeetingId={setMeetingId}
                  setStartLive={setStartLive}
                  startLive={startLive}
                  setAuthToken={setAuthToken}
                  meetingId={meetingId}
                  authToken={authToken}
                  selectResult={selectResult}
                  resultDeclare={handleDeclareResult}
                  roundStatus={roundDetails?.message?.data?.roundStatus}
                  countdown={countdown}
                />
              </MeetingProvider>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export const RedCircle = () => {
  return <div className="w-8 h-8 bg-red-500 rounded-full"></div>;
};

export const WhiteCircle = () => {
  return <div className="w-8 h-8 bg-white rounded-full"></div>;
};

const EvenSelectionBoard = ({ selectResult, setSelectResult }: { selectResult: string | undefined, setSelectResult: Dispatch<SetStateAction<string | undefined>> }) => {
  return (
    <div className="w-1/4 h-72 flex flex-col gap-y-6" >
      <h1 className="text-background text-2xl font-medium text-center">Even</h1>
      <div className="grid grid-cols-2 gap-6">
        <div className={cn("flex flex-col justify-around w-full border border-background h-24 rounded p-2", selectResult === BetType.FOUR_WHITE ? "bg-white/10" : "")} onClick={() => setSelectResult(BetType.FOUR_WHITE)}>
          <h3 className="flex items-center justify-around w-full">
            <span className="text-background">White 4</span>
            <span className="text-background">Red 0</span>
          </h3>
          <div className="w-full flex items-center justify-around">
            <WhiteCircle />
            <WhiteCircle />
            <WhiteCircle />
            <WhiteCircle />
          </div>
        </div>
        <div className={cn("flex flex-col justify-around w-full border border-background h-24 rounded p-2", selectResult === BetType.FOUR_BLACK ? "bg-white/10" : "")} onClick={() => setSelectResult(BetType.FOUR_BLACK)}>
          <h3 className="flex items-center justify-around w-full">
            <span className="text-background">White 0</span>
            <span className="text-background">Red 4</span>
          </h3>
          <div className="w-full flex items-center justify-around">
            <RedCircle />
            <RedCircle />
            <RedCircle />
            <RedCircle />
          </div>
        </div>
        <div className={cn("flex flex-col justify-around w-full border border-background h-24 rounded p-2", selectResult === BetType.EVEN ? "bg-white/10" : "")} onClick={() => setSelectResult(BetType.EVEN)}>
          <div className="w-full flex items-center justify-around 4xl text-background">
            EVEN
          </div>
        </div>
      </div>
    </div >
  );
};

const OddSelectionBoard = ({ selectResult, setSelectResult }: { selectResult: string | undefined, setSelectResult: Dispatch<SetStateAction<string | undefined>> }) => {
  return (
    <div className="w-1/4 h-72 flex flex-col gap-y-6">
      <h1 className="text-background text-2xl font-medium text-center">Odd</h1>
      <div className="grid grid-cols-2 gap-6">
        <div className={cn("flex flex-col justify-around w-full border border-background h-24 rounded p-2", selectResult === BetType.THREE_WHITE_ONE_BLACK ? "bg-white/10" : "")} onClick={() => setSelectResult(BetType.THREE_WHITE_ONE_BLACK)}>
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
        <div className={cn("flex flex-col justify-around w-full border border-background h-24 rounded p-2", selectResult === BetType.THREE_BLACK_ONE_WHITE ? "bg-white/10" : "")} onClick={() => setSelectResult(BetType.THREE_BLACK_ONE_WHITE)}>
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
        <div className={cn("flex flex-col justify-around w-full border border-background h-24 rounded p-2", selectResult === BetType.ODD ? "bg-white/10" : "")} onClick={() => setSelectResult(BetType.ODD)}>
          <div className="w-full flex items-center justify-around 4xl text-background">
            ODD
          </div>
        </div>
      </div>
    </div>
  );
};

export const Route = createLazyFileRoute('/dealer/$roomId')({
  component: DealerComponent,
});
