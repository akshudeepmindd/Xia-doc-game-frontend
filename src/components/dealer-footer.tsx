import { Camera, CameraOff, Mic, MicOff, PhoneOff, PlaySquare, Settings } from 'lucide-react';
import { Button } from './ui/button';
import useProfile from '@/hooks/useProfile';
import { Call, ParticipantView, useCallStateHooks } from '@stream-io/video-react-sdk';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';

interface DealerFooterProps {
  call: Call;
}

const DealerFooter = ({ call }: DealerFooterProps) => {
  const { username } = useProfile();

  const { useCameraState, useIsCallLive, useMicrophoneState } = useCallStateHooks();
  const { camera, isEnabled } = useCameraState();

  const { isEnabled: isMute, microphone } = useMicrophoneState();

  const isLive = useIsCallLive();

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
            <DropdownMenuItem onClick={() => camera.toggle()}>
              {!isEnabled ? <Camera className="w-4 h-4 mr-1" /> : <CameraOff className="w-4 h-4 mr-1" />}
              {!isEnabled ? 'Turn on camera' : 'Turn off camera'}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => microphone.toggle()}>
              {!isMute ? <Mic className="w-4 h-4 mr-1" /> : <MicOff className="w-4 h-4 mr-1" />}
              {!isMute ? 'Turn on mic' : 'Turn off mic'}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Button variant="outline" size="sm" onClick={() => (isLive ? call.stopLive() : call.goLive())}>
          <PlaySquare className="w-4 h-4 mr-1" />
          {isLive ? 'Stop live' : 'Start live'}
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
