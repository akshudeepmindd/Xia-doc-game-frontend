import GamesGrid from '@/components/games-grid';
import Logo from '@/components/logo';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { createLazyFileRoute } from '@tanstack/react-router';

const HomeComponent = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="h-screen bg-[url(img/casino-hero.jpg)]">
        <nav className="h-20 flex items-center justify-between px-20">
          <Logo />
          <div className="flex items-center gap-x-4">
            <Button variant="outline" size="sm">
              Login
            </Button>
            <Button size="sm">Register</Button>
          </div>
        </nav>
      </div>
      <div className="h-screen container p-8">
        <Tabs defaultValue="k-sport" className="w-full">
          <TabsList>
            <TabsTrigger value="k-sport">K Sport</TabsTrigger>
            <TabsTrigger value="shoot-fish">Shoot Fish</TabsTrigger>
          </TabsList>
          <TabsContent value="k-sport">
            <GamesGrid />
          </TabsContent>
          <TabsContent value="shoot-fish">
            <div></div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export const Route = createLazyFileRoute('/')({
  component: HomeComponent,
});
