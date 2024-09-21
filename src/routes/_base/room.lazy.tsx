import Navbar from '@/components/common/navbar';
import { Button, buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import useProfile from '@/hooks/useProfile';
import { GET_ROOMS_BY_OWNER } from '@/lib/constants';
import { getGamebyOwnerService } from '@/services/room';
import { useQuery } from '@tanstack/react-query';
import { Link } from '@tanstack/react-router';
import { createLazyFileRoute } from '@tanstack/react-router';
import { FormattedMessage } from 'react-intl';

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
      <div className="relative h-screen bg-auto bg-no-repeat bg-center bg-cover bg-[url('/bg.png')]">
        <div className="flex justify-center items-center flex-col h-full px-4 sm:px-6 md:px-8 lg:px-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white text-center">
            <span className="text-[#155BE6]">
              <FormattedMessage id="app.urgaming" />
            </span>
            <FormattedMessage id="app.rooms" />
          </h1>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 p-4">
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
                <span className="text-foreground">
                  <FormattedMessage id="app.players" />: {room.players.length}
                </span>
                <br />
                <span className="text-foreground">
                  <FormattedMessage id="app.playersrequested" />: {room.playersRequested.length}
                </span>
              </p>
              <div className="absolute -bottom-8">
                <a
                  href={`/play/${room._id}`}
                  className="buttoncss text-white rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 px-2 py-2"
                >
                  <FormattedMessage id="app.viewrooms" />
                </a>
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
