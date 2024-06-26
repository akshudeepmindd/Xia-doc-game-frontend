import Navbar from '@/components/navbar';
import { createLazyFileRoute } from '@tanstack/react-router';

const GameComponent = () => {
  return (
    <div className="flex flex-col min-h-screen bg-[url(img/casino-bg.jpg)] bg-no-repeat bg-cover bg-center">
      <Navbar />
      <div className="h-20"></div>

      <div className="flex-1 bg-green-100"></div>
    </div>
  );
};

export const Route = createLazyFileRoute('/')({
  component: GameComponent,
});
