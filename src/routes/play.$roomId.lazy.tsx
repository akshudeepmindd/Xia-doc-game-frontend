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

import '@stream-io/video-react-sdk/dist/css/styles.css';

const apiKey = 'cuvjbzq9jruc';
const token =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNjY3NmJlN2VhYjBiNTczZmJhNzI1MDJhIiwiZXhwIjoxNzE5NTcwNDA5LCJpYXQiOjE3MTk1NjY4MDd9.kud6LLiBYKqGRZtBwwj1sqUaYmPnVekuRKRVVcwlsYo';
const callId = 'ntzV5CDKF81q';

const user: User = { id: '6676be7eab0b573fba72502a', name: 'akdealer' };
const client = new StreamVideoClient({ apiKey, user, token });

const call = client.call('livestream', callId);
call.join();

const GameComponent = () => {
  const { roomId } = useParams({ strict: false });

  return (
    <div className="flex flex-col h-screen bg-[url(/casino-bg.jpg)] bg-no-repeat bg-cover bg-center">
      <Navbar roomId={roomId} />

      <div className="flex-1 flex item-center justify-center relative">
        <img className="h-[calc(100vh-5rem)]" src="/poker-table.png" />

        <div className="clip-path-tl xl:w-56 xl:h-40 w-56 h-40 absolute bg-foreground top-[33%] -translate-y-[55%] left-[20%]"></div>
        <div className="clip-path-horizontal xl:w-56 xl:h-40 w-56 h-40 absolute bg-foreground bottom-[40%] translate-y-[55%] rotate-180 left-[20%]"></div>

        <div className="w-[30%] h-80 absolute top-[23%] -translate-y-[50%] left-[50%] -translate-x-1/2">
          <StreamTheme className="w-full h-full rounded-none">
            <StreamVideo client={client}>
              <StreamCall call={call}>
                <LivestreamPlayer
                  callId={callId}
                  callType="livestream"
                  layoutProps={{
                    showSpeakerName: false,
                    showParticipantCount: false,
                    showDuration: false,
                    showLiveBadge: false,
                  }}
                />
              </StreamCall>
            </StreamVideo>
          </StreamTheme>
        </div>

        <div className="clip-path-horizontal xl:w-56 xl:h-40 w-56 h-40 absolute bg-foreground top-[33%] -translate-y-[55%] right-[20%]"></div>
        <div className="clip-path-tl xl:w-56 xl:h-40 w-56 h-40 absolute bg-foreground bottom-[40%] translate-y-[55%] rotate-180 right-[20%]"></div>

        <div className="xl:w-40 xl:h-40 w-40 h-40 bg-foreground absolute bottom-[40%] translate-y-[55%] left-[37%]"></div>
        <div className="xl:w-40 xl:h-40 w-40 h-40 bg-foreground absolute bottom-[40%] translate-y-[55%] right-[37%]"></div>

        <div className="absolute bottom-2 w-[40rem] bg-foreground rounded shadow-sm h-20"></div>
      </div>
    </div>
  );
};

export const Route = createLazyFileRoute('/play/$roomId')({
  component: GameComponent,
});
