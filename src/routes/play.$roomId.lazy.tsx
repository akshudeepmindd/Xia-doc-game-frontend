import Navbar from '@/components/navbar';
import { Call, LivestreamPlayer, StreamTheme, StreamVideo, StreamVideoClient } from '@stream-io/video-react-sdk';
import { createLazyFileRoute, useParams } from '@tanstack/react-router';

import '@stream-io/video-react-sdk/dist/css/styles.css';
import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import useProfile from '@/hooks/useProfile';
import { getLiveStreamToken } from '@/services/auth';

const apiKey = 'cuvjbzq9jruc';

const GameComponent = () => {
  const { roomId } = useParams({ strict: false });
  const { userId, username } = useProfile();

  const [call, setCall] = useState<Call>();
  const [client, setClient] = useState<StreamVideoClient>();

  const { data: getToken, isLoading } = useQuery({
    queryKey: ['GET_STREAM_TOKEN'],
    queryFn: () => getLiveStreamToken({ userId }),
    enabled: !!userId,
    refetchInterval: 60 * 60 * 1000 - 200,
    refetchIntervalInBackground: true,
  });

  useEffect(() => {
    if (getToken && roomId) {
      const client = new StreamVideoClient({
        apiKey,
        user: { id: userId, name: username },
        token: getToken.message,
      });

      const call = client.call('livestream', roomId);
      setCall(call);
      setClient(client);
    }
  }, [getToken?.message]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    client &&
    call && (
      <div className="flex flex-col h-screen bg-[url(/casino-bg.jpg)] bg-no-repeat bg-cover bg-center">
        <Navbar roomId={roomId} />

        <div className="flex-1 flex item-center justify-center relative">
          <img className="h-[calc(100vh-5rem)]" src="/poker-table.png" />

          <div className="clip-path-tl 2xl:w-64 2xl:h-44 w-56 h-40 absolute bg-foreground top-[33%] -translate-y-[55%] 2xl:left-[19%] left-[20%]"></div>
          <div className="clip-path-horizontal 2xl:w-64 2xl:h-44 w-56 h-40 absolute bg-foreground bottom-[40%] translate-y-[55%] rotate-180 2xl:left-[19%] left-[20%]"></div>

          <div className="w-[25%] h-64 2xl:w-[30%] 2xl:h-80 absolute top-[23%] -translate-y-[50%] left-[50%] -translate-x-1/2">
            <StreamTheme className="w-full h-full rounded-none">
              <StreamVideo client={client}>
                {roomId && (
                  <LivestreamPlayer
                    callId={roomId}
                    callType="livestream"
                    layoutProps={{
                      showSpeakerName: false,
                      showParticipantCount: false,
                      showDuration: false,
                      showLiveBadge: false,
                    }}
                  />
                )}
              </StreamVideo>
            </StreamTheme>
          </div>

          <div className="clip-path-horizontal 2xl:w-64 2xl:h-44 w-56 h-40 absolute bg-foreground top-[33%] -translate-y-[55%] 2xl:right-[19%] right-[20%]"></div>
          <div className="clip-path-tl 2xl:w-64 2xl:h-44 w-56 h-40 absolute bg-foreground bottom-[40%] translate-y-[55%] rotate-180 2xl:right-[19%] right-[20%]"></div>

          <div className="2xl:w-44 2xl:h-44 w-40 h-40 bg-foreground absolute bottom-[40%] translate-y-[55%] 2xl:left-[38%] left-[37.5%]"></div>
          <div className="2xl:w-44 2xl:h-44 w-40 h-40 bg-foreground absolute bottom-[40%] translate-y-[55%] 2xl:right-[38%] right-[37.5%]"></div>

          <div className="absolute bottom-2 w-[40rem] bg-foreground rounded shadow-sm h-20"></div>
        </div>
      </div>
    )
  );
};

export const Route = createLazyFileRoute('/play/$roomId')({
  component: GameComponent,
});
