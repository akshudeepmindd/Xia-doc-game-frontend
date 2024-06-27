import Navbar from '@/components/navbar';
import { createLazyFileRoute, useParams } from '@tanstack/react-router';

const GameComponent = () => {
  const { roomId } = useParams({ strict: false });

  return (
    <div className="flex flex-col h-screen bg-[url(/casino-bg.jpg)] bg-no-repeat bg-cover bg-center">
      <Navbar roomId={roomId} />

      <div className="flex-1 flex item-center justify-center relative">
        <img className="h-[calc(100vh-5rem)]" src="/poker-table.png" />

        <div className="clip-path-tl xl:w-56 xl:h-40 w-56 h-40 absolute bg-foreground top-[33%] -translate-y-[55%] left-[20%]"></div>
        <div className="clip-path-horizontal xl:w-56 xl:h-40 w-56 h-40 absolute bg-foreground bottom-[40%] translate-y-[55%] rotate-180 left-[20%]"></div>

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
