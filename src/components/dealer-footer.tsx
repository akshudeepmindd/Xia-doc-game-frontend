import { Camera, CameraOff, Mic, MicOff, PlaySquare, Settings } from 'lucide-react';
import { Button } from './ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import useProfile from '@/hooks/useProfile';
import { useMutation } from '@tanstack/react-query';
import { createDealerLive } from '@/services/room';
import { addRound, updateRound } from '@/services/round';
import { MeetingProvider, useMeeting } from '@videosdk.live/react-sdk';
import { useEffect } from 'react';
import { FormattedMessage } from 'react-intl';

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
  startStream,
  setMeetingId,
  setStartLive,
  setAuthToken,
  toggleCamera,
  startLive,
  meetingId,
  roomId,
  round,
  selectResult,
  resultDeclare,
  roundStatus,
  countdown,
  setSelectResult,
  isCameraOn,
  stopStream,
  cameraId,
  setCameraId,
  cameraToken,
  setCameraToken,
  setCountDown,
}: {
  setMeetingId: (meetingId: string) => void;
  startStream: () => void;
  toggleCamera: () => void;
  setStartLive: (startLive: boolean) => void;
  setAuthToken: (authToken: string) => void;
  setCameraId: (cameraId: string) => void;
  setCameraToken: (cameraToken: string) => void;
  stopStream: () => void;
  cameraId: string;
  cameraToken: string;
  startLive: boolean;
  meetingId: string;
  authToken: string;
  roomId: string;
  isCameraOn: boolean;
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
  // const { startHls: startHLS2, stopHls: stopHLS2, toggleWebcam: togglewebcam2, hlsState: hlsstate2 } = useMeeting();

  // useEffect(() => {
  //   console.log('useMeeting properties:', { startHls, stopHls, toggleWebcam, hlsState });
  //   console.log('useMeeting properties:', { startHLS2, stopHLS2, togglewebcam2, hlsState: hlsstate2 });
  // }, []);

  const isLive = true;
  const isMuted = true;
  // const isCameraOn = true;

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
    return createRound.mutate({ roomId, round: { roundNumber: roundId, gameroom: roomId, roundCountdown: true } });
  };

  const handleUpdateRoundStatus = () => {
    const roundId = round?.data?._id;
    setSelectResult('');
    setCountDown(0);
    return updateRoundStatus.mutate({ roundId, round: { roundStatus: 'roundend' } });
  };

  const progressLive = useMutation({
    mutationFn: createDealerLive,
    onSuccess: (data) => {
      setMeetingId(data.message.roomId);
      setAuthToken(data.message.token);
      setCameraId(data.message.cameraStreamId);
      setCameraToken(data.message.camerastreamingToken);
      setStartLive(true);
      console.log('Dealer live created, meeting ID:', data.message.roomId);
    },
  });

  // const handleLive = async () => {
  //   try {
  //     if (!startLive && meetingId === '') {
  //       await startHls(config);
  //       await startHLS2(config);
  //       console.log('HLS started');
  //     } else if (startLive) {
  //       await stopHls();
  //       await stopHLS2();
  //       console.log('HLS stopped');
  //       setStartLive(false);
  //     } else {
  //       await startHls(config);
  //       console.log('HLS started');

  //       await startHLS2(config);
  //       console.log('HLS started 2');
  //       setStartLive(true);
  //     }
  //   } catch (error) {
  //     console.error('Error handling live state:', error);
  //   }
  // };

  // useEffect(() => {
  //   console.log('HLS state changed:', hlsState);
  // }, [hlsState]);

  return (
    cameraId !== '' &&
    cameraToken !== '' && (
      // <MeetingProvider
      //   config={{
      //     meetingId: cameraId,
      //     mode: 'CONFERENCE',
      //     name: 'Name',
      //     micEnabled: true,
      //     webcamEnabled: true,
      //     debugMode: false,
      //   }}
      //   token={cameraToken}
      //   joinWithoutUserInteraction
      // >
      <footer className="flex-1 bg-primary flex items-center justify-between px-8">
        <div className="flex items-center gap-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4 mr-1" />
                <FormattedMessage id="app.settingcamera" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => toggleCamera()}>
                {!isCameraOn ? <Camera className="w-4 h-4 mr-1" /> : <CameraOff className="w-4 h-4 mr-1" />}
                {!isCameraOn ? 'Turn on camera' : 'Turn off camera'}
              </DropdownMenuItem>
              <DropdownMenuItem>
                {!isMuted ? <Mic className="w-4 h-4 mr-1" /> : <MicOff className="w-4 h-4 mr-1" />}
                {!isMuted ? 'Turn on mic' : 'Turn off mic'}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          {startLive == false ? (
            <Button variant="outline" size="sm" onClick={() => startStream()}>
              <PlaySquare className="w-4 h-4 mr-1" />
              <FormattedMessage id="app.startlive" />
            </Button>
          ) : (
            <Button variant="outline" size="sm" onClick={() => stopStream()}>
              <PlaySquare className="w-4 h-4 mr-1" />
              <FormattedMessage id="app.stoplive" />
            </Button>
          )}
        </div>
        {selectResult && countdown <= 0 && roundStatus === 'resultdeclare' && (
          <Button className="rounded-xl bg-[#0EA66E]" size="sm" onClick={() => resultDeclare(selectResult)}>
            <FormattedMessage id="app.result" />
          </Button>
        )}
        <div className="flex items-center gap-x-2">
          <span className="font-medium text-sm text-background mr-2">
            <span className="font-normal mr-2">Dealer :</span>
            {username}
          </span>
          <Button variant="outline" size="sm" onClick={handleRoundStart}>
            <FormattedMessage id="app.startround" />
          </Button>
          <Button variant="outline" size="sm" onClick={handleUpdateRoundStatus}>
            <FormattedMessage id="app.endround" />
          </Button>
        </div>
      </footer>
      // </MeetingProvider>
    )
  );
};

export default DealerFooter;
