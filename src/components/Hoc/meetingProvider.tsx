import React from 'react';
import { MeetingProvider } from '@videosdk.live/react-sdk';
import { PlaySquare } from 'lucide-react';
import { Button } from '../ui/button';

export const HOCMeetingProvider = ({
  children,
  meetingId,
  authToken,
  startLive,
  progressLive,
}: {
  children: any;
  meetingId: string;
  authToken: string;
  startLive: boolean;
  progressLive: any;
}) => {
  return (
    <MeetingProvider
      config={{
        meetingId: meetingId,
        autoConsume: undefined,
        preferredProtocol: undefined,
        participantId: undefined,
        name: '',
        micEnabled: false,
        webcamEnabled: false,
        maxResolution: undefined,
        customCameraVideoTrack: undefined,
        customMicrophoneAudioTrack: undefined,
        multiStream: undefined,
        mode: undefined,
        metaData: undefined,
        defaultCamera: undefined,
        debugMode: false,
      }}
      token={authToken}
    >
      <Button
        variant="outline"
        size="sm"
        onClick={() => (!startLive && meetingId == '' ? progressLive.mutate({ roomId: roomId ?? '' }) : handleLive())}
      >
        <PlaySquare className="w-4 h-4 mr-1" />
        {startLive ? 'Stop live' : 'Start live'}
      </Button>
    </MeetingProvider>
  );
};
