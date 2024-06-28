import { Camera, CameraOff, Mic, MicOff, PlaySquare, Settings } from 'lucide-react';
import { Button } from './ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import useProfile from '@/hooks/useProfile';
import { socket } from '@/services';
import { SOCKET_ROUND_START } from '@/lib/constants';

interface DealerFooterProps {
  roomId: string;
  round: any;
}

const DealerFooter = ({ roomId, round }: DealerFooterProps) => {
  const { username } = useProfile();

  const isLive = true;
  const isMuted = true;
  const isCameraOn = true;

  const handleRoundStart = () => {
    let roundId = 1;
    if (round) {
      roundId += round.roundNumber;
    }
    return socket.emit(SOCKET_ROUND_START, { roomId, round: { roundNumber: roundId, gameroom: roomId } });
  };

  return (
    <footer className="flex-1 bg-primary flex items-center justify-between px-8">
      <div className="flex items-center gap-x-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4 mr-1" />
              Settings camera
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>
              {!isCameraOn ? <Camera className="w-4 h-4 mr-1" /> : <CameraOff className="w-4 h-4 mr-1" />}
              {!isCameraOn ? 'Turn on camera' : 'Turn off camera'}
            </DropdownMenuItem>
            <DropdownMenuItem>
              {!isMuted ? <Mic className="w-4 h-4 mr-1" /> : <MicOff className="w-4 h-4 mr-1" />}
              {!isMuted ? 'Turn on mic' : 'Turn off mic'}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Button variant="outline" size="sm">
          <PlaySquare className="w-4 h-4 mr-1" />
          {isLive ? 'Stop live' : 'Start live'}
        </Button>
      </div>

      <div className="flex items-center gap-x-2">
        <span className="font-medium text-sm text-background mr-2">
          <span className="font-normal mr-2">Dealer :</span>
          {username}
        </span>
        <Button variant="outline" size="sm" onClick={handleRoundStart}>
          Start round
        </Button>
        <Button variant="outline" size="sm">
          End round
        </Button>
      </div>
    </footer>
  );
};

export default DealerFooter;
