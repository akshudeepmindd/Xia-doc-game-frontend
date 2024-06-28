import Navbar from '@/components/navbar';
import { createLazyFileRoute, useParams } from '@tanstack/react-router';

const GameComponent = () => {
  const { roomId } = useParams({ strict: false });

  return (
    <div className="flex flex-col h-screen bg-[url(/casino-bg.jpg)] bg-no-repeat bg-cover bg-center">
      <Navbar roomId={roomId} />

      <div className="flex-1 flex item-center justify-center relative">
        <img className="h-[calc(100vh-5rem)]" src="/poker-table.png" />

        <div className="clip-path-tl 2xl:w-64 2xl:h-44 w-56 h-40 absolute bg-foreground top-[33%] -translate-y-[55%] 2xl:left-[19%] left-[20%]"></div>
        <div className="clip-path-horizontal 2xl:w-64 2xl:h-44 w-56 h-40 absolute bg-foreground bottom-[40%] translate-y-[55%] rotate-180 2xl:left-[19%] left-[20%]"></div>

        <div className="w-[25%] h-64 2xl:w-[30%] 2xl:h-80 absolute top-[23%] -translate-y-[50%] left-[50%] -translate-x-1/2"></div>

        <div className="clip-path-horizontal 2xl:w-64 2xl:h-44 w-56 h-40 absolute bg-foreground top-[33%] -translate-y-[55%] 2xl:right-[19%] right-[20%]"></div>
        <div className="clip-path-tl 2xl:w-64 2xl:h-44 w-56 h-40 absolute bg-foreground bottom-[40%] translate-y-[55%] rotate-180 2xl:right-[19%] right-[20%]"></div>

        <div className="2xl:w-44 2xl:h-44 w-40 h-40 bg-foreground absolute bottom-[40%] translate-y-[55%] 2xl:left-[38%] left-[37.5%]"></div>
        <div className="2xl:w-44 2xl:h-44 w-40 h-40 bg-foreground absolute bottom-[40%] translate-y-[55%] 2xl:right-[38%] right-[37.5%]"></div>

        <div className="absolute bottom-2 w-[40rem] bg-foreground rounded shadow-sm h-20"></div>
      </div>
    </div>
  );
};

export const Route = createLazyFileRoute('/play/$roomId')({
  component: GameComponent,
});
