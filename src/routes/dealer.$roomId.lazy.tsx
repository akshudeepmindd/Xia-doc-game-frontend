import DealerFooter from '@/components/dealer-footer';
import SpeakerScreen from '@/components/livestream/speaker';
import Navbar from '@/components/navbar';
import { GET_ROUND_DETAILS, SOCKET_ROUND_START } from '@/lib/constants';
import { socket } from '@/services';
import { getRoundDetails } from '@/services/round';
import { useQuery } from '@tanstack/react-query';
import { createLazyFileRoute, useParams } from '@tanstack/react-router';
import useProfile from '@/hooks/useProfile';
import { GET_ROOMS_DETAILS } from '@/lib/constants';
import { getRoomDetailService } from '@/services/room';
import { MeetingProvider } from '@videosdk.live/react-sdk';

import { useEffect, useState } from 'react';

const DealerComponent = () => {
  const { roomId } = useParams({ strict: false });
  const [countdown, setCountdown] = useState(0);

  const { isLoading, data: roundDetails } = useQuery({
    queryKey: [GET_ROUND_DETAILS],
    queryFn: () => getRoundDetails(roomId ? roomId : ''),
    enabled: !!roomId,
  });

  useEffect(() => {
    socket.on(SOCKET_ROUND_START, (data: any) => {
      console.log('SOCKET DATA', data);
      setCountdown(45);
    });

    return () => {
      socket.off(SOCKET_ROUND_START);
    };
  }, []);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setInterval(() => {
        // const now = new Date().setSeconds(new Date().getSeconds() + 45) new Date().getTime();
        setCountdown((prevCountdown) => prevCountdown - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [countdown]);

  const [meetingId, setMeetingId] = useState('');
  const [startLive, setStartLive] = useState(false);
  const [authToken, setAuthToken] = useState('');
  const { username } = useProfile();

  const { data: roomDetails } = useQuery({
    queryKey: [GET_ROOMS_DETAILS],
    queryFn: async () => getRoomDetailService(roomId || ''),
  });

  useEffect(() => {
    if (roomDetails) {
      setMeetingId(roomDetails?.dealerLiveStreamId);
      setAuthToken(roomDetails?.streamingToken);
    }
  }, [roomDetails]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col h-screen bg-primary">
      <Navbar roomId={roomId} isDealer={true} />
      <div className="flex-1 flex flex-col gap-y-2">
        <div className="flex items-center justify-between px-10 gap-x-4">
          {' '}
          <div className="w-1/4 h-80 flex items-center justify-center">
            <div className="w-24 h-24 flex items-center justify-center text-background border-2 rounded-full text-3xl font-medium font-[consolas]">
              {countdown > 0 ? countdown : <span className="text-xl">Start</span>}
            </div>
          </div>
          <div className="w-[43rem] h-96 overflow-hidden">
            {startLive ? (
              <SpeakerScreen meetingId={meetingId} name={username} authToken={authToken} />
            ) : (
              <div className="flex justify-center items-center h-25">Live Need to Start from Bottom</div>
            )}
          </div>
          <div className="w-1/4 bg-slate-50">Table</div>
        </div>
        <div className="flex items-center justify-between px-10 gap-x-4">
          <EvenSelectionBoard />
          <div className="w-1/4 bg-slate-50 h-64"></div>
          <OddSelectionBoard />
        </div>
        {roomId && (
          <>
            {meetingId !== '' && (
              <MeetingProvider
                config={{
                  meetingId: meetingId,
                  mode: 'CONFERENCE',
                  name: 'Name',
                  micEnabled: true,
                  webcamEnabled: true,
                  debugMode: false,
                }}
                token={authToken}
                joinWithoutUserInteraction
              >
                <DealerFooter
                  roomId={roomId}
                  round={roundDetails?.message}
                  setMeetingId={setMeetingId}
                  setStartLive={setStartLive}
                  startLive={startLive}
                  setAuthToken={setAuthToken}
                  meetingId={meetingId}
                  authToken={authToken}
                />
              </MeetingProvider>
            )}
          </>
        )}
      </div>
    </div>
  );
};

const RedCircle = () => {
  return <div className="w-8 h-8 bg-red-500 rounded-full"></div>;
};

const WhiteCircle = () => {
  return <div className="w-8 h-8 bg-white rounded-full"></div>;
};

const EvenSelectionBoard = () => {
  return (
    <div className="w-1/4 h-72 flex flex-col gap-y-6">
      <h1 className="text-background text-2xl font-medium text-center">Even</h1>
      <div className="grid grid-cols-2 gap-6">
        <div className="flex flex-col justify-around w-full border border-background h-24 rounded p-2">
          <h3 className="flex items-center justify-around w-full">
            <span className="text-background">White 4</span>
            <span className="text-background">Red 0</span>
          </h3>
          <div className="w-full flex items-center justify-around">
            <WhiteCircle />
            <WhiteCircle />
            <WhiteCircle />
            <WhiteCircle />
          </div>
        </div>
        <div className="flex flex-col justify-around w-full border border-background h-24 rounded p-2">
          <h3 className="flex items-center justify-around w-full">
            <span className="text-background">White 2</span>
            <span className="text-background">Red 2</span>
          </h3>
          <div className="w-full flex items-center justify-around">
            <WhiteCircle />
            <WhiteCircle />
            <RedCircle />
            <RedCircle />
          </div>
        </div>
        <div className="flex flex-col justify-around w-full border border-background h-24 rounded p-2">
          <h3 className="flex items-center justify-around w-full">
            <span className="text-background">White 0</span>
            <span className="text-background">Red 4</span>
          </h3>
          <div className="w-full flex items-center justify-around">
            <RedCircle />
            <RedCircle />
            <RedCircle />
            <RedCircle />
          </div>
        </div>
      </div>
    </div>
  );
};

const OddSelectionBoard = () => {
  return (
    <div className="w-1/4 h-72 flex flex-col gap-y-6">
      <h1 className="text-background text-2xl font-medium text-center">Odd</h1>
      <div className="grid grid-cols-2 gap-6">
        <div className="flex flex-col justify-around w-full border border-background h-24 rounded p-2">
          <h3 className="flex items-center justify-around w-full">
            <span className="text-background">White 3</span>
            <span className="text-background">Red 1</span>
          </h3>
          <div className="w-full flex items-center justify-around">
            <WhiteCircle />
            <WhiteCircle />
            <WhiteCircle />
            <RedCircle />
          </div>
        </div>
        <div className="flex flex-col justify-around w-full border border-background h-24 rounded p-2">
          <h3 className="flex items-center justify-around w-full">
            <span className="text-background">White 1</span>
            <span className="text-background">Red 3</span>
          </h3>
          <div className="w-full flex items-center justify-around">
            <WhiteCircle />
            <RedCircle />
            <RedCircle />
            <RedCircle />
          </div>
        </div>
      </div>
    </div>
  );
};

export const Route = createLazyFileRoute('/dealer/$roomId')({
  component: DealerComponent,
});
