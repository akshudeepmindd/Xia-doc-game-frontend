import Navbar from '@/components/common/navbar';
import { createLazyFileRoute, useNavigate, useParams } from '@tanstack/react-router';
import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import Hint from '@/components/hint';
import { isEmpty } from 'lodash';
import { Check, EyeIcon, Loader2, Plus, X } from 'lucide-react';
import { Button } from '../components/ui/button';
import { useMutation, useQuery } from '@tanstack/react-query';
import { GET_PLAY_ROOM, GET_REQUEST_STATUS } from '@/lib/constants';
import { playRoom, roomJoinRequest, roomRequestStatus } from '@/services/room';
import useProfile from '@/hooks/useProfile';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from '@radix-ui/react-dialog';
import { DialogHeader } from '@/components/ui/dialog';
import { FormattedMessage } from 'react-intl';
const PlayRoomsPanel = () => {
  const navigate = useNavigate();
  const { userId } = useProfile();
  const [selectroom, setselectRoom] = useState({});
  const joinRequest = useMutation({
    mutationFn: roomJoinRequest,
  });

  const { isLoading, data: dealerroomdetail } = useQuery({
    queryKey: [GET_PLAY_ROOM],
    queryFn: () => playRoom(),
    enabled: true,
    refetchInterval: 1000,
    refetchIntervalInBackground: true,
  });

  const { isLoading: isLoading2, data: requestStatus } = useQuery({
    queryKey: [GET_REQUEST_STATUS],
    queryFn: () => roomRequestStatus({ userId, roomId: selectroom?._id }),
    enabled: !isLoading,
    refetchInterval: 2000,
    refetchIntervalInBackground: true,
  });

  useEffect(() => {
    if (!isLoading2) {
      if (requestStatus?.status === 'ACCEPTED') {
        navigate({ to: `/play/${selectroom?._id}` });
      } else if (requestStatus?.status === 'REJECTED') {
        toast.error('Your request has been rejected. Please try again later');
      }
    }
  }, [requestStatus?.status, isLoading2, navigate]);
  const HandleJoinRequest = (player) => {
    setselectRoom(player);
    joinRequest.mutate({ userId, roomId: player?._id });
  };
  if (isLoading) {
    return `Loading ...`;
  }
  return (
    <>
      <Navbar />
      <div
        className='h-screen bg-auto bg-no-repeat bg-center bg-cover bg-[url("/bigbg.png")]'
        style={{
          minHeight: '100vh',
          height: '100%',
        }}
      >
        <div className="flex justify-center flex-col align-center container w-9/12">
          <h1 className="text-white text-3xl mt-2 mb-2 my-3 text-center">
            <FormattedMessage id="app.playroom" />
          </h1>
          <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4   gap-4">
            {!isEmpty(dealerroomdetail)
              ? dealerroomdetail?.message?.map((player: Player, index: number) => (
                  <div className="max-w-sm rounded overflow-hidden shadow-lg border bg-[white]">
                    <div className="px-6 py-4">
                      <div className="font-bold text-xl mb-2">
                        <span className="">{player?.name}</span>
                      </div>
                      <p className="text-gray-700 text-base">
                        Numbers of players: <span className="">{player?.players?.length}</span>
                      </p>
                      <p className="text-gray-700 text-base">
                        Room Owner: <span className="">{player?.owner?.telegramusername}</span>
                      </p>
                    </div>
                    <div className="px-6 pt-4 pb-2 flex justify-end">
                      <Hint content="Join">
                        <Dialog open={requestStatus?.status === 'PENDING'}>
                          <DialogTrigger asChild>
                            <Button
                              className="buttoncss rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 w-28 mt-1"
                              onClick={() => HandleJoinRequest(player)}
                            >
                              {selectroom._id == player._id ? (
                                <Loader2 size={10} className="w-9 h-9 animate-spin" />
                              ) : (
                                <FormattedMessage id="app.join" />
                              )}
                            </Button>
                          </DialogTrigger>
                          <br />
                          {/* {selectroom._id == player._id && (
                            <DialogContent>
                              <DialogHeader className="flex flex-row items-center gap-x-4">
                                <div>
                                  <Loader2 className="w-8 h-8 animate-spin" />
                                </div>
                                <div>
                                  <DialogTitle>
                                    <FormattedMessage id="app.requestsent" />
                                  </DialogTitle>
                                  <DialogDescription>
                                    <FormattedMessage id="app.requestsenttext" />
                                  </DialogDescription>
                                </div>
                              </DialogHeader>
                            </DialogContent>
                          )}{' '} */}
                        </Dialog>
                      </Hint>
                    </div>
                  </div>
                ))
              : ''}
          </div>
        </div>
      </div>
    </>
  );
};

export const Route = createLazyFileRoute('/playrooms')({
  component: PlayRoomsPanel,
});
