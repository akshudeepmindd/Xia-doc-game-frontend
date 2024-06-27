import Navbar from '@/components/navbar';
import useProfile from '@/hooks/useProfile';
import { GET_ROOMS_DETAILS } from '@/lib/constants';
import { getRoomDetailService } from '@/services/room';
import { useQuery } from '@tanstack/react-query';
import { createLazyFileRoute, useParams } from '@tanstack/react-router';

const GameComponent = () => {
  const { roomId } = useParams({ strict: false });
  const { roomOwner } = useProfile();
  const { isLoading, data } = useQuery({
    queryKey: [GET_ROOMS_DETAILS, { id: roomId ?? '' }],
    queryFn: () => getRoomDetailService(roomId ?? ''),
    enabled: !!roomId,
    refetchInterval: 3000,
    refetchIntervalInBackground: true,
  });
  console.log(data);
  if (isLoading) return <div>Loading...</div>;
  return (
    <div className="flex flex-col h-screen bg-[url(/casino-bg.jpg)] bg-no-repeat bg-cover bg-center">
      <Navbar roomOwner={roomOwner} playersInRoom={data.players || []} playersRequested={data.playersRequested || []} />

      <div className="flex-1 flex item-center justify-center relative">
        <img className="h-[calc(100vh-5rem)]" src="/poker-table.png" />

        <div className="clip-path-tl w-64 h-44 absolute bg-foreground top-[33%] -translate-y-1/2 left-[20%]"></div>
        <div className="clip-path-horizontal w-64 h-44 absolute bg-foreground bottom-[40%] translate-y-1/2 rotate-180 left-[20%]"></div>

        <div className="clip-path-horizontal w-64 h-44 absolute bg-foreground top-[33%] -translate-y-1/2 right-[20%]"></div>
        <div className="clip-path-tl w-64 h-44 absolute bg-foreground bottom-[40%] translate-y-1/2 rotate-180 right-[20%]"></div>

        <div className="w-44 h-44 bg-foreground absolute bottom-[40%] translate-y-1/2 left-[38%] drop-shadow-glow"></div>
        <div className="w-44 h-44 bg-foreground absolute bottom-[40%] translate-y-1/2 right-[38%]"></div>

        <div className="absolute bottom-2 w-[40rem] bg-foreground rounded shadow-sm h-20"></div>
      </div>
    </div>
  );
};

export const Route = createLazyFileRoute('/play/$roomId')({
  component: GameComponent,
});
