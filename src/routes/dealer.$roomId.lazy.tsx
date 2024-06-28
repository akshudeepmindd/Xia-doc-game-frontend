import DealerFooter from '@/components/dealer-footer';
import Navbar from '@/components/navbar';
import { createLazyFileRoute, useParams } from '@tanstack/react-router';

const DealerComponent = () => {
  const { roomId } = useParams({ strict: false });

  return (
    <div className="flex flex-col h-screen bg-[url(/casino-bg.jpg)]">
      <Navbar roomId={roomId} isDealer={true} />
      <div className="flex-1 flex flex-col gap-y-2">
        <div className="flex items-center justify-between px-10 gap-x-4">
          <div className="w-1/4 bg-slate-50">Count down</div>
          <div className="w-[43rem] h-96 overflow-hidden"></div>
          <div className="w-1/4 bg-slate-50">Table</div>
        </div>

        <div className="flex items-center justify-between px-10 gap-x-4">
          <div className="w-1/4 bg-slate-50">Even</div>
          <div className="w-1/4 bg-slate-50 h-64"></div>
          <div className="w-1/4 bg-slate-50">Odd</div>
        </div>
      </div>
      <DealerFooter />
    </div>
  );
};

export const Route = createLazyFileRoute('/dealer/$roomId')({
  component: DealerComponent,
});
