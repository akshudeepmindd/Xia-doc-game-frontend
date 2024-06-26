import { buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import useProfile from '@/hooks/useProfile';
import { GET_ROOMS_BY_OWNER } from '@/lib/constants';
import { getGamebyOwnerService } from '@/services/room';
import { useQuery } from '@tanstack/react-query';
import { Link } from '@tanstack/react-router';
import { createLazyFileRoute } from '@tanstack/react-router';

const RoomsComponent = () => {
  const { userId } = useProfile();
  const { isLoading, data } = useQuery({
    queryKey: [GET_ROOMS_BY_OWNER],
    queryFn: () => getGamebyOwnerService(userId),
    enabled: !!userId,
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container">
      <div className="grid grid-cols-4">
        {data?.map((room: { name: string; _id: string; players: string[]; playersRequested: string[] }) => (
          <Card className="w-full h-[28rem]">
            <CardContent className="p-0 h-80 overflow-hidden rounded">
              <img className="w-full" src="/xoc-dia-thumbnail.jpg" alt="xoc-dia" />
            </CardContent>
            <CardFooter className="items-center pt-4 justify-between">
              <div className="flex flex-col items-start">
                <span className="text-lg font-semibold">{room.name}</span>
                <span className="text-foreground">Players: {room.players.length}</span>
                <span className="text-foreground">Requested: {room.playersRequested.length}</span>
              </div>
              <Link to={`/play/${room._id}`} className={buttonVariants({ size: 'sm' })}>
                View room
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export const Route = createLazyFileRoute('/_base/room')({
  component: RoomsComponent,
});
