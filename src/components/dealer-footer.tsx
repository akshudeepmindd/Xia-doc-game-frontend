/* eslint-disable @typescript-eslint/no-explicit-any */
import { Camera, CameraOff, Mic, MicOff, PlaySquare, Settings } from 'lucide-react';
import { Button } from './ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import useProfile from '@/hooks/useProfile';
import { useMutation } from '@tanstack/react-query';
import { createDealerLive } from '@/services/room';
import { useParams } from '@tanstack/react-router';
import { useMeeting } from '@videosdk.live/react-sdk';
const config: any = {
  // Layout Configuration
  layout: {
    type: 'SPOTLIGHT', // "SPOTLIGHT" | "SIDEBAR",  Default : "GRID"
    priority: 'SPEAKER', // "PIN", Default : "SPEAKER"
    gridSize: 4, // MAX : 25
  },

  // Theme of livestream
  theme: 'DARK', //  "LIGHT" | "DEFAULT"

  // `mode` is used to either interactive livestream video & audio both or only audio.
  mode: 'video-and-audio', // "audio", Default : "video-and-audio"

  // Quality of livestream and is only applicable to `video-and-audio` type mode.
  quality: 'high', // "low" | "med",  Default : "med"

  // This mode refers to orientation of recording.
  // landscape : Livestream the meeting in horizontally
  // portrait : Livestream the meeting in vertically (Best for mobile view)
};
const DealerFooter = ({
  setMeetingId,
  setStartLive,
  setAuthToken,
  startLive,
  meetingId,
}: {
  setMeetingId: (meetingId: string) => void;
  setStartLive: (startLive: boolean) => void;
  setAuthToken: (authToken: string) => void;
  startLive: boolean;
  meetingId: string;
  authToken: string;
}) => {
  const { username } = useProfile();
  const { roomId } = useParams({ strict: false });
  const { startHls, stopHls, toggleWebcam } = useMeeting();
  const isLive = true;
  const isMuted = true;
  const isCameraOn = true;
  const progressLive = useMutation({
    mutationFn: createDealerLive,
    onSuccess: (data) => {
      setMeetingId(data.message.roomId);
      setAuthToken(data.message.token);
      setStartLive(true);
      // startHls(); // Commented out the startHls() function call
    },
  });
  const handleLive = () => {
    if (!startLive && meetingId == '') {
      progressLive.mutate({ roomId: roomId ?? '' });
    } else if (startLive) {
      setStartLive(false);
      stopHls();
    } else {
      setStartLive(true);
      startHls(config);
    }
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
            <DropdownMenuItem onClick={() => toggleWebcam()}>
              {!isCameraOn ? <Camera className="w-4 h-4 mr-1" /> : <CameraOff className="w-4 h-4 mr-1" />}
              {!isCameraOn ? 'Turn on camera' : 'Turn off camera'}
            </DropdownMenuItem>
            <DropdownMenuItem>
              {!isMuted ? <Mic className="w-4 h-4 mr-1" /> : <MicOff className="w-4 h-4 mr-1" />}
              {!isMuted ? 'Turn on mic' : 'Turn off mic'}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Button
          variant="outline"
          size="sm"
          onClick={() => (!startLive && meetingId == '' ? progressLive.mutate({ roomId: roomId ?? '' }) : handleLive())}
        >
          <PlaySquare className="w-4 h-4 mr-1" />
          {startLive ? 'Stop live' : 'Start live'}
        </Button>
      </div>

      <div className="flex items-center gap-x-2">
        <span className="font-medium text-sm text-background mr-2">
          <span className="font-normal mr-2">Dealer :</span>
          {username}
        </span>
        <Button variant="outline" size="sm">
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
