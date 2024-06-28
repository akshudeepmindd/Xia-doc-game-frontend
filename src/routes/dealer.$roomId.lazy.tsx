import DealerFooter from '@/components/dealer-footer';
import Navbar from '@/components/navbar';
import {
  LivestreamPlayer,
  StreamCall,
  StreamTheme,
  StreamVideo,
  StreamVideoClient,
  User,
} from '@stream-io/video-react-sdk';
import { createLazyFileRoute, useParams } from '@tanstack/react-router';

const apiKey = 'cuvjbzq9jruc';
const token =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNjY3NmJlN2VhYjBiNTczZmJhNzI1MDJhIiwiZXhwIjoxNzE5NTcwNDA5LCJpYXQiOjE3MTk1NjY4MDd9.kud6LLiBYKqGRZtBwwj1sqUaYmPnVekuRKRVVcwlsYo';
const callId = 'ntzV5CDKF81q';

const user: User = { id: '6676be7eab0b573fba72502a', name: 'akdealer' };
const client = new StreamVideoClient({ apiKey, user, token });

const call = client.call('livestream', callId);
call.join({ create: true });

const DealerComponent = () => {
  const { roomId } = useParams({ strict: false });

  return (
    <StreamTheme>
      <StreamVideo client={client}>
        <StreamCall call={call}>
          <div className="flex flex-col h-screen bg-[url(/casino-bg.jpg)]">
            <Navbar roomId={roomId} isDealer={true} />
            <div className="flex-1 flex flex-col gap-y-2">
              <div className="flex items-center justify-between px-10 gap-x-4">
                <div className="w-1/4 bg-slate-50">Count down</div>
                <div className="w-[43rem] h-96 overflow-hidden">
                  <LivestreamPlayer callId={callId} callType="livestream" />
                </div>
                <div className="w-1/4 bg-slate-50">Table</div>
              </div>

              <div className="flex items-center justify-between px-10 gap-x-4">
                <div className="w-1/4 bg-slate-50">Even</div>
                <div className="w-1/4 bg-slate-50 h-64"></div>
                <div className="w-1/4 bg-slate-50">Odd</div>
              </div>
            </div>
          </div>
          <DealerFooter />
        </StreamCall>
      </StreamVideo>
    </StreamTheme>
  );
};

export const Route = createLazyFileRoute('/dealer/$roomId')({
  component: DealerComponent,
});
