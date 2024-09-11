import Navbar from '@/components/common/navbar';
import { createLazyFileRoute, useNavigate, useParams } from '@tanstack/react-router';
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import Hint from '@/components/hint';
import { isEmpty } from 'lodash';
import { Check, EyeIcon, Play, X } from 'lucide-react';
import { Button } from '../components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { GET_DEALER_ROOM } from '@/lib/constants';
import { dealerRoom } from '@/services/room';
import useProfile from '@/hooks/useProfile';
import { FormattedMessage } from 'react-intl';
const DealerPanel = () => {
  const navigate = useNavigate();
  const { userId } = useProfile();
  const { isLoading, data: dealerroomdetail } = useQuery({
    queryKey: [GET_DEALER_ROOM],
    queryFn: () => dealerRoom(userId ? userId : ''),
    enabled: !!userId,
    refetchInterval: 1000,
    refetchIntervalInBackground: true,
  });
  if (isLoading) {
    return `Loading ...`;
  }
  return (
    <>
      <Navbar />
      <div className='h-screen bg-auto bg-no-repeat bg-center bg-cover bg-[url("/bigbg.png")]'>
        <div className="flex justify-center flex-col align-center container w-9/12">
          <h1 className="text-white text-3xl mt-2 mb-2 my-3 text-center">Dealer's Room</h1>
          <Table className="bg-[white]">
            <TableHeader>
              <TableRow>
                <TableRow>
                  <TableHead className="w-[100px]">
                    <FormattedMessage id="app.roomname" />
                  </TableHead>
                  <TableHead>
                    <FormattedMessage id="app.playersinroom" />
                  </TableHead>
                  <TableHead>
                    <FormattedMessage id="app.roomowner" />
                  </TableHead>
                  <TableHead>
                    <FormattedMessage id="app.action" />
                  </TableHead>
                </TableRow>
              </TableRow>
            </TableHeader>
            <TableBody>
              {!isEmpty(dealerroomdetail) ? (
                dealerroomdetail.map((player: Player, index: number) => (
                  <TableRow>
                    <TableCell>{player?.name}</TableCell>
                    <TableCell>{player?.players?.length}</TableCell>
                    <TableCell>{player?.playersRequested?.length}</TableCell>
                    <TableCell>{player?.owner?.telegramusername}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Hint content="Get In Room">
                          <Button
                            size={'icon'}
                            className="h-8 w-8 bg-green-400 hover:bg-green-200"
                            onClick={() => navigate({ to: `/dealer/${player._id}` })}
                          >
                            <Play size={18} className="h-4 w-4" />
                          </Button>
                        </Hint>
                        <Hint content="Reject">
                          <Button size={'icon'} className="h-8 w-8 bg-red-500 hover:bg-red-200 ">
                            <X size={18} className="h-4 w-4" />
                          </Button>
                        </Hint>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <FormattedMessage id="nouserrequested" />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </>
  );
};

export const Route = createLazyFileRoute('/dealerpanel')({
  component: DealerPanel,
});
