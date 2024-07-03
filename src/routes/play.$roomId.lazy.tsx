import ViewerScreenContainer from '@/components/livestream/participants';
import Navbar from '@/components/navbar';
import useProfile from '@/hooks/useProfile';
import { Button } from "@/components/ui/button";

import { GET_ROOMS_DETAILS, GET_ROUND_DETAILS } from '@/lib/constants';
import { getRoomDetailService } from '@/services/room';
import { useMutation, useQuery } from '@tanstack/react-query';
import { createLazyFileRoute, useParams } from '@tanstack/react-router';
import { SOCKET_ROUND_START } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { socket } from '@/services';
import { useEffect, useMemo, useState } from 'react';
import { getRoundDetails, placeBetService } from '@/services/round';
import { differenceInSeconds, parseISO } from 'date-fns';
import { RedCircle, WhiteCircle } from './dealer.$roomId.lazy';

const getBetTypeBySelectionCard = (selectionCard: number) => {
  switch (selectionCard) {
    case 1:
      return 'EVEN';
    case 2:
      return 'FOUR_WHITE';
    case 3:
      return 'ODD';
    case 4:
      return 'THREE_BLACK_ONE_WHITE';
    case 5:
      return 'FOUR_BLACK';
    case 6:
      return 'THREE_WHITE_ONE_BLACK';
    default:
      return 'TWO_BLACK_TWO_WHITE';
  }
};

const GameComponent = () => {
  const { roomId } = useParams({ strict: false });
  const { isSbo, userId } = useProfile();

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
    refetchInterval: 1000,
    refetchIntervalInBackground: true,
  });

  useEffect(() => {
    if (roundDetails && roundDetails?.message?.data?.createdAt) {
      const futureTime = parseISO(roundDetails?.message?.data?.createdAt);

      // Get current time
      const currentTime = new Date();

      // Calculate difference in seconds
      const secondsLeft = differenceInSeconds(currentTime, futureTime);

      setCountdown(45 - secondsLeft);
    }
  }, [roundDetails?.message?.data?.createdAt]);

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
      return 'BET';
    }

    return 'BET_LOCK';
  }, [countdown]);

  const countDownSPOStatus = useMemo(() => {
    if (countdown <= 40 && countdown > 0 && isSbo) {
      return 'BET_SPO';
    }

    return 'BET_SPO_LOCK';
  }, [countdown, isSbo]);

  const { isLoading, data: roomDetails } = useQuery({
    queryKey: [GET_ROOMS_DETAILS],
    queryFn: async () => getRoomDetailService(roomId || ''),
    refetchInterval: 3000,
    refetchIntervalInBackground: true,
  });

  const { mutate: placeBet } = useMutation({
    mutationFn: placeBetService,
  });

  const handleSelection = (card: number) => {
    if (countDownSPOStatus === 'BET_SPO' && (card === 6 || card === 4 || card === 5 || card === 2)) {
      setSelectedCard(card);
      placeBet({
        roundId: roundDetails?.message?.data?._id,
        userId: userId,
        betAmount: 1000,
        betType: getBetTypeBySelectionCard(card),
      });
    }

    if (countDownStatus === 'BET' && (card === 1 || card === 3)) {
      setSelectedCard(card);
      placeBet({
        roundId: roundDetails?.message?.data?._id,
        userId: userId,
        betAmount: 1000,
        betType: getBetTypeBySelectionCard(card),
      });
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
    <div className="flex flex-col h-screen bg-[#040816] bg-center">
      <Navbar roomId={roomId} />

      <div className="flex-1 ">
        {/* <img className="h-[calc(100vh-5rem)]" src="/poker-table.png" /> */}

        {/* {countdown > 0 && ( */}
        
        {/* )} */}
        <div className="flex justify-between">
         
           <div className='flex justify-between border-[#243c5a] border-x-4 border-y-4 w-20'>
           <div className='flex justify-between'>
           <Button size={'icon'} className="w-8 h-8" variant={'ghost'}>
             <img src="/Info.svg"/>

        </Button>
        <Button size={'icon'} className="w-8 h-8" variant={'ghost'}>
             <img src="/Info.svg"/>

        </Button>
           </div>


         
            
           </div>
          
           <div className="border-[#ffffff]">
            <div className="w-24 h-24 flex items-center justify-center bg-[red] text-background border-2 rounded-full text-3xl font-medium font-mono">
              <span className="text-xl">{countdown}</span>
            </div>
          </div>
        </div>
        {/* 

        <div
          onClick={() => handleSelection(1)}
          className={cn(
            'flex items-center justify-center clip-path-tl 2xl:w-64 2xl:h-44 w-56 h-40 absolute bg-blue-800 top-[33%] -translate-y-[55%] 2xl:left-[19%] left-[18%]',
            selectedCard === 1 ? 'ring-2 ring-amber-400 bg-amber-500' : '', countDownStatus === "BET_LOCK" ? "bg-blue-950 cursor-not-allowed" : ""
          )}
        >
          <span className='text-background text-2xl'>Even</span>
          <CoinChips className={cn(selectedCard === 1 ? 'animate__bounceInDown animate__delay-2s animate__slow' : 'hidden')} amount={500} />
        </div>
        <div
          onClick={() => handleSelection(2)}
          className={cn(
            'clip-path-horizontal 2xl:w-64 2xl:h-44 w-56 h-40 absolute bg-blue-800 bottom-[40%] translate-y-[55%] rotate-180 2xl:left-[19%] left-[18%]',
            selectedCard === 2 ? 'animate-pulse ring-2 ring-amber-400 bg-amber-500' : '', countDownSPOStatus === "BET_SPO_LOCK" ? "bg-blue-950 cursor-not-allowed" : ""
          )}
        >
          <div className="w-11/12 h-full flex flex-col gap-2 items-end justify-start w-full border-nonerounded p-2 -rotate-180">
            <div className="w-full flex items-center justify-around mt-4">
              <WhiteCircle />
              <WhiteCircle />
              <WhiteCircle />
              <WhiteCircle />
            </div>
          </div>
        </div> */}

        {/* <div className="w-[25%] h-64 2xl:w-[30%] 2xl:h-80 absolute top-[23%] -translate-y-[50%] left-[50%] -translate-x-1/2">
          {meetingId !== '' && <ViewerScreenContainer meetingId={meetingId} authToken={authToken} />}
        </div>

        <div
          onClick={() => handleSelection(3)}
          className={cn(
            'flex items-center justify-center clip-path-horizontal 2xl:w-64 2xl:h-44 w-56 h-40 absolute bg-blue-800 top-[33%] -translate-y-[55%] 2xl:right-[19%] right-[18%]',
            selectedCard === 3 ? 'animate-pulse ring-2 ring-amber-400 bg-amber-500' : '', countDownStatus === "BET_LOCK" ? "bg-blue-950 cursor-not-allowed" : ""
          )}
        >
          <span className='text-background text-2xl'>Odd</span>
        </div>
        <div
          onClick={() => handleSelection(4)}
          className={cn(
            'flex flex-col items-end clip-path-tl 2xl:w-64 2xl:h-44 w-56 h-40 absolute bg-blue-800 bottom-[40%] translate-y-[55%] rotate-180 2xl:right-[19%] right-[18%]',
            selectedCard === 4 ? 'animate-pulse ring-2 ring-amber-400 bg-amber-500' : '', countDownSPOStatus === "BET_SPO_LOCK" ? "bg-blue-950 cursor-not-allowed" : ""
          )}
        >
          <div className="w-11/12 h-full flex flex-col gap-2 items-start justify-start w-full border-nonerounded p-2 -rotate-180">
            <div className="w-full flex items-center justify-around mt-4">
              <RedCircle />
              <RedCircle />
              <RedCircle />
              <WhiteCircle />
            </div>
          </div>
        </div> */}

        {/* <div
          onClick={() => handleSelection(5)}
          className={cn(
            '2xl:w-44 2xl:h-44 w-40 h-40 bg-blue-800 absolute bottom-[40%] translate-y-[55%] 2xl:left-[38%] left-[37.5%]',
            selectedCard === 5 ? 'animate-pulse ring-2 ring-amber-400 bg-amber-500' : '', countDownSPOStatus === "BET_SPO_LOCK" ? "bg-blue-950 cursor-not-allowed" : ""
          )}
        >
          <div className="w-full h-full flex flex-col gap-2 items-end justify-start w-full border-nonerounded p-2">
            <div className="w-full flex items-center justify-around mt-4">
              <RedCircle />
              <RedCircle />
              <RedCircle />
              <RedCircle />
            </div>
          </div>
        </div>
        <div
          onClick={() => handleSelection(6)}
          className={cn(
            '2xl:w-44 2xl:h-44 w-40 h-40 bg-blue-800 absolute bottom-[40%] translate-y-[55%] 2xl:right-[38%] right-[37.5%]',
            selectedCard === 6 ? 'animate-pulse ring-2 ring-amber-400 bg-amber-500' : '', countDownSPOStatus === "BET_SPO_LOCK" ? "bg-blue-950 cursor-not-allowed" : ""
          )}
        >
          <div className="w-full h-full flex flex-col gap-2 items-end justify-start w-full border-nonerounded p-2">
            <div className="w-full flex items-center justify-around mt-4">
              <WhiteCircle />
              <WhiteCircle />
              <WhiteCircle />
              <RedCircle />
            </div>
          </div>
        </div> */}

        <div className="flex items-center justify-around absolute bottom-2 w-96 bg-background rounded shadow-sm h-20">
          <CoinChips className="hover:animate-bounce hover:transition-all" amount={500} />
          <CoinChips className="hover:animate-bounce hover:transition-all" amount={1000} />
          <CoinChips className="hover:animate-bounce hover:transition-all" amount={2000} />
          <CoinChips className="hover:animate-bounce hover:transition-all" amount={5000} />
        </div>
      </div>
    </div>
  );
};

const CoinChips = ({ amount, className }: { amount: number; className?: string }) => {
  return (
    <div className={cn('w-20 h-20 relative', className)}>
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
