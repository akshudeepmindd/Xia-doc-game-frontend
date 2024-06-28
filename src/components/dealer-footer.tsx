import { PlaySquare, Settings } from 'lucide-react';
import { Button } from './ui/button';
import useProfile from '@/hooks/useProfile';
import { useCallStateHooks } from '@stream-io/video-react-sdk';

const DealerFooter = () => {
  const { username } = useProfile();

  const { useCameraState } = useCallStateHooks();
  const { camera, isMute, isEnabled } = useCameraState();

  console.log(isMute);

  return (
    <footer className="flex-1 h-16 bg-primary flex items-center justify-between px-8">
      <div className="flex items-center gap-x-2">
        <Button variant="outline" size="sm">
          <Settings className="w-4 h-4 mr-1" />
          Settings camera
        </Button>
        <Button variant="outline" size="sm" onClick={() => camera.toggle()}>
          <PlaySquare className="w-4 h-4 mr-1" />
          {isEnabled ? 'Stop live' : 'Start live'}
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
