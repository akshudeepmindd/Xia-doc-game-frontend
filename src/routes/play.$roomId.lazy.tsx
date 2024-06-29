import ViewerScreenContainer from '@/components/livestream/participants';
import Navbar from '@/components/navbar';
import useProfile from '@/hooks/useProfile';
import { GET_ROOMS_DETAILS, GET_ROUND_DETAILS } from '@/lib/constants';
import { getRoomDetailService } from '@/services/room';
import { useQuery } from '@tanstack/react-query';
import { createLazyFileRoute, useParams } from '@tanstack/react-router';
import { SOCKET_ROUND_START } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { socket } from '@/services';
import { useEffect, useMemo, useState } from 'react';
import { getRoundDetails } from '@/services/round';
import { differenceInSeconds, parseISO } from 'date-fns';

const GameComponent = () => {
  const { roomId } = useParams({ strict: false });
  const { isSbo } = useProfile();

  const [selectedCard, setSelectedCard] = useState<number>();

  const [countdown, setCountdown] = useState<number>(0);
  const [meetingId, setMeetingId] = useState<string>('');
  const [authToken, setAuthToken] = useState<string>('');

  useEffect(() => {
    socket.on(SOCKET_ROUND_START, (data: any) => {
      console.log('SOCKET DATA', data);
      setCountdown(45);
    });

    return () => {
      socket.off(SOCKET_ROUND_START);
    };
  }, []);

  const { isLoading: isLoading2, data: roundDetails } = useQuery({
    queryKey: [GET_ROUND_DETAILS],
    queryFn: () => getRoundDetails(roomId ? roomId : ''),
    enabled: !!roomId,
  });

  useEffect(() => {
    console.log("roundDetails", roundDetails)
    if (roundDetails) {
      const futureTime = parseISO(roundDetails.message.updatedAt);

      // Get current time
      const currentTime = new Date();

      // Calculate difference in seconds
      const secondsLeft = differenceInSeconds(currentTime, futureTime);

      setCountdown(45 - secondsLeft);
    }
  }, [roundDetails?.message?.updatedAt])

  useEffect(() => {
    if (countdown > 0) {
      const timer = setInterval(() => {
        setCountdown((prevCountdown) => prevCountdown - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [countdown]);

  const countDownStatus = useMemo(() => {
    if (countdown <= 25 && countdown > 0) {
      return "BET"
    }

    return "BET_LOCK"
  }, [countdown])

  const countDownSPOStatus = useMemo(() => {
    if (countdown <= 40 && countdown > 0 && isSbo) {
      return "BET_SPO"
    }

    return "BET_SPO_LOCK"
  }, [countdown, isSbo])

  const { isLoading, data: roomDetails } = useQuery({
    queryKey: [GET_ROOMS_DETAILS],
    queryFn: async () => getRoomDetailService(roomId || ''),
    refetchInterval: 3000,
    refetchIntervalInBackground: true,
  });

  const handleSelection = (card: number) => {
    if (countDownSPOStatus === "BET_SPO" && (card === 6 || card === 4 || card === 3 || card === 2)) {
      setSelectedCard(card);
    }

    if (countDownStatus === "BET" && (card === 1 || card === 5)) {
      setSelectedCard(card)
    }
  };

  useEffect(() => {
    if (!isLoading) {
      if (roomDetails) {
        setMeetingId(roomDetails?.dealerLiveStreamId);
        setAuthToken(roomDetails?.streamingToken);
      }
    }
  }, [roomDetails, isLoading]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col h-screen bg-[url(/casino-bg.jpg)] bg-no-repeat bg-cover bg-center">
      <Navbar roomId={roomId} />

      <div className="flex-1 flex item-center justify-center relative">
        <img className="h-[calc(100vh-5rem)]" src="/poker-table.png" />

        {countdown > 0 && (
          <div className="absolute top-10 left-10">
            <div className="w-24 h-24 flex items-center justify-center bg-foreground text-background border-2 rounded-full text-3xl font-medium font-mono">
              <span className="text-xl">{countdown}</span>
            </div>
          </div>
        )}

        <div
          onClick={() => handleSelection(1)}
          className={cn(
            'clip-path-tl 2xl:w-64 2xl:h-44 w-56 h-40 absolute bg-blue-800 top-[33%] -translate-y-[55%] 2xl:left-[19%] left-[18%]',
            selectedCard === 1 ? 'animate-pulse ring-2 ring-amber-400 bg-amber-500' : '', countDownStatus === "BET_LOCK" ? "bg-blue-950 cursor-not-allowed" : ""
          )}
        ></div>
        <div
          onClick={() => handleSelection(2)}
          className={cn(
            'clip-path-horizontal 2xl:w-64 2xl:h-44 w-56 h-40 absolute bg-blue-800 bottom-[40%] translate-y-[55%] rotate-180 2xl:left-[19%] left-[18%]',
            selectedCard === 2 ? 'animate-pulse ring-2 ring-amber-400 bg-amber-500' : '', countDownSPOStatus === "BET_SPO_LOCK" ? "bg-blue-950 cursor-not-allowed" : ""
          )}
        ></div>

        <div className="w-[25%] h-64 2xl:w-[30%] 2xl:h-80 absolute top-[23%] -translate-y-[50%] left-[50%] -translate-x-1/2">
          {meetingId !== '' && <ViewerScreenContainer meetingId={meetingId} authToken={authToken} />}
        </div>

        <div
          onClick={() => handleSelection(3)}
          className={cn(
            'clip-path-horizontal 2xl:w-64 2xl:h-44 w-56 h-40 absolute bg-blue-800 top-[33%] -translate-y-[55%] 2xl:right-[19%] right-[18%]',
            selectedCard === 3 ? 'animate-pulse ring-2 ring-amber-400 bg-amber-500' : '', countDownSPOStatus === "BET_SPO_LOCK" ? "bg-blue-950 cursor-not-allowed" : ""
          )}
        ></div>
        <div
          onClick={() => handleSelection(4)}
          className={cn(
            'clip-path-tl 2xl:w-64 2xl:h-44 w-56 h-40 absolute bg-blue-800 bottom-[40%] translate-y-[55%] rotate-180 2xl:right-[19%] right-[18%]',
            selectedCard === 4 ? 'animate-pulse ring-2 ring-amber-400 bg-amber-500' : '', countDownSPOStatus === "BET_SPO_LOCK" ? "bg-blue-950 cursor-not-allowed" : ""
          )}
        ></div>

        <div
          onClick={() => handleSelection(5)}
          className={cn(
            '2xl:w-44 2xl:h-44 w-40 h-40 bg-blue-800 absolute bottom-[40%] translate-y-[55%] 2xl:left-[38%] left-[37.5%]',
            selectedCard === 5 ? 'animate-pulse ring-2 ring-amber-400 bg-amber-500' : '', countDownStatus === "BET_LOCK" ? "bg-blue-950 cursor-not-allowed" : ""
          )}
        ></div>
        <div
          onClick={() => handleSelection(6)}
          className={cn(
            '2xl:w-44 2xl:h-44 w-40 h-40 bg-blue-800 absolute bottom-[40%] translate-y-[55%] 2xl:right-[38%] right-[37.5%]',
            selectedCard === 6 ? 'animate-pulse ring-2 ring-amber-400 bg-amber-500' : '', countDownSPOStatus === "BET_SPO_LOCK" ? "bg-blue-950 cursor-not-allowed" : ""
          )}
        ></div>

        <div className="flex items-center justify-around absolute bottom-2 w-96 bg-background rounded shadow-sm h-20">
          <CoinChips amount={500} />
          <CoinChips amount={1000} />
          <CoinChips amount={2000} />
          <CoinChips amount={5000} />
        </div>
      </div>
    </div>
  );
};

const CoinChips = ({ amount }: { amount: number }) => {
  return (
    <div className="w-20 h-20 relative hover:animate-bounce hover:transition-all">
      <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[56%] text-xs font-semibold font-mono">
        {amount}K
      </span>
      <img src="/chip-3.png" className="w-full h-full" />
    </div>
  );
};

export const Route = createLazyFileRoute('/play/$roomId')({
  component: GameComponent,
});
