import { ReactNode, useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { userLoginService, userProfile } from '@/services/auth';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { setAuthToken, setAuthUser } from '@/services';
import { useNavigate } from '@tanstack/react-router';
import { FormattedMessage, useIntl } from 'react-intl';
import { USER_PROFILE } from '@/lib/constants';
import { useQuery } from '@tanstack/react-query';

interface LoginDialogProps {
  children: ReactNode;
}

const LoginDialog = ({ children }: LoginDialogProps) => {
  const intl = useIntl();
  const loginSchema = z.object({
    telegramusername: z.string().min(1, intl.formatMessage({ id: 'app.usernamevalidation' })),
    password: z.string().min(1, intl.formatMessage({ id: 'app.passwordvalidation' })),
  });
  // const { isLoading: isLoading3, data: userDetail } = useQuery({
  //   queryKey: [USER_PROFILE],
  //   queryFn: (userId: string) => userProfile(userId),
  //   refetchInterval: 2000,
  //   refetchIntervalInBackground: true,
  // });
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
      const response = await userLoginService(data);
      setAuthToken(response.message.token);
      setAuthUser({
        userId: response.message.user._id,
        username: response.message.user.telegramusername,
        roomOwner: response.message.user.roomowner,
      });
      userProfile(response.message.user._id);
      navigate({ to: '/' });
      toast.success('Login successful');
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
            <FormattedMessage id="app.login" />
          </DialogTitle>
          <DialogDescription>
            <FormattedMessage id="app.logintext" />
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="telegramusername"
              render={({ field }) => (
                <FormItem className="relative">
                  <FormLabel>
                    {' '}
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

            <Button type="submit" className="w-full buttoncss" disabled={loading}>
              {loading ? (
                <span className="flex items-center gap-x-1">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <FormattedMessage id="app.pleasewait" />
                </span>
              ) : (
                <FormattedMessage id="app.login" />
              )}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default LoginDialog;
