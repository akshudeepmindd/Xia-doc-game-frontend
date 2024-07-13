import { Form, useForm } from 'react-hook-form';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Loader2 } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { MouseEventHandler, useState } from 'react';
import { z } from 'zod';
import { toast } from 'sonner';
import { updateUser } from '@/services/auth';
import useProfile from '@/hooks/useProfile';
import { updateRoom } from '@/services/room';
import { useMutation } from '@tanstack/react-query';

export default function DepositDiaglog({ children, roomId }: { children: React.ReactNode; roomId: string | undefined }) {
  const { userId } = useProfile();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState(0);

  const { mutate: depositeRequest } = useMutation({
    mutationFn: updateRoom,
  });
  const handleSubmit = async () => {
    try {
      setLoading(true);
      const depositeRequests = [];
      depositeRequests.push({ userId, deposit: amount });
      await depositeRequest({ id: roomId, game: { depositeRequest: depositeRequests } });
      toast.success('Deposit Request sent for Approval');
    } catch (error: unknown | any) {
      toast.error(error.message || 'Failed to login');
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Deposit</DialogTitle>
          <DialogDescription>Enter your details to deposit to your account</DialogDescription>
        </DialogHeader>

        <Input type="number" onChange={(e) => setAmount(parseInt(e.target.value))} />
        <Button onClick={() => handleSubmit()} className="w-full" disabled={loading}>
          {loading ? (
            <span className="flex items-center gap-x-1">
              <Loader2 className="w-4 h-4 animate-spin" />
              Deposit is in progress
            </span>
          ) : (
            'Submit'
          )}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
