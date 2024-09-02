import Navbar from '@/components/common/navbar';
import { Button, buttonVariants } from '@/components/ui/button';
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
    <div className="bg-auto bg-no-repeat bg-center bg-cover bg-[url('/bigbg.png')] pb-10">
      <Navbar />
      <div className="h-[100vh] bg-auto bg-no-repeat bg-center bg-cover bg-[url('/bg.png')] ">
        <div className="flex justify-center items-center flex-col h-[100vh]">
          <h1 className="text-4xl font-bold text-white">
            <span className="text-[#155BE6]">Your Gaming</span> Rooms
          </h1>
        </div>
      </div>
      <div className="grid grid-cols-3">
        {data?.map((room: { name: string; _id: string; players: string[]; playersRequested: string[] }) => (
          // <Card className="w-full h-[28rem]">
          //   <CardContent className="p-0 h-80 overflow-hidden rounded">
          //     <img className="w-full" src="/xoc-dia-thumbnail.jpg" alt="xoc-dia" />
          //   </CardContent>
          //   <CardFooter className="items-center pt-4 justify-between">
          //     <div className="flex flex-col items-start">
          //       <span className="text-lg font-semibold">{room.name}</span>
          //       <span className="text-foreground">Players: {room.players.length}</span>
          //       <span className="text-foreground">Requested: {room.playersRequested.length}</span>
          //     </div>
          //     <Link to={`/play/${room._id}`} className={buttonVariants({ size: 'sm' })}>
          //       View room
          //     </Link>
          //   </CardFooter>
          // </Card>
          // <div className="gap-3 columns-3 container">
          <div className="p-6 mt-6 max-w-sm mx-auto bg-white rounded-xl shadow-lg flex items-center space-x-4">
            <div className="flex justify-center items-center flex-col relative">
              <img className="" src="/image1.png" />
              <div className="flex flex-row justify-between py-4">
                <div className="border-indigo-500 border-t-5"></div>
                <h6 className="text-2xl font-bold text-[#155BE6] ">{room.name}</h6>
                <div className="border-indigo-500 border-t-2"></div>
              </div>
              <p className="text-center pb-4">
                <span className="text-foreground">Players: {room.players.length}</span><br/>
                <span className="text-foreground">Requested: {room.playersRequested.length}</span>
              </p>
              <div className="absolute -bottom-8">
                <Link
                  to={`/play/${room._id}`}
                  className="buttoncss text-white rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 px-2 py-2"
                >
                  View room
                </Link>
              </div>
            </div>
          </div>
          // </div>
        ))}
      </div>
    </div>
  );
};

export const Route = createLazyFileRoute('/_base/room')({
  component: RoomsComponent,
});
