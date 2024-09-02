import { ReactNode, useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { userRegister } from '@/services/auth';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { setAuthToken, setAuthUser } from '@/services';
import { useNavigate } from '@tanstack/react-router';

interface RegisterProps {
  children: ReactNode;
  className?: string;
}

const loginSchema = z.object({
  telegramusername: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
});

const Register = ({ children }: RegisterProps) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      telegramusername: '',
      password: '',
    },
  });

  const handleSubmit = async (data: z.infer<typeof loginSchema>) => {
    try {
      setLoading(true);
      const response = await userRegister(data);
      toast.success('Register successfully. Please login to continue');
    } catch (error: unknown | any) {
      toast.error(error.message || 'Failed to login');
    } finally {
      setLoading(false);
      form.reset();
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create an Account</DialogTitle>
          <DialogDescription>Enter your details to create your account</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="telegramusername"
              render={({ field }) => (
                <FormItem className="relative">
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter username" {...field} />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="relative">
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter password" type="password" {...field} />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full buttoncss" disabled={loading}>
              {loading ? (
                <span className="flex items-center gap-x-1">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Please wait
                </span>
              ) : (
                'Register'
              )}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default Register;
