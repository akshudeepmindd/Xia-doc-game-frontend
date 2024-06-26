import Hint from './hint';
import { Button } from './ui/button';
import { Check, Signal, UserPlus, MessagesSquare, Users, UserCog } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export default function Navbar() {
  return (
    <div className="flex justify-between h-10">
      <div className="flex px-4 item-center gap-2 mt-2">
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
                  <TableRow>
                    <TableCell>Username</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Hint content="Accept">
                          <Button size={'icon'} className="h-8 w-8 bg-green-400 hover:bg-green-200 ">
                            <Check size={18} className="h-4 w-4" />
                          </Button>
                        </Hint>
                        <Hint content="Reject">
                          <Button size={'icon'} className="h-8 w-8 bg-red-500 hover:bg-red-200 ">
                            <Check size={18} className="h-4 w-4" />
                          </Button>
                        </Hint>
                      </div>
                    </TableCell>
                  </TableRow>
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
            <DropdownMenuContent></DropdownMenuContent>
          </DropdownMenu>
        </Hint>
        <Hint content="SPO Players and Request">
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button size="icon" variant={'outline'} className="w-8 h-8">
                <UserCog size={18} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent></DropdownMenuContent>
          </DropdownMenu>
        </Hint>
      </div>
      <div>
        
      </div>
    </div>
  );
}
