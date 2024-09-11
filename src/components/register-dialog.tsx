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
import { FormattedMessage, useIntl } from 'react-intl';

interface RegisterProps {
  children: ReactNode;
  className?: string;
}

const Register = ({ children }: RegisterProps) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const intl = useIntl();

  const [open, setOpen] = useState(false);
  const loginSchema = z.object({
    telegramusername: z.string().min(1, intl.formatMessage({ id: 'app.televalidation' })),
    username: z.string().min(1, intl.formatMessage({ id: 'app.usernamevalidation' })),
    password: z.string().min(1, intl.formatMessage({ id: 'app.usernamevalidation' })),
  });
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
          <DialogTitle>
            <FormattedMessage id="app.createacount" />
          </DialogTitle>
          <DialogDescription>
            <FormattedMessage id="app.accountsubhead" />
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem className="relative">
                  <FormLabel>
                    <FormattedMessage id="app.username" />
                  </FormLabel>
                  <FormControl>
                    <Input placeholder={intl.formatMessage({ id: 'app.enteruname' })} {...field} />
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
                  <FormLabel>
                    <FormattedMessage id="app.password" />
                  </FormLabel>
                  <FormControl>
                    <Input placeholder={intl.formatMessage({ id: 'app.enterpassword' })} type="password" {...field} />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="telegramusername"
              render={({ field }) => (
                <FormItem className="relative">
                  <FormLabel>
                    <FormattedMessage id="app.telegram" />
                  </FormLabel>
                  <FormControl>
                    <Input placeholder={intl.formatMessage({ id: 'app.entertelegramusername' })} {...field} />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full buttoncss" disabled={loading}>
              {loading ? (
                <span className="flex items-center gap-x-1">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <FormattedMessage id="app.pleasewait" />
                </span>
              ) : (
                <FormattedMessage id="app.register" />
              )}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default Register;
