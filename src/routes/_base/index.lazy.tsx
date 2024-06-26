import GamesGrid from '@/components/games-grid';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { createLazyFileRoute } from '@tanstack/react-router';

const HomeComponent = () => {
  return (
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
  );
};

export const Route = createLazyFileRoute('/_base/')({
  component: HomeComponent,
});
