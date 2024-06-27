import Hint from './hint';
import { Button } from './ui/button';
import { Check, Signal, UserPlus, MessagesSquare, Users, UserCog, X, HandCoins, CircleDollarSign } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';

interface NavbarProps {
  roomOwner: boolean;
  playersRequested?:
    | [
        {
          telegramusername: string;

          _id?: string;
        },
      ]
    | undefined;
  playersInRoom?:
    | [
        {
          telegramusername: string;

          _id?: string;
        },
      ]
    | undefined;
  spoPlayersRequested?:
    | [
        {
          telegramusername: string;

          _id?: string;
        },
      ]
    | undefined;
}

export default function Navbar({ roomOwner, playersRequested, playersInRoom, spoPlayersRequested }: NavbarProps) {
  return (
    <div className="flex items-center justify-between h-20 px-8 bg-background/50">
      <div className="flex px-4 item-center gap-2">
        <Hint content="Signal">
          <Button size="icon" variant={'outline'} className="w-8 h-8">
            <Signal size={18} />
          </Button>
        </Hint>
        <Hint content="Your Chats">
          <Button size="icon" variant={'outline'} className="w-8 h-8">
            <MessagesSquare size={18} />
          </Button>
        </Hint>
        {roomOwner == false && (
          <>
            <Hint content="Players Requested">
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Button size="icon" variant={'outline'} className="w-8 h-8">
                    <UserPlus size={18} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <Table>
                    <TableBody>
                      {playersRequested?.length > 0 ? (
                        playersRequested?.map((player, index: number) => (
                          <TableRow key={index}>
                            <TableCell>{player?.telegramusername ?? 'Username'}</TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Hint content="Accept">
                                  <Button size={'icon'} className="h-8 w-8 bg-green-400 hover:bg-green-200 ">
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
                  <Button size="icon" variant={'outline'} className="w-8 h-8">
                    <Users size={18} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <Table>
                    <TableBody>
                      <TableBody>
                        {playersInRoom?.length > 0 ? (
                          playersInRoom?.map((player, index: number) => (
                            <TableRow key={index}>
                              <TableCell>{player?.telegramusername ?? 'Username'}</TableCell>
                              <TableCell>
                                <div className="flex gap-2">
                                  <Hint content="Accept">
                                    <Button size={'icon'} className="h-8 w-8 bg-green-400 hover:bg-green-200 ">
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
                      <TableBody>
                        {playersRequested?.length > 0 ? (
                          playersRequested?.map((player, index: number) => (
                            <TableRow key={index}>
                              <TableCell>{player?.telegramusername ?? 'Username'}</TableCell>
                              <TableCell>
                                <div className="flex gap-2">
                                  <Hint content="Accept">
                                    <Button size={'icon'} className="h-8 w-8 bg-green-400 hover:bg-green-200 ">
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
                    </TableBody>
                  </Table>
                </DropdownMenuContent>
              </DropdownMenu>
            </Hint>
          </>
        )}
      </div>
      <Button size="sm">Distribute coins</Button>
      <div className="flex items-center px-4 gap-x-4">
        <div className="flex items-center pl-6 bg-background rounded relative">
          <CircleDollarSign className="h-5 w-5 absolute z-10 left-2" />
          <Input placeholder="Balance" className="border-none" disabled />
        </div>
        <Button size={'icon'} className="w-8 h-8" variant={'outline'}>
          <HandCoins size={18} />
        </Button>
      </div>
    </div>
  );
}
