import DealerFooter from '@/components/dealer-footer';
import Navbar from '@/components/navbar';
import useProfile from '@/hooks/useProfile';
import { getLiveStreamToken } from '@/services/auth';
import {
  Call,
  LivestreamPlayer,
  StreamCall,
  StreamTheme,
  StreamVideo,
  StreamVideoClient,
  VideoPreview,
} from '@stream-io/video-react-sdk';
import { useQuery } from '@tanstack/react-query';
import { createLazyFileRoute, useParams } from '@tanstack/react-router';
import { useEffect, useState } from 'react';

// import '@stream-io/video-react-sdk/dist/css/styles.css';

const apiKey = 'cuvjbzq9jruc';

const DealerComponent = () => {
  const { userId, username } = useProfile();
  const { roomId } = useParams({ strict: false });
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
    return <>Loading...</>;
  }

  return (
    client &&
    call && (
      <StreamTheme>
        <StreamVideo client={client}>
          <StreamCall call={call}>
            <div className="flex flex-col h-screen bg-[url(/casino-bg.jpg)]">
              <Navbar roomId={roomId} isDealer={true} />
              <div className="flex-1 flex flex-col gap-y-2">
                <div className="flex items-center justify-between px-10 gap-x-4">
                  <div className="w-1/4 bg-slate-50">Count down</div>
                  <div className="w-[43rem] h-96 overflow-hidden">
                    {roomId && <LivestreamPlayer callId={roomId} callType="livestream" />}
                    <VideoPreview />
                  </div>
                  <div className="w-1/4 bg-slate-50">Table</div>
                </div>

                <div className="flex items-center justify-between px-10 gap-x-4">
                  <div className="w-1/4 bg-slate-50">Even</div>
                  <div className="w-1/4 bg-slate-50 h-64"></div>
                  <div className="w-1/4 bg-slate-50">Odd</div>
                </div>
              </div>
              <DealerFooter call={call} />
            </div>
          </StreamCall>
        </StreamVideo>
      </StreamTheme>
    )
  );
};

export const Route = createLazyFileRoute('/dealer/$roomId')({
  component: DealerComponent,
});
