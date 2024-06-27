import GamesGrid from '@/components/games-grid';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import useProfile from '@/hooks/useProfile';
import { GET_ROOM } from '@/lib/constants';
import { getRooms } from '@/services/room';
import { useQuery } from '@tanstack/react-query';
import { createLazyFileRoute } from '@tanstack/react-router';
import { useState } from 'react';

const HomeComponent = () => {
  const { userId } = useProfile();
  const [enabled, setEnabled] = useState(false);

  const { isLoading, data } = useQuery({
    queryKey: [GET_ROOM, { id: userId }],
    queryFn: () => getRooms(userId),
    enabled: enabled,
  });

  if (isLoading) return <div>Loading...</div>;
  return (
    <Tabs defaultValue="k-sport" className="w-full">
      <TabsList>
        <TabsTrigger value="k-sport">K Sport</TabsTrigger>
        <TabsTrigger value="shoot-fish">Shoot Fish</TabsTrigger>
      </TabsList>
      <TabsContent value="k-sport">
        <GamesGrid setEnable={setEnabled} enabled={enabled} />
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
