import { Form, useForm } from 'react-hook-form';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Loader2 } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { z } from 'zod';
import { toast } from 'sonner';
import { updateUser } from '@/services/auth';
import useProfile from '@/hooks/useProfile';

export default function DepositDiaglog({ children }: { children: React.ReactNode }) {
  const { userId } = useProfile();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState(0);
  const handleSubmit = async (e) => {
    console.log(e, 'E');
    e.preventDefault();
    try {
      setLoading(true);
      await updateUser({ userId, body: { balance: amount } });
      toast.success('Deposit successful');
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
        <Button onClick={(e) => handleSubmit(e)} className="w-full" disabled={loading}>
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
