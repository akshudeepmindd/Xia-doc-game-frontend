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
      <div className='h-screen bg-auto bg-no-repeat bg-center bg-cover bg-[url("/bigbg.png")]'>
        <div className="flex justify-center flex-col align-center container w-9/12">
          <h1 className="text-white text-3xl mt-2 mb-2 my-3 text-center">Play Room</h1>
          <Table className="bg-[white]">
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Room Name</TableHead>
                <TableHead>Players in Room</TableHead>
                <TableHead>Room Owner</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {!isEmpty(dealerroomdetail) ? (
                dealerroomdetail?.message?.map((player: Player, index: number) => (
                  <TableRow>
                    <TableCell>{player.name}</TableCell>
                    <TableCell>{player.players.length}</TableCell>
                    <TableCell>{player.owner.telegramusername}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Hint content="Join">
                          <Dialog open={requestStatus?.status === 'PENDING'}>
                            <DialogTrigger asChild>
                              <Button
                                size={'icon'}
                                className="h-8 w-8 bg-green-400 hover:bg-green-200"
                                onClick={() => HandleJoinRequest(player)}
                              >
                                <Plus size={18} className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            {selectroom._id == player._id && (
                              <DialogContent>
                                <DialogHeader className="flex flex-row items-center gap-x-4">
                                  <div>
                                    <Loader2 className="w-8 h-8 animate-spin" />
                                  </div>
                                  <div>
                                    <DialogTitle>Your request has been sent to the Admin</DialogTitle>
                                    <DialogDescription>
                                      Thank you for your interest. We will get back to you soon.
                                    </DialogDescription>
                                  </div>
                                </DialogHeader>
                              </DialogContent>
                            )}{' '}
                          </Dialog>
                        </Hint>
                        {/* <Hint content="Reject">
                          <Button size={'icon'} className="h-8 w-8 bg-red-500 hover:bg-red-200 ">
                            <X size={18} className="h-4 w-4" />
                          </Button>
                        </Hint> */}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>No Rooms Available</TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </>
  );
};

export const Route = createLazyFileRoute('/playrooms')({
  component: PlayRoomsPanel,
});
