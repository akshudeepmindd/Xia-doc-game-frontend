/* eslint-disable @typescript-eslint/no-unused-vars */
import ViewerScreenContainer from '@/components/livestream/participants';
import Navbar from '@/components/navbar';
import useProfile from '@/hooks/useProfile';
import { Button } from '@/components/ui/button';
import { Unity, useUnityContext } from 'react-unity-webgl';

import { GET_ROOMS_DETAILS, GET_ROUND_DETAILS, GET_USER_DETAILS } from '@/lib/constants';
import { distributeBalance, getRoomDetailService, updateRoom, verifyRoomPassword } from '@/services/room';
import { useMutation, useQuery } from '@tanstack/react-query';
import { createLazyFileRoute, useParams } from '@tanstack/react-router';
import { SOCKET_ROUND_START } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { socket } from '@/services';
import { useEffect, useMemo, useState, useRef } from 'react';
import { getRoundDetails, placeBetService, updateRound } from '@/services/round';
import { differenceInSeconds, parseISO } from 'date-fns';
import { RedCircle, WhiteCircle } from './dealer.$roomId.lazy';
import Hint from '@/components/hint';
import { AlertCircleIcon, BellDot, CircleDollarSign, Loader2, TrophyIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { distribute, gsap } from 'gsap';
import DepositDiaglog from '@/components/Deposit-dialog';
import { updateUser, userProfile } from '@/services/auth';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../components/ui/dialog';
import ConfettiExplosion from 'react-confetti-explosion';
import { Table, TableBody, TableCell, TableHead, TableRow } from '@/components/ui/table';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from '@tanstack/react-router';
import { AxiosError } from 'axios';
import Participant2 from '@/components/livestream/viewer2';
const getBetTypeBySelectionCard = (selectionCard: number | undefined) => {
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
    case 7:
      return 'EVEN_NINE_TEN';
    case 8:
      return 'EVEN_TEN_NINE';
    case 9:
      return 'ODD_NINE_TEN';
    case 10:
      return 'ODD_TEN_NINE';
    default:
      return 'TWO_BLACK_TWO_WHITE';
  }
};
const getBetTypeByCardName = (cardName: string) => {
  switch (cardName) {
    case 'EVEN':
      return 1;
    case 'FOUR_WHITE':
      return 2;
    case 'ODD':
      return 3;
    case 'THREE_BLACK_ONE_WHITE':
      return 4;
    case 'FOUR_BLACK':
      return 5;
    case 'THREE_WHITE_ONE_BLACK':
      return 6;
    case 'EVEN_NINE_TEN':
      return 7;
    case 'EVEN_TEN_NINE':
      return 8;
    case 'ODD_NINE_TEN':
      return 9;
    case 'ODD_TEN_NINE':
      return 10;
    default:
      return 0;
  }
};

const RoomVerfication = z.object({
  password: z.string().min(1, 'Password is required!'),
});

const GameComponent = () => {
  const { roomId } = useParams({ strict: false });
  const [devicePixelRatio, setDevicePixelRatio] = useState(window.devicePixelRatio);

  useEffect(
    function () {
      // A function which will update the device pixel ratio of the Unity
      // Application to match the device pixel ratio of the browser.
      const updateDevicePixelRatio = function () {
        setDevicePixelRatio(window.devicePixelRatio);
      };
      // A media matcher which watches for changes in the device pixel ratio.
      const mediaMatcher = window.matchMedia(`screen and (resolution: ${devicePixelRatio}dppx)`);
      // Adding an event listener to the media matcher which will update the
      // device pixel ratio of the Unity Application when the device pixel
      // ratio changes.
      mediaMatcher.addEventListener('change', updateDevicePixelRatio);
      return function () {
        // Removing the event listener when the component unmounts.
        mediaMatcher.removeEventListener('change', updateDevicePixelRatio);
      };
    },
    [devicePixelRatio],
  );
  // const { isSbo, userId, roomOwner } = useProfile();
  // const [selectedCard, setSelectedCard] = useState<number>();
  // const [selectedSPOCard, setSelectedSPOCard] = useState<number>();
  // const [coins, setCoins] = useState<any[]>([]);
  // const [countdown, setCountdown] = useState<number>(0);
  // const [meetingId, setMeetingId] = useState<string>('');
  // const [cameraId, setCameraId] = useState<string>('');
  // const [authToken, setAuthToken] = useState<string>('');
  // const [currentSelectedAmount, setCurrentSelectedAmount] = useState<number>(0);
  // const [currentBet, setCurrentBet] = useState<number>(0);
  // const [userBet, setUserBet] = useState<number>(0);
  // const coinId = useRef(0);
  // const [winnermodal, setwinnerModal] = useState(false);
  // const [openPasswordDialog, setOpenPasswordDialog] = useState(true);
  // const [verifiedPassword, setVerifiedPassword] = useState(false);

  // const form = useForm<z.infer<typeof RoomVerfication>>({
  //   resolver: zodResolver(RoomVerfication),
  //   defaultValues: {
  //     password: '',
  //   },
  // });

  // const navigate = useNavigate();

  // useEffect(() => {
  //   socket.on(SOCKET_ROUND_START, (data: any) => {
  //     console.log('SOCKET DATA', data);
  //     setCountdown(45);
  //   });

  //   return () => {
  //     socket.off(SOCKET_ROUND_START);
  //   };
  // }, []);

  // const { isLoading: isLoading2, data: roundDetails } = useQuery({
  //   queryKey: [GET_ROUND_DETAILS],
  //   queryFn: () => getRoundDetails(roomId ? roomId : ''),
  //   enabled: !!roomId,
  //   refetchInterval: 1000,
  //   refetchIntervalInBackground: true,
  // });

  // const { isLoading: isUserLoading, data: userDetails } = useQuery({
  //   queryKey: [GET_USER_DETAILS],
  //   queryFn: () => userProfile(userId),
  //   enabled: !!userId,
  //   refetchInterval: 1000,
  //   refetchIntervalInBackground: true,
  // });

  // useEffect(() => {
  //   if (roundDetails && roundDetails?.message?.data?.createdAt) {
  //     const futureTime = parseISO(roundDetails?.message?.data?.createdAt);

  //     // Get current time
  //     const currentTime = new Date();

  //     // Calculate difference in seconds
  //     const secondsLeft = differenceInSeconds(currentTime, futureTime);

  //     if (secondsLeft <= 45) {
  //       setCountdown(45 - secondsLeft);
  //     }
  //   }
  // }, [roundDetails?.message?.data?.createdAt]);

  // useEffect(() => {
  //   if (roundDetails?.message?.data?.roundStatus === 'resultdeclare' && roundDetails?.message?.data?.roundResult) {
  //     setwinnerModal(true);
  //   }
  // }, [roundDetails?.message?.data?.roundStatus]);

  // useEffect(() => {
  //   if (countdown < 0 && roundDetails?.message?.data?.roundStatus === 'roundend') {
  //     setCoins([]);
  //     setUserBet(0);
  //     setCurrentBet(0);
  //   }
  // }, [countdown, roundDetails?.message?.data?.roundStatus]);

  // useEffect(() => {
  //   if (countdown == 45 && roundDetails?.message?.data?.roundStatus === 'roundStarted') {
  //     toast.success('Round Started');
  //   }
  //   localStorage.setItem('roundstatus', roundDetails?.message?.data?.roundStatus);
  // }, [countdown, roundDetails?.message?.data?.roundStatus]);

  // const { mutate: verifyPassword, isPending } = useMutation({
  //   mutationFn: verifyRoomPassword,
  //   onSuccess: (data) => {
  //     setVerifiedPassword(true);
  //   },
  //   onError: (error: AxiosError) => {
  //     let message = 'Something went wrong!';
  //     if (error?.response?.data?.message) {
  //       message = error.response.data?.message;
  //     }
  //     toast.error(message);
  //     navigate({
  //       to: '/room',
  //     });
  //   },
  // });

  // const ConfirmBet = () => {
  //   if (userDetails?.user?.balance < currentBet) {
  //     toast.error('Insufficient balance');
  //   } else {
  //     placeBet({
  //       roundId: roundDetails?.message?.data?._id,
  //       userId: userId,
  //       betAmount: currentBet,
  //       betType: getBetTypeBySelectionCard(selectedCard),
  //     });

  //     setUserBet((prev) => prev + currentBet);
  //     const updatedBalance = userDetails?.user?.balance - currentBet;
  //     const body = { balance: updatedBalance };
  //     updateUserbalance({
  //       userId,
  //       body,
  //     });
  //   }
  // };

  // useEffect(() => {
  //   if (countdown > 0) {
  //     const timer = setInterval(() => {
  //       setCountdown((prevCountdown) => prevCountdown - 1);
  //     }, 1000);
  //     return () => clearInterval(timer);
  //   }
  // }, [countdown]);

  // const addNewCoin = (cardId: number | undefined, amount: number) => {
  //   const newCoinId = coinId.current++;
  //   const newCoin = { id: newCoinId, cardId, amount: amount };

  //   setCoins((prevCoins) => [...prevCoins, newCoin]);

  //   setTimeout(() => {
  //     const newCoinElement = document.getElementById(`coin-${newCoinId}`);
  //     const cardElement = document.getElementById(`card-${cardId}`);
  //     const cardWidth = cardElement?.offsetWidth || 150;
  //     const cardHeight = cardElement?.offsetHeight || 200; // Get the height of the card
  //     const randomX = Math.random() * (cardWidth - 150); // Ensure coin stays within bounds of the card

  //     gsap.fromTo(
  //       newCoinElement,
  //       { y: cardHeight + 50, x: cardWidth, opacity: 0, rotation: 0 }, // Start from bottom right
  //       { y: 470, x: randomX, opacity: 1, rotation: 360, duration: 1, ease: 'power2.out' },
  //     );
  //   }, 0);
  // };

  // const countDownStatus = useMemo(() => {
  //   if (countdown <= 25 && countdown > 0) {
  //     return 'BET';
  //   }

  //   return 'BET_LOCK';
  // }, [countdown]);

  // const countDownSPOStatus = useMemo(() => {
  //   if (countdown <= 40 && countdown > 0) {
  //     return 'BET_SPO';
  //   }

  //   return 'BET_SPO_LOCK';
  // }, [countdown]);

  // useEffect(() => {
  //   if (roundDetails?.message?.data?.roundResult && roundDetails?.message?.data?.roundStatus === 'roundend') {
  //     console.log('roundDetails?.message?.data?.roundResult', roundDetails?.message?.data?.roundResult);
  //     const cardElement = document.getElementById(
  //       `card-${getBetTypeByCardName(roundDetails?.message?.data?.roundResult)}`,
  //     );
  //     const spocardElement = document.getElementById(
  //       `card-${getBetTypeByCardName(roundDetails?.message?.data?.roundResult)}`,
  //     );
  //     spocardElement?.classList.add('glow');
  //     cardElement?.classList.add('glow');
  //   } else if (roundDetails?.message?.data?.roundStatus === 'resultdeclare') {
  //     resetBet();
  //     const cardElement = document.getElementById(
  //       `card-${getBetTypeByCardName(roundDetails?.message?.data?.roundResult)}`,
  //     );
  //     const spocardElement = document.getElementById(
  //       `card-${getBetTypeByCardName(roundDetails?.message?.data?.roundResult)}`,
  //     );
  //     spocardElement?.classList.remove('glow');
  //     cardElement?.classList.remove('glow');
  //   }
  // }, [roundDetails?.message?.data]);

  // const { isLoading, data: roomDetails } = useQuery({
  //   queryKey: [GET_ROOMS_DETAILS],
  //   queryFn: async () => getRoomDetailService(roomId || ''),
  //   refetchInterval: 3000,
  //   refetchIntervalInBackground: true,
  // });

  // const { mutate: placeBet } = useMutation({
  //   mutationFn: placeBetService,
  // });

  // const { mutate: distributeamount } = useMutation({
  //   mutationFn: distributeBalance,
  // });

  // const { mutate: updateUserbalance } = useMutation({
  //   mutationFn: updateUser,
  // });

  // const { mutate: updateRoundStatus } = useMutation({
  //   mutationFn: updateRound,
  // });

  // const resetBet = () => {
  //   const cardElement = document.getElementById(`card-${selectedCard}`);
  //   const spocardElement = document.getElementById(`card-${selectedCard}`);
  //   cardElement?.classList.remove('glow');
  //   spocardElement?.classList.remove('glow');
  //   setCoins([]);
  //   setCurrentBet(0);
  //   setCurrentSelectedAmount(0);
  //   setUserBet(0);
  //   localStorage.removeItem('roundstatus');
  // };

  // const handleSelection = ({ card, type }: { card: number; type: string }) => {
  //   if (countDownSPOStatus === 'BET_SPO' && (card === 6 || card === 4 || card === 5 || card === 2)) {
  //     const cardElement = document.getElementById(`card-${card}`);
  //     cardElement?.classList.add('glow');
  //     setSelectedCard(card);
  //     if (selectedCard !== card && type === 'SPO') {
  //       const cardElement = document.getElementById(`card-${card}`);
  //       const previousCardElement = document.getElementById(`card-${selectedCard}`);
  //       cardElement?.classList.add('glow');
  //       previousCardElement?.classList.remove('glow');
  //     }
  //   }

  //   if (
  //     // countDownStatus === 'BET' &&
  //     card === 1 ||
  //     card === 3 ||
  //     card === 7 ||
  //     card === 8 ||
  //     card === 9 ||
  //     card === 10
  //   ) {
  //     if (selectedCard !== card && type === 'NON_SPO') {
  //       const cardElement = document.getElementById(`card-${card}`);
  //       const previousCardElement = document.getElementById(`card-${selectedCard}`);
  //       cardElement?.classList.add('glow');
  //       previousCardElement?.classList.remove('glow');
  //     }
  //     setSelectedCard(card);
  //   }
  // };
  // const makeDealer = useMutation({
  //   mutationFn: updateRoom,
  // });
  // const handleMakeSpo = () => {
  //   const players = roomDetails.players;
  //   const requestedPlayer = players.find((player: { _id: string }) => player._id === userId);

  //   const spoRequested = [...roomDetails.SpoRequested];
  //   spoRequested.push(requestedPlayer._id);

  //   makeDealer.mutate({ id: roomDetails._id, game: { SpoRequested: spoRequested } });
  // };

  // const handleRoomVerification = (data: z.infer<typeof RoomVerfication>) => {
  //   if (roomId) {
  //     verifyPassword({ roomId: roomId, payload: data });
  //   }
  // };

  // useEffect(() => {
  //   if (!isLoading) {
  //     if (roomDetails) {
  //       setVerifiedPassword(roomDetails?.roomType === 'private');
  //       setMeetingId(roomDetails?.dealerLiveStreamId);
  //       setAuthToken(roomDetails?.streamingToken);
  //       setCameraId(roomDetails?.cameraLiveStreamId);
  //     }
  //   }
  // }, [roomDetails, isLoading]);

  // if (isLoading) {
  //   return <div>Loading...</div>;
  // }

  // return (
  //   <div className="flex flex-col h-full bg-[#040816] bg-center">
  //     <Navbar roomId={roomId} />
  //     {!verifiedPassword && (
  //       <Dialog open={!verifiedPassword}>
  //         <DialogContent>
  //           <DialogTitle>Join room</DialogTitle>
  //           <div>
  //             <Form {...form}>
  //               <form onSubmit={form.handleSubmit(handleRoomVerification)} className="flex flex-col gap-2">
  //                 <FormField
  //                   control={form.control}
  //                   name="password"
  //                   render={({ field }) => (
  //                     <FormItem className="relative">
  //                       <FormLabel>Room name</FormLabel>
  //                       <FormControl>
  //                         <Input placeholder="Enter room password" type="password" {...field} />
  //                       </FormControl>
  //                       <FormMessage className="text-xs" />
  //                     </FormItem>
  //                   )}
  //                 />
  //                 <Button type="submit" disabled={isPending}>
  //                   {isPending ? (
  //                     <div className="flex items-center">
  //                       <Loader2 className="w-4 h-4 mr-1 animate-spin" /> Please wait
  //                     </div>
  //                   ) : (
  //                     <>Submit</>
  //                   )}
  //                 </Button>
  //               </form>
  //             </Form>
  //           </div>
  //         </DialogContent>
  //       </Dialog>
  //     )}
  //     <div className="flex flex-row w-full">
  //       <div className="flex-col w-3/12">
  //         <div className="flex justify-between mx-6 my-6 w-full ">
  //           <div className="flex justify-between flex-col bg-[#D9D9D9] customBorder border-x-4 border-y-4  w-32">
  //             <div className="flex justify-around border-custom-gradient w-full py-2">
  //               <Hint content="Info">
  //                 <Button size={'icon'} className="w-10 h-10" variant={'ghost'}>
  //                   <img src="/Info.svg" className="w-10 h-10" />
  //                 </Button>
  //               </Hint>
  //               <Hint content="Signal">
  //                 <Button size={'icon'} className="w-10 h-10" variant={'ghost'}>
  //                   <img src="/Signal.svg" className="w-10 h-10" />
  //                 </Button>
  //               </Hint>
  //             </div>
  //             <div className="flex justify-around border-custom-gradient w-full py-2">
  //               <Hint content="Chat">
  //                 <Button size={'icon'} className="w-10 h-10" variant={'ghost'}>
  //                   <img src="/chat.svg" className="w-10 h-10" />
  //                 </Button>
  //               </Hint>
  //               <Hint content="Tip">
  //                 <Button size={'icon'} className="w-10 h-10" variant={'ghost'}>
  //                   <img src="/tip.svg" className="w-10 h-10" />
  //                 </Button>
  //               </Hint>
  //             </div>
  //           </div>
  //           <div className="flex justify-between items-center py-2 flex-col bg-[#D9D9D9] customBorder border-x-4 border-y-4  w-32">
  //             <div className="w-20 py-4 h-20 flex items-center flex-col justify-center bg-[#040816] text-background border-2 rounded-full text-3xl font-medium font-mono">
  //               {countdown && roundDetails?.message?.data?.roundStatus === 'roundStarted' && (
  //                 <span className="text-sm font-semibold">{countdown}</span>
  //               )}
  //             </div>
  //             <div>
  //               <span className="text-sm font-semibold text-[#040816] uppercase">Start Betting</span>
  //             </div>
  //           </div>
  //         </div>
  //         <div className="flex  flex-col mx-14 ">
  //           <div className=" text-white relative ">
  //             <CircleDollarSign size={20} className="text-black absolute top-1 left-1 " />
  //             <p className="text-black text-sm absolute left-6 top-1 px-0.5">Bet</p>
  //             <Input
  //               placeholder=""
  //               className="w-42 rounded-sm px-6 h-7  border-10 customBorderInput text-black text-right"
  //               value={userBet}
  //             />
  //           </div>
  //           <div className=" text-white relative my-4">
  //             <CircleDollarSign size={20} className="text-black absolute  top-1 left-1 " />
  //             <p className="text-black text-sm absolute left-6 top-1 px-0.5">Win</p>
  //             <Input
  //               placeholder=""
  //               className="w-42 rounded-sm px-6 h-7 border-10 customBorderInput text-black text-right"
  //             />
  //           </div>
  //         </div>
  //       </div>
  //       <div className="relative w-[45%] mx-8 h-full my-2">
  //         <div className="w-full border cameraCustomBorder h-[22rem] text-white">
  //           {meetingId !== '' && <ViewerScreenContainer meetingId={meetingId} authToken={authToken} />}
  //         </div>

  //         <div className="border cameraCustomBorder h-1/3 width-1/3 text-white absolute left-0 top-0 mx-2 my-2">
  //           {cameraId !== '' && <ViewerScreenContainer meetingId={cameraId} authToken={authToken} />}
  //         </div>
  //       </div>
  //       <div className="h-40 flex flex-col w-[28%] justify-between">
  //         <div className="h-20">
  //           <h5 className="text-white">History</h5>
  //           <div>History</div>
  //         </div>
  //         <div className="flex justify-between items-center py-2 flex-col bg-[#D9D9D9] customBorder border-x-4 border-y-4  w-32">
  //           <div className="w-20 py-4 h-20 flex items-center flex-col justify-center bg-[#040816] text-background border-2 rounded-full text-3xl font-medium font-mono">
  //             <img src="/maleuser.png" className="w-20 h-20" />
  //           </div>
  //           <div>
  //             <span className="text-sm font-semibold text-[#040816] uppercase">
  //               SPO - {roomDetails?.SpoAccepted?.telegramusername}
  //             </span>
  //           </div>
  //         </div>
  //       </div>
  //     </div>
  //     <div className="w-full flex justify-between flex-row ">
  //       <div className="w-[25%] px-4 flex flex-col justify-end items-end my-20">
  //         <div
  //           id="card-8"
  //           className={cn(
  //             'w-full ml-4 flex justify-center items-center  h-1/3 width-1/3 text-white text-center even-container relative',
  //             countDownStatus === 'BET_LOCK' ? 'h-20 cursor-not-allowed' : '',
  //             selectedCard === 8 ? 'glow' : '',
  //           )}
  //           onClick={() =>
  //             handleSelection({
  //               card: 8,
  //               type: 'NON_SPO',
  //             })
  //           }
  //         >
  //           {selectedCard === 8 &&
  //             coins.map((coin) => <img src="/coin2.svg" key={coin.id} id={`coin-${coin.id}`} className="coin" />)}
  //           <p className="absolute top-[0%] right-2 font-bold text-xl">
  //             ${' '}
  //             {roundDetails?.message?.totalBetAmounts[getBetTypeBySelectionCard(8)]
  //               ? roundDetails?.message?.totalBetAmounts[getBetTypeBySelectionCard(8)]
  //               : 0}
  //           </p>
  //           <p className="text-2xl">Even 10:9</p>
  //         </div>
  //         <div
  //           id="card-7"
  //           className={cn(
  //             'w-full ml-4 flex my-5 justify-center items-center  h-1/3 width-1/3 text-white text-center even-container relative',
  //             countDownStatus === 'BET_LOCK' ? 'h-20 cursor-not-allowed' : '',
  //             selectedCard === 7 ? 'glow' : '',
  //           )}
  //           onClick={() =>
  //             handleSelection({
  //               card: 7,
  //               type: 'NON_SPO',
  //             })
  //           }
  //         >
  //           {selectedCard === 7 &&
  //             coins.map((coin) => <img src="/coin2.svg" key={coin.id} id={`coin-${coin.id}`} className="coin" />)}
  //           <p className="absolute top-[0%] right-2 font-bold text-xl">
  //             $
  //             {roundDetails?.message?.totalBetAmounts[getBetTypeBySelectionCard(7)]
  //               ? roundDetails?.message?.totalBetAmounts[getBetTypeBySelectionCard(7)]
  //               : 0}
  //           </p>
  //           <p className="text-2xl">Even 9:10</p>
  //         </div>
  //       </div>
  //       <div className="w-[45%]">
  //         <div className="flex flex-col">
  //           <div className="flex flex-row mx-2">
  //             <div
  //               id="card-1"
  //               className={cn(
  //                 'w-full mx-2 flex justify-center items-center  h-1/3 text-white text-center even-container relative',
  //                 countDownStatus === 'BET_LOCK' ? 'h-32 cursor-not-allowed' : 'h-32 cursor-pointer',
  //                 selectedCard === 1 ? 'glow' : '',
  //               )}
  //               onClick={() =>
  //                 handleSelection({
  //                   card: 1,
  //                   type: 'NON_SPO',
  //                 })
  //               }
  //             >
  //               {selectedCard === 1 &&
  //                 coins.map((coin) => (
  //                   <img src="/coin2.svg" key={coin.id} id={`coin-${coin.id}`} className="coin" />
  //                   // <div

  //                   //   className="flex justify-center items-center coin gradient-gold text-[10px]"
  //                   // >
  //                   //   <img src="/coin.svg" />
  //                   // </div>
  //                 ))}
  //               <p className="absolute top-[0%] left-2 font-bold text-xl">
  //                 ${' '}
  //                 {roundDetails?.message?.totalBetAmounts[getBetTypeBySelectionCard(1)]
  //                   ? roundDetails?.message?.totalBetAmounts[getBetTypeBySelectionCard(1)]
  //                   : 0}
  //               </p>
  //               <p className="text-2xl">Even</p>
  //             </div>
  //             <div
  //               id="card-3"
  //               className={cn(
  //                 'w-full h-20 mx-2 flex justify-center items-center  h-1/3 width-1/3 text-white text-center odd-container relative',
  //                 countDownStatus === 'BET_LOCK' ? 'h-32 cursor-not-allowed' : 'h-32 cursor-pointer',
  //                 selectedCard === 3 ? 'glow' : '',
  //               )}
  //               onClick={() =>
  //                 handleSelection({
  //                   card: 3,
  //                   type: 'NON_SPO',
  //                 })
  //               }
  //             >
  //               {selectedCard === 3 &&
  //                 coins.map((coin) => <img src="/coin2.svg" key={coin.id} id={`coin-${coin.id}`} className="coin" />)}
  //               <p className="absolute top-[0%] left-2 font-bold text-xl">
  //                 ${' '}
  //                 {roundDetails?.message?.totalBetAmounts[getBetTypeBySelectionCard(3)]
  //                   ? roundDetails?.message?.totalBetAmounts[getBetTypeBySelectionCard(3)]
  //                   : 0}
  //               </p>
  //               <p className="text-2xl">Odd</p>
  //             </div>
  //           </div>
  //           <div className="flex flex-col mx-2">
  //             <div className="flex flex-row mx-2">
  //               <div
  //                 id="card-2"
  //                 onClick={() =>
  //                   handleSelection({
  //                     card: 2,
  //                     type: 'SPO',
  //                   })
  //                 }
  //                 className={cn(
  //                   'w-full  mx-2 h-[8rem] width-1/3 bg-blend-overlay text-white sepecial-bet-container my-2 relative',
  //                   countDownSPOStatus === 'BET_SPO_LOCK' ? ' cursor-not-allowed' : '',
  //                   selectedCard === 2 ? 'glow' : '',
  //                 )}
  //               >
  //                 {selectedCard === 2 &&
  //                   coins.map((coin) => <img src="/coin2.svg" key={coin.id} id={`coin-${coin.id}`} className="coin" />)}
  //                 <p className="text-sm font-bold px-1 py-1"> 4 White</p>
  //                 <p className="absolute top-[0%] right-2 font-bold text-xl">
  //                   ${' '}
  //                   {roundDetails?.message?.totalBetAmounts[getBetTypeBySelectionCard(2)]
  //                     ? roundDetails?.message?.totalBetAmounts[getBetTypeBySelectionCard(2)]
  //                     : 0}
  //                 </p>
  //                 <div className="flex justify-around py-14">
  //                   <WhiteCircle />
  //                   <WhiteCircle />
  //                   <WhiteCircle />
  //                   <WhiteCircle />
  //                 </div>
  //               </div>
  //               <div
  //                 id="card-5"
  //                 onClick={() =>
  //                   handleSelection({
  //                     card: 5,
  //                     type: 'SPO',
  //                   })
  //                 }
  //                 className={cn(
  //                   'w-full  mx-2 h-[8rem] width-1/3 bg-blend-overlay text-white sepecial-bet-container my-2 relative',
  //                   countDownSPOStatus === 'BET_SPO_LOCK' ? ' cursor-not-allowed' : '',
  //                   selectedCard === 5 ? 'glow' : '',
  //                 )}
  //               >
  //                 {selectedCard === 5 &&
  //                   coins.map((coin) => <img src="/coin2.svg" key={coin.id} id={`coin-${coin.id}`} className="coin" />)}
  //                 <p className="absolute top-[0%] right-2 font-bold text-xl">
  //                   $
  //                   {roundDetails?.message?.totalBetAmounts[getBetTypeBySelectionCard(5)]
  //                     ? roundDetails?.message?.totalBetAmounts[getBetTypeBySelectionCard(5)]
  //                     : 0}
  //                 </p>
  //                 <p className="text-sm font-bold px-1 py-1"> 4 Red</p>
  //                 <div className="flex justify-around py-14">
  //                   <RedCircle />
  //                   <RedCircle />
  //                   <RedCircle />
  //                   <RedCircle />
  //                 </div>
  //               </div>
  //             </div>
  //             <div className="flex flex-row mx-2">
  //               <div
  //                 id="card-6"
  //                 className={cn(
  //                   'w-full  mx-2 h-[8rem] width-1/3 bg-blend-overlay text-white sepecial-bet-container my-2 relative',
  //                   countDownSPOStatus === 'BET_SPO_LOCK' ? ' cursor-not-allowed' : '',
  //                   selectedCard === 6 ? 'glow' : '',
  //                 )}
  //                 onClick={() =>
  //                   handleSelection({
  //                     card: 6,
  //                     type: 'SPO',
  //                   })
  //                 }
  //               >
  //                 {selectedCard === 6 &&
  //                   coins.map((coin) => <img src="/coin2.svg" key={coin.id} id={`coin-${coin.id}`} className="coin" />)}
  //                 <p className="absolute top-[0%] right-2 font-bold text-xl">
  //                   ${' '}
  //                   {roundDetails?.message?.totalBetAmounts[getBetTypeBySelectionCard(6)]
  //                     ? roundDetails?.message?.totalBetAmounts[getBetTypeBySelectionCard(6)]
  //                     : 0}
  //                 </p>
  //                 <p className="text-sm font-bold px-1 py-1"> 3 White 1 Red</p>
  //                 <div className="flex justify-around py-14">
  //                   <WhiteCircle />
  //                   <WhiteCircle />
  //                   <WhiteCircle />
  //                   <RedCircle />
  //                 </div>
  //               </div>
  //               <div
  //                 id="card-4"
  //                 className={cn(
  //                   'w-full  mx-2 h-[8rem] width-1/3 bg-blend-overlay text-white sepecial-bet-container my-2 relative',
  //                   countDownSPOStatus === 'BET_SPO_LOCK' ? ' cursor-not-allowed' : '',
  //                   selectedCard === 4 ? 'glow' : '',
  //                 )}
  //                 onClick={() =>
  //                   handleSelection({
  //                     card: 4,
  //                     type: 'SPO',
  //                   })
  //                 }
  //               >
  //                 {selectedCard === 4 &&
  //                   coins.map((coin) => <img src="/coin2.svg" key={coin.id} id={`coin-${coin.id}`} className="coin" />)}
  //                 <p className="absolute top-[0%] right-2 font-bold text-xl">
  //                   ${' '}
  //                   {roundDetails?.message?.totalBetAmounts[getBetTypeBySelectionCard(4)]
  //                     ? roundDetails?.message?.totalBetAmounts[getBetTypeBySelectionCard(4)]
  //                     : 0}
  //                 </p>
  //                 <p className="text-sm font-bold px-1 py-1"> 1 White 3 Red</p>
  //                 <div className="flex justify-around py-14">
  //                   <WhiteCircle />
  //                   <RedCircle />
  //                   <RedCircle />
  //                   <RedCircle />
  //                 </div>
  //               </div>
  //             </div>
  //           </div>
  //         </div>
  //       </div>
  //       <div className="w-[25%] px-4 flex-col flex justify-end items-end my-20">
  //         <div
  //           id="card-10"
  //           className={cn(
  //             'w-full mx-4 flex justify-center items-center  h-1/3 width-1/3 text-white text-center odd-container relative',
  //             countDownStatus === 'BET_LOCK' ? ' cursor-not-allowed' : '',
  //             selectedCard === 10 ? 'glow' : '',
  //           )}
  //           onClick={() =>
  //             handleSelection({
  //               card: 10,
  //               type: 'NON_SPO',
  //             })
  //           }
  //         >
  //           {selectedCard === 9 &&
  //             coins.map((coin) => <img src="/coin2.svg" key={coin.id} id={`coin-${coin.id}`} className="coin" />)}
  //           <p className="absolute top-[0%] right-2 font-bold text-xl">
  //             ${' '}
  //             {roundDetails?.message?.totalBetAmounts[getBetTypeBySelectionCard(10)]
  //               ? roundDetails?.message?.totalBetAmounts[getBetTypeBySelectionCard(10)]
  //               : 0}
  //           </p>
  //           <p className="text-2xl">Odd 10:9</p>
  //         </div>{' '}
  //         <div
  //           id="card-9"
  //           className={cn(
  //             'w-full mx-4 flex my-4 justify-center items-center  h-1/3 width-1/3 text-white text-center odd-container relative',
  //             countDownStatus === 'BET_LOCK' ? ' cursor-not-allowed' : '',
  //             selectedCard === 9 ? 'glow' : '',
  //           )}
  //           onClick={() =>
  //             handleSelection({
  //               card: 9,
  //               type: 'NON_SPO',
  //             })
  //           }
  //         >
  //           {selectedCard === 9 &&
  //             coins.map((coin) => <img src="/coin2.svg" key={coin.id} id={`coin-${coin.id}`} className="coin" />)}
  //           <p className="absolute top-[0%] right-2 font-bold text-xl">
  //             ${' '}
  //             {roundDetails?.message?.totalBetAmounts[getBetTypeBySelectionCard(9)]
  //               ? roundDetails?.message?.totalBetAmounts[getBetTypeBySelectionCard(9)]
  //               : 0}
  //           </p>
  //           <p className="text-2xl">Odd 9:10</p>
  //         </div>
  //       </div>
  //     </div>
  //     <div className="w-full px-2 py-2 h-14 bg-[#D9D9D9] flex justify-between">
  //       <div>
  //         <div className=" text-white relative">
  //           <CircleDollarSign size={20} className="text-black absolute  top-1 left-1 " />
  //           <p className="text-black text-sm absolute left-6 top-1 px-0.5">Bal</p>
  //           <Input
  //             placeholder=""
  //             className="w-[14rem] rounded-sm px-6 h-7 border-10 customBorderInput text-black px-12"
  //             disabled
  //             value={`${userDetails?.user?.balance} vUsd`}
  //           />
  //         </div>
  //       </div>
  //       <div className="flex items-center justify-around w-96 bg-background rounded shadow-sm h-15">
  //         <CoinChips
  //           className="hover:animate-bounce hover:transition-all"
  //           amount={500}
  //           handleCoin={() => {
  //             addNewCoin(selectedCard, 500000);
  //             setCurrentSelectedAmount(500000);
  //             setCurrentBet((prevBet) => prevBet + 500000);

  //             ConfirmBet();
  //           }}
  //         />
  //         <CoinChips
  //           className="hover:animate-bounce hover:transition-all"
  //           amount={1000}
  //           handleCoin={() => {
  //             addNewCoin(selectedCard, 1000000);
  //             setCurrentSelectedAmount(1000000);
  //             setCurrentBet((prevBet) => prevBet + 1000000);
  //             ConfirmBet();
  //           }}
  //         />
  //         <CoinChips
  //           className="hover:animate-bounce hover:transition-all"
  //           amount={2000}
  //           handleCoin={() => {
  //             addNewCoin(selectedCard, 2000000);
  //             setCurrentSelectedAmount(2000000);
  //             setCurrentBet((prevBet) => prevBet + 2000000);
  //             ConfirmBet();
  //           }}
  //         />
  //         <CoinChips
  //           className="hover:animate-bounce hover:transition-all"
  //           amount={5000}
  //           handleCoin={() => {
  //             addNewCoin(selectedCard, 5000000);
  //             setCurrentSelectedAmount(5000000);
  //             setCurrentBet((prevBet) => prevBet + 5000000);
  //             ConfirmBet();
  //           }}
  //         />
  //       </div>
  //       <div className="px-4 pl-4">
  //         <DepositDiaglog roomId={roomId}>
  //           <Button size={'lg'} variant={'destructive'}>
  //             Deposit
  //           </Button>
  //         </DepositDiaglog>
  //         <Button
  //           size={'lg'}
  //           variant={'default'}
  //           className="mx-2"
  //           onClick={() => (roomOwner ? distributeamount({ roomId }) : handleMakeSpo())}
  //         >
  //           {roomOwner === true ? 'Distrubute Coins' : 'Request for SPO'}
  //         </Button>
  //         {/* <Button size={'lg'} variant={'default'} className="mx-2" onClick={() => ConfirmBet()}>
  //           Confirm Bet
  //         </Button> */}
  //         <Button
  //           size={'lg'}
  //           variant={'default'}
  //           className="mx-2"
  //           disabled={countDownStatus === 'BET_LOCK' || countDownSPOStatus === 'BET_SPO_LOCK'}
  //           onClick={() => resetBet()}
  //         >
  //           Rebet
  //         </Button>
  //       </div>
  //     </div>
  //     {winnermodal && roomOwner && (
  //       <>
  //         <WinnersModal
  //           open={winnermodal}
  //           onClose={() => {
  //             setwinnerModal(false);
  //             resetBet();
  //             updateRoundStatus({ roundId: roundDetails?.message?.data?._id, round: { roundStatus: 'completed' } });
  //           }}
  //           winners={roundDetails?.message?.data?.winners}
  //         />
  //       </>
  //     )}
  //   </div>
  // );
  const { unityProvider } = useUnityContext({
    loaderUrl: '/Build/Gameplay.loader.js',
    dataUrl: '/Build/Gameplay.data',
    frameworkUrl: '/Build/Gameplay.framework.js',
    codeUrl: '/Build/Gameplay.wasm',
  });

  return (
    <div
      style={{
        width: '100%',
      }}
      className="bg-[#000] bg-no-repeat bg-cover flex justify-center items-center"
    >
      <Unity unityProvider={unityProvider} style={{ width: 1176, height: 700 }} devicePixelRatio={devicePixelRatio} />
    </div>
  );
};

const CoinChips = ({
  amount,
  className,
  handleCoin,
}: {
  amount: number;
  className?: string;
  handleCoin?: () => void;
}) => {
  return (
    <Hint content={`${amount} k`}>
      <div className={cn('w-10 h-10 relative', className)} onClick={handleCoin}>
        <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[56%] text-[.5rem] font-semibold font-mono">
          {amount}K
        </span>
        <img src="/chip-3.png" className="w-full h-full" />
      </div>
    </Hint>
  );
};

const WinnersModal = ({ winners, open, onClose }: { open: boolean; winners: any[]; onClose: () => void }) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <ConfettiExplosion force={0.8} duration={3000} particleCount={1500} width={1600} height={1000} />
        <DialogHeader>
          <DialogTitle className="flex items-center ">
            <TrophyIcon size={30} className="px-1" /> Winners of this Round
          </DialogTitle>
        </DialogHeader>
        {/* <div className="flex flex-col"> */}
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Player</TableCell>
              <TableCell>Amount</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {winners?.map((winner) => (
              <TableRow key={winner._id}>
                <TableCell>{winner.userId.telegramusername}</TableCell>
                <TableCell>{winner.winnings}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {/* </div> */}
      </DialogContent>
    </Dialog>
  );
};
export const Route = createLazyFileRoute('/play/$roomId')({
  component: GameComponent,
});
