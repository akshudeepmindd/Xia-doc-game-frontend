import DealerFooter from '@/components/dealer-footer';
import SpeakerScreen from '@/components/livestream/speaker';
import Navbar from '@/components/navbar';
import useProfile from '@/hooks/useProfile';
import { GET_ROOMS_DETAILS } from '@/lib/constants';
import { getRoomDetailService } from '@/services/room';
import { useQuery } from '@tanstack/react-query';
import { createLazyFileRoute, useParams } from '@tanstack/react-router';
import { MeetingProvider } from '@videosdk.live/react-sdk';
import { useEffect, useState } from 'react';

const DealerComponent = () => {
  const { roomId } = useParams({ strict: false });
  const [meetingId, setMeetingId] = useState('');
  const [startLive, setStartLive] = useState(false);
  const [authToken, setAuthToken] = useState('');
  const { username } = useProfile();
  const { isLoading, data: roomDetails } = useQuery({
    queryKey: [GET_ROOMS_DETAILS],
    queryFn: async () => getRoomDetailService(roomId || ''),
  });
  useEffect(() => {
    if (roomDetails) {
      setMeetingId(roomDetails?.dealerLiveStreamId);
      setAuthToken(roomDetails?.streamingToken);
    }
  }, [roomDetails]);
  console.log('meetingId', meetingId);
  console.log('authToken', authToken);
  return (
    <div className="flex flex-col h-screen bg-[url(/casino-bg.jpg)]">
      <Navbar roomId={roomId} isDealer={true} />
      <div className="flex-1 flex flex-col gap-y-2">
        <div className="flex items-center justify-between px-10 gap-x-4">
          <div className="w-1/4 bg-slate-50">Count down</div>
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
          <div className="w-1/4 bg-slate-50">Even</div>
          <div className="w-1/4 bg-slate-50 h-64"></div>
          <div className="w-1/4 bg-slate-50">Odd</div>
        </div>
      </div>
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
            setMeetingId={setMeetingId}
            setStartLive={setStartLive}
            startLive={startLive}
            setAuthToken={setAuthToken}
            meetingId={meetingId}
            authToken={authToken}
          />
        </MeetingProvider>
      )}{' '}
    </div>
  );
};

export const Route = createLazyFileRoute('/dealer/$roomId')({
  component: DealerComponent,
});
