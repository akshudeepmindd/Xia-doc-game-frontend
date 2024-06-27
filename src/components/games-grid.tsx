import { Loader2 } from 'lucide-react';
import { Card, CardContent, CardFooter } from './ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';

interface GamesGridProps {
  setEnable: (value: boolean) => void;
  enabled: boolean;
}
const GamesGrid = ({ setEnable, enabled }: GamesGridProps) => {
  return (
    <div className="grid grid-cols-4 w-full">
      <Dialog open={enabled}>
        <DialogTrigger asChild>
          <Card className="w-full h-[28rem]" onClick={() => setEnable(!enabled)}>
            <CardContent className="p-0 h-96 overflow-hidden rounded">
              <img className="w-full" src="/xoc-dia-thumbnail.jpg" alt="xoc-dia" />
            </CardContent>
            <CardFooter className="py-4">
              <div className="flex items-center">
                <span className="text-lg font-semibold">Xoc Dia</span>
              </div>
            </CardFooter>
          </Card>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader className="flex flex-row items-center gap-x-4">
            <div>
              <Loader2 className="w-8 h-8 animate-spin" />
            </div>
            <div>
              <DialogTitle>Your request has been sent to the Admin</DialogTitle>
              <DialogDescription>Thank you for your interest. We will get back to you soon.</DialogDescription>
            </div>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GamesGrid;
