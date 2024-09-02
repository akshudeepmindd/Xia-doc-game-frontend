import Hint from './hint';
import { Button } from './ui/button';
import {
  Check,
  UserCog,
  X,
  Drama,
} from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { useMutation, useQuery } from '@tanstack/react-query';
import { GET_REQUEST_STATUS, GET_ROOMS_DETAILS } from '@/lib/constants';
import { getRoomDetailService, roomJoinRequestAccept, roomRequestStatus, updateRoom } from '@/services/room';
import { isEmpty } from 'lodash';
import useProfile from '@/hooks/useProfile';
import { toast } from 'sonner';
import { useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { updateUser } from '@/services/auth';
import { socket } from '@/services';

interface NavbarProps {
  roomId: string | undefined;
  isDealer?: boolean;
}

interface Player {
  telegramusername: string;
  _id: string;
}

interface Deposit {
  userId: {
    _id: string;
    telegramusername: string;
  };
  deposit: number;
}

export default function Navbar({ roomId, isDealer }: NavbarProps) {
  const { roomOwner, userId } = useProfile();
  const navigate = useNavigate();

  const { isLoading, data: roomDetails } = useQuery({
    queryKey: [GET_ROOMS_DETAILS],
    queryFn: async () => getRoomDetailService(roomId || ''),
    refetchInterval: 3000,
    refetchIntervalInBackground: true,
  });

  useEffect(() => {
    // Handle JOIN_REQUEST event
    const handleJoinRequest = (data: any) => {
      if (data.roomId === roomId) {
        toast.success("You have a join request!")
      }
    };

    // Handle JOIN_REQUEST event
    socket.on('JOIN_ROOM', handleJoinRequest);
    // Clean up on component unmount
    return () => {
      socket.off('JOIN_ROOM', handleJoinRequest);
    };
  }, [roomId]);

  const { isLoading: isLoading2, data: requestStatus } = useQuery({
    queryKey: [GET_REQUEST_STATUS],
    queryFn: () => roomRequestStatus({ userId, roomId: roomId ?? '' }),
    enabled: !!roomId && !!userId,
    refetchInterval: 2000,
    refetchIntervalInBackground: true,
  });

  useEffect(() => {
    if (!isLoading && !isLoading2 && !roomOwner) {
      if (!isDealer) {
        if (requestStatus?.status === 'PENDING') {
          toast.error('Your request has not been approved yet');
          navigate({ to: '/' });
        } else if (requestStatus?.status === 'REJECTED') {
          toast.error('Your are kicked out of the room.');
          navigate({ to: '/' });
        }
      }
    }
  }, [requestStatus?.status, isLoading2, roomDetails?.message?.dealer?._id]);

  const acceptUser = useMutation({
    mutationFn: roomJoinRequestAccept,
  });
  const makeDealer = useMutation({
    mutationFn: updateRoom,
  });
  const userWalletUpdate = useMutation({
    mutationFn: updateUser,
  });

  useEffect(() => {
    async function fetchRequestAlert() {

    }

    if (roomDetails?.playersRequested) {
      fetchRequestAlert();
    }
  }, [])

  const handleAccept = (userid: string, amount: number) => {
    const updatedDepositRequest = roomDetails.depositeRequest.filter(
      (deposit: { userId: { _id: string; telegramusername: string }; deposit: number }) =>
        deposit.userId._id !== userid,
    );
    makeDealer.mutate({ id: roomDetails._id, game: { depositeRequest: updatedDepositRequest } });
    userWalletUpdate.mutate({ userId: userid, body: { balance: amount, depositRequest: true } });
  };

  const handleMakeSpo = () => {
    const players = roomDetails.players;
    const requestedPlayer = players.find((player: { _id: string }) => player._id === userId);

    console.log('Players', players, requestedPlayer, userId);
    const spoRequested = [...roomDetails.SpoRequested];
    spoRequested.push(requestedPlayer._id);

    makeDealer.mutate({ id: roomDetails._id, game: { SpoRequested: spoRequested } });
  };

  const handleAcceptSPO = (userId: string) => {
    const spoRequested = roomDetails.SpoRequested;

    const requestedPlayer = spoRequested.find((player: { _id: string }) => player._id === userId);
    const newSpoRequested = spoRequested.filter((player: { _id: string }) => player._id !== userId);
    // const spoAccepted = [...roomDetails.SpoAccepted];

    const spoAccepted = requestedPlayer._id;
    makeDealer.mutate({ id: roomDetails._id, game: { SpoAccepted: spoAccepted, SpoRequested: newSpoRequested } });
  };

  if (isLoading) return <>Loading...</>;

  return (
    <div className="flex items-center justify-between h-10 px-4 pt-4">
      <div className="flex px-4 item-center gap-2">
        {isDealer && (
          <Hint content="Info">
            <Button size="icon" variant={'ghost'} className="w-8 h-8">
              <img src="/arrow.png" />
            </Button>
          </Hint>
        )}
        <Hint content="Signal">
          <Button size="icon" variant={'ghost'} className="w-8 h-8">
            <img src="/info.png" />
          </Button>
        </Hint>
        <Hint content="Your Chats">
          <Button size="icon" variant={'ghost'} className="w-8 h-8">
            <img src="/signal.png" />
          </Button>
        </Hint>
        <Hint content="Your Chats">
          <Button size="icon" variant={'ghost'} className="w-8 h-8">
            <img src="/chat.png" />
          </Button>
        </Hint>  <Hint content="Your Chats">
          <Button size="icon" variant={'ghost'} className="w-8 h-8">
            <img src="/media.png" />
          </Button>
        </Hint>  <Hint content="Your Chats">
          <Button size="icon" variant={'ghost'} className="w-8 h-8">
            <img src="/wallet.png" />
          </Button>
        </Hint>  <Hint content="Your Chats">
          <Button size="icon" variant={'ghost'} className="w-8 h-8">
            <img src="/subsidy.png" />
          </Button>
        </Hint>  <Hint content="Your Chats">
          <Button size="icon" variant={'ghost'} className="w-8 h-8">
            <img src="/qa.png" />
          </Button>
        </Hint>  <Hint content="Your Chats">
          <Button size="icon" variant={'ghost'} className="w-8 h-8">
            <img src="/music.png" />
          </Button>
        </Hint>
        <Hint content="Your Chats">
          <Button size="icon" variant={'ghost'} className="w-8 h-8">
            <img src="/volume.png" />
          </Button>
        </Hint>
        <Hint content="Your Chats">
          <Button size="icon" variant={'ghost'} className="w-8 h-8">
            <img src="/gift.png" />
          </Button>
        </Hint>
         <Hint content="Your Chats">
          <Button size="icon" variant={'ghost'} className="w-8 h-8">
            <img src="/gamepad.png" />
          </Button>
        </Hint>
        <Hint content="Your Chats">
          <Button size="icon" variant={'ghost'} className="w-8 h-8">
            <img src="/logout.png" />
          </Button>
        </Hint>
        
       
        {/* {isDealer && (
          <Hint content="Tip">
            <Button size="icon" variant={'outline'} className="w-8 h-8">
              <Drama size={18} />
            </Button>
          </Hint>
        )} */}
        {roomOwner && !isDealer && (
          <>
            <Hint content="Players Requested">
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Button size="icon" variant={'ghost'} className="w-8 h-8">
                    <img src="/People.svg" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <Table>
                    <TableBody>
                      {!isEmpty(roomDetails.playersRequested) ? (
                        roomDetails.playersRequested.map((player: Player, index: number) => (
                          <TableRow key={index}>
                            <TableCell>{player?.telegramusername ?? 'Username'}</TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Hint content="Accept">
                                  <Button
                                    size={'icon'}
                                    className="h-8 w-8 bg-green-400 hover:bg-green-200"
                                    onClick={() => acceptUser.mutate({ roomId: roomDetails._id, userId: player._id })}
                                  >
                                    <Check size={18} className="h-4 w-4" />
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
                        <TableRow>No Users Have Requested</TableRow>
                      )}
                    </TableBody>
                  </Table>
                </DropdownMenuContent>
              </DropdownMenu>
            </Hint>
            <Hint content="Deposit Requested">
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Button size="icon" variant={'ghost'} className="w-8 h-8">
                    <img src="/Deposit.svg" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <Table>
                    <TableBody>
                      {!isEmpty(roomDetails.depositeRequest) ? (
                        roomDetails.depositeRequest.map((player: Deposit, index: number) => (
                          <TableRow key={index}>
                            <TableCell>{player?.userId?.telegramusername ?? 'Username'}</TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Hint content="Accept">
                                  <Button
                                    size={'icon'}
                                    className="h-8 w-8 bg-green-400 hover:bg-green-200"
                                    onClick={() => handleAccept(player?.userId?._id, player?.deposit)}
                                  >
                                    <Check size={18} className="h-4 w-4" />
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
                        <TableRow>No Users Have Requested</TableRow>
                      )}
                    </TableBody>
                  </Table>
                </DropdownMenuContent>
              </DropdownMenu>
            </Hint>
            <Hint content="Players in Room">
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Button size="icon" variant={'ghost'} className="w-8 h-8">
                    <img src="/admin.svg" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <Table>
                    <TableBody>
                      <TableBody>
                        {!isEmpty(roomDetails.players) ? (
                          roomDetails.players.map((player: Player, index: number) => (
                            <TableRow key={index}>
                              <TableCell>{player.telegramusername ?? 'Username'}</TableCell>
                              <TableCell>
                                <div className="flex gap-2">
                                  {isEmpty(roomDetails.dealer) && (
                                    <Hint content="Make dealer">
                                      <Button
                                        size={'icon'}
                                        onClick={() =>
                                          makeDealer.mutate({ id: roomDetails._id, game: { dealer: player._id } })
                                        }
                                        className="h-8 w-8 bg-green-400 hover:bg-green-200"
                                      >
                                        <Check size={18} className="h-4 w-4" />
                                      </Button>
                                    </Hint>
                                  )}
                                  <Hint content="Kick out">
                                    <Button
                                      size={'icon'}
                                      onClick={() =>
                                        makeDealer.mutate({
                                          id: roomDetails._id,
                                          game: {
                                            players: roomDetails.players.filter(
                                              (ply: Player) => ply._id !== player._id,
                                            ),
                                          },
                                        })
                                      }
                                      className="h-8 w-8 bg-red-500 hover:bg-red-200 "
                                    >
                                      <X size={18} className="h-4 w-4" />
                                    </Button>
                                  </Hint>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>No Users Have Requested</TableRow>
                        )}
                      </TableBody>
                    </TableBody>
                  </Table>
                </DropdownMenuContent>
              </DropdownMenu>
            </Hint>
            <Hint content="SPO Players and Request">
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Button size="icon" variant={'outline'} className="w-8 h-8">
                    <UserCog size={18} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <Table>
                    <TableBody>
                      {!isEmpty(roomDetails.SpoRequested) ? (
                        roomDetails.SpoRequested.map((player: Player, index: number) => (
                          <TableRow key={index}>
                            <TableCell>{player?.telegramusername ?? 'Username'}</TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Hint content="Accept">
                                  <Button
                                    size={'icon'}
                                    className="h-8 w-8 bg-green-400 hover:bg-green-200"
                                    onClick={() => handleAcceptSPO(player._id)}
                                  >
                                    <Check size={18} className="h-4 w-4" />
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
                        <TableRow>No Users Have Requested</TableRow>
                      )}
                    </TableBody>
                  </Table>
                </DropdownMenuContent>
              </DropdownMenu>
            </Hint>
          </>
        )}
      </div>
      {/* {roomOwner && <Button size="sm">Distribute coins</Button>} */}
      {/* <Button size="sm" onClick={handleMakeSpo}>Request for SPO</Button> */}
      <div className="flex items-center px-4 gap-x-4">
      <Button className="rounded-xl bg-[#0EA66E]">Result Declare</Button>
         
      </div>
    </div>
  );
}
