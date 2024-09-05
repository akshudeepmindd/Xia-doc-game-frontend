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
  const { unityProvider } = useUnityContext({
    loaderUrl: '/Build/Gameplay.loader.js',
    dataUrl: '/Build/Gameplay.data',
    frameworkUrl: '/Build/Gameplay.framework.js',
    codeUrl: '/Build/Gameplay.wasm',
  });

  const containerRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: window.innerWidth, height: window.innerHeight });

  useEffect(() => {
    const handleResize = () => {
      setSize({ width: window.innerWidth, height: window.innerHeight });
    };

    handleResize(); // Set initial size
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Update size based on orientation
  const isMobile = window.innerWidth <= 768;
  const isLandscape = window.innerWidth > window.innerHeight;

  const unityWidth = isMobile && !isLandscape ? size.height : size.width;
  const unityHeight = isMobile && !isLandscape ? size.width : size.height;

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
      className="bg-[#000] bg-no-repeat bg-cover"
    >
      {!isLandscape && isMobile && (
        <div className="landscape-warning">Please rotate your device to landscape mode.</div>
      )}
      <Unity
        unityProvider={unityProvider}
        style={{ width: unityWidth, height: unityHeight }}
        devicePixelRatio={window.devicePixelRatio}
      />
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
