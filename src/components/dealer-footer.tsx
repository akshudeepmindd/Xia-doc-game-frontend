import { Camera, CameraOff, Mic, MicOff, PlaySquare, Settings } from 'lucide-react';
import { Button } from './ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import useProfile from '@/hooks/useProfile';
import { useMutation } from '@tanstack/react-query';
import { createDealerLive } from '@/services/room';
import { addRound, updateRound } from '@/services/round';
import { useEffect } from 'react';

const config: any = {
  layout: {
    type: 'SPOTLIGHT',
    priority: 'SPEAKER',
    gridSize: 4,
  },
  theme: 'DARK',
  mode: 'video-and-audio',
  quality: 'high',
};

const DealerFooter = ({
  setStartLive,
  startLive,
  handleStream,
  roomId,
  round,
  selectResult,
  resultDeclare,
  roundStatus,
  countdown,
  rtmpsUrl,
  playbackurl,
  streamkey,
  setSelectResult,
  setCountDown,
}: {
  setStartLive: (startLive: boolean) => void;
  handleStream: () => void;
  startLive: boolean;
  rtmpsUrl: string;
  playbackurl: string;
  streamkey: string;
  roomId: string;
  round: any;
  selectResult: string | undefined;
  resultDeclare: any;
  roundStatus: 'inprogress' | 'completed' | 'roundend';
  countdown: number;
  setCountDown: (countdown: number) => void;
  setSelectResult: (selectResult: string) => void;
}) => {
  const { username } = useProfile();
  // const { startHls, stopHls, toggleWebcam, hlsState } = useMeeting();

  useEffect(() => {
    // console.log('useMeeting properties:', { startHls, stopHls, toggleWebcam, hlsState });
  }, []);

  const isLive = true;
  const isMuted = true;
  const isCameraOn = true;

  const createRound = useMutation({
    mutationFn: addRound,
  });

  const updateRoundStatus = useMutation({
    mutationFn: updateRound,
  });

  const handleRoundStart = () => {
    let roundId = 1;
    if (round && round?.roundNumber) {
      roundId += round.roundNumber;
    }
    setSelectResult('');
    return createRound.mutate({ roomId, round: { roundNumber: roundId, gameroom: roomId } });
  };

  const handleUpdateRoundStatus = () => {
    const roundId = round?.data?._id;
    setSelectResult('');

    return updateRoundStatus.mutate({ roundId, round: { roundStatus: 'roundend' } });
  };

  // const progressLive = useMutation({
  //   mutationFn: createDealerLive,
  //   onSuccess: (data) => {
  //     setMeetingId(data.message.roomId);
  //     setAuthToken(data.message.token);
  //     setStartLive(true);
  //     console.log('Dealer live created, meeting ID:', data.message.roomId);
  //   },
  // });

  const handleLive = async () => {
    try {
      if (!startLive && rtmpsUrl == '' && playbackurl == '' && streamkey == '') {
        handleStream();
        console.log('HLS started');
      } else if (startLive) {
        console.log('HLS stopped');
        setStartLive(false);
      } else {
        handleStream();
        setStartLive(true);
      }
    } catch (error) {
      console.error('Error handling live state:', error);
    }
  };

  // useEffect(() => {
  //   // console.log('HLS state changed:', hlsState);
  // }, [hlsState]);

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
        <Button variant="outline" size="sm" onClick={() => handleLive()}>
          <PlaySquare className="w-4 h-4 mr-1" />
          {startLive ? 'Stop live' : 'Start live'}
        </Button>
      </div>
      {selectResult && countdown <= 0 && roundStatus === 'roundend' && (
        <Button variant="outline" size="sm" onClick={() => resultDeclare(selectResult)}>
          Result declare
        </Button>
      )}
      <div className="flex items-center gap-x-2">
        <span className="font-medium text-sm text-background mr-2">
          <span className="font-normal mr-2">Dealer :</span>
          {username}
        </span>
        <Button variant="outline" size="sm" onClick={handleRoundStart}>
          Start round
        </Button>
        <Button variant="outline" size="sm" onClick={handleUpdateRoundStatus}>
          End round
        </Button>
      </div>
    </footer>
  );
};

export default DealerFooter;
