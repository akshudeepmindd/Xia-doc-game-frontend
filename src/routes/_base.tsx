import LoginDialog from '@/components/login-dialog';
import Logo from '@/components/logo';
import { useState } from 'react';
import Register from '@/components/register-dialog';
import { Button, buttonVariants } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import useProfile from '@/hooks/useProfile';
import useTokenTransfer from '@/hooks/useTokenTransfer';
import { setAuthToken } from '@/services';
import { createRoom, deductXusdt } from '@/services/room';
import { useMutation, useQuery } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, Outlet, createFileRoute } from '@tanstack/react-router';
import { addHours } from 'date-fns';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { rechargeXusdt, userProfile } from '@/services/auth';
import { USER_PROFILE } from '@/lib/constants';

const CreateRoom = z
  .object({
    name: z.string().min(1, 'Room name is required'),
    password: z.string(),
    roomType: z.enum(['private', 'public']),
    houseEdgeFee: z.string().min(0).max(100),
    even: z.string().min(0).max(100),
    odd: z.string().min(0).max(100),
    '4-white-0-red': z.string().min(0).max(100),
    '4-red-0-white': z.string().min(0).max(100),
    '3-white-1-red': z.string().min(0).max(100),
    '3-red-1-white': z.string().min(0).max(100),
    'even-9-10': z.string().min(0).max(100),
    'even-10-9': z.string().min(0).max(100),
    'odd-9-10': z.string().min(0).max(100),
    'odd-10-9': z.string().min(0).max(100),
  })
  .refine(
    (data) => {
      if (data.roomType === 'private') {
        return !!data.password;
      }
      return true;
    },
    {
      message: 'Password length should be at least 6',
      path: ['password'],
    },
  );

const BaseLayoutComponent = () => {
  const { username, roomOwner, userId } = useProfile();
  const { isLoading: isLoading3, data: userDetail } = useQuery({
    queryKey: [USER_PROFILE],
    queryFn: () => userProfile(userId),
    enabled: !!userId,
    refetchInterval: 2000,
    refetchIntervalInBackground: true,
  });
  const [open, setOpen] = useState(false);
  const [depositeopen, setdepositeopen] = useState(false);
  const [amount, setAmount] = useState(0);
  const { mutateAsync: purchaseRoom } = useMutation({
    mutationFn: createRoom,
  });
  const { mutateAsync: rechargewallet } = useMutation({
    mutationFn: rechargeXusdt,
  });
  const { isPending, sendToken } = useTokenTransfer({
    onError: (massage) => {
      console.log(massage);
    },
    onSuccess: async (response: z.infer<typeof CreateRoom>) => { },
  });
  const form = useForm<z.infer<typeof CreateRoom>>({
    resolver: zodResolver(CreateRoom),
    defaultValues: {
      name: '',
      password: '',
      roomType: 'private',
    },
  });

  const { mutateAsync: transferXusdt, isPending: isDeductLoading } = useMutation({
    mutationFn: deductXusdt,
  });

  const handleLogout = () => setAuthToken();

  const handleBuyRoom = async (response: z.infer<typeof CreateRoom>) => {
    try {
      // await sendToken("0x3C0a4590701059C198Be9B02A527EE2e7b407CB5", 0.1, data) // Address of admin who'll get the amount
      const rules = [];

      rules.push({
        EVEN: response.even,
        ODD: response.odd,
        FOUR_WHITE: response['4-white-0-red'],
        FOUR_BLACK: response['4-red-0-white'],
        THREE_WHITE_ONE_BLACK: response['3-white-1-red'],
        THREE_BLACK_ONE_WHITE: response['3-red-1-white'],
        EVEN_NINE_TEN: response['even-9-10'],
        EVEN_TEN_NINE: response['even-10-9'],
        ODD_TEN_NINE: response['odd-9-10'],
        ODD_NINE_TEN: response['odd-10-9'],
      });

      const payload = {
        name: response.name,
        password: response.password,
        startTime: new Date(),
        endTime: addHours(new Date(), 5),
        status: 'active',
        owner: userId,
        roomType: response.roomType,
        houseEdgeFee: +response.houseEdgeFee,
        SpoRequested: [],
        rules: rules,
      };

      await transferXusdt({ amount: 1000 });
      await purchaseRoom(payload); // API call for purchase room
      setOpen(false);
    } catch (error) {
      console.log('handleBuyRoom-Error', error);
    }
  };
  const handleWalletRecharge = async () => {
    console.log(amount, 'amount');
    await sendToken('0xebE3B38b9BADD80452809987E353E03a88C13387', amount);
  };
  return (
    <div className="flex flex-col min-h-screen">
      <div className="h-96 bg-[url(/casino-hero.jpg)]">
        <nav className="h-20 flex items-center justify-between px-20 bg-background/80">
          <Logo />
          <div className="flex items-center gap-x-4">
            {!username ? (
              <>
                <LoginDialog>
                  <Button variant="outline" size="sm">
                    Login
                  </Button>
                </LoginDialog>
                <Register>
                  <Button size="sm">Register</Button>
                </Register>
              </>
            ) : (
              <>
                <span className="text-foreground font-medium">{username}</span>
                <Button variant="outline" size="sm" onClick={handleLogout}>
                  Logout
                </Button>
                {roomOwner && (
                  <Link to="/room" className={buttonVariants({ size: 'sm' })}>
                    Rooms
                  </Link>
                )}
                <Dialog open={open} onOpenChange={() => setOpen(!open)}>
                  <DialogTrigger asChild>
                    <Button variant="secondary" size="sm" disabled={isDeductLoading}>
                      {isDeductLoading ? (
                        <>
                          <Loader2 className="w-4 h-5 mr-1 animate-spin" /> Please wait
                        </>
                      ) : (
                        'Buy rooms'
                      )}
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogTitle>Buy Room</DialogTitle>
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(handleBuyRoom)} className="space-y-4 w-full">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem className="relative">
                              <FormLabel>Room name</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter username" {...field} />
                              </FormControl>
                              <FormMessage className="text-xs" />
                            </FormItem>
                          )}
                        />

                        {form.getValues('roomType') === 'private' && (
                          <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                              <FormItem className="relative">
                                <FormLabel>Room password</FormLabel>
                                <FormControl>
                                  <Input placeholder="Enter password" type="password" {...field} />
                                </FormControl>
                                <FormMessage className="text-xs" />
                              </FormItem>
                            )}
                          />
                        )}

                        <FormField
                          control={form.control}
                          name="roomType"
                          render={({ field }) => (
                            <FormItem className="relative">
                              <FormLabel>Room Type</FormLabel>
                              <FormControl>
                                <RadioGroup
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                  orientation="horizontal"
                                  className="flex items-center"
                                >
                                  <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="private" id="r1" />
                                    <Label htmlFor="r1">Private</Label>
                                  </div>
                                  {/* <div className="flex items-center space-x-2">
                                <RadioGroupItem value="public" id="r2" />
                                <Label htmlFor="r2">Public</Label>
                              </div> */}
                                </RadioGroup>
                              </FormControl>
                              <FormMessage className="text-xs" />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="houseEdgeFee"
                          render={({ field }) => (
                            <FormItem className="relative">
                              <FormLabel>House edge fee</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter House Edge fee" type="text" {...field} />
                              </FormControl>
                              <FormMessage className="text-xs" />
                            </FormItem>
                          )}
                        />

                        <div className="flex flex-col gap-y-2 mt-2">
                          <Label className="text-lg">Set rules for the Room</Label>
                          <div className="w-full grid grid-cols-2 gap-3 gap-x-2">
                            <FormField
                              control={form.control}
                              name="even"
                              render={({ field }) => (
                                <FormItem className="relative">
                                  {/* <FormLabel>Even</FormLabel> */}
                                  <FormControl>
                                    <Input placeholder="Enter rule for even" type="text" {...field} />
                                  </FormControl>
                                  <FormMessage className="text-xs" />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="odd"
                              render={({ field }) => (
                                <FormItem className="relative">
                                  {/* <FormLabel>Odd</FormLabel> */}
                                  <FormControl>
                                    <Input placeholder="Enter rule for odd" type="text" {...field} />
                                  </FormControl>
                                  <FormMessage className="text-xs" />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="4-white-0-red"
                              render={({ field }) => (
                                <FormItem className="relative">
                                  {/* <FormLabel>4 White 0 Red</FormLabel> */}
                                  <FormControl>
                                    <Input placeholder="Enter rule for 4 white 0 red" type="text" {...field} />
                                  </FormControl>
                                  <FormMessage className="text-xs" />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="4-red-0-white"
                              render={({ field }) => (
                                <FormItem className="relative">
                                  {/* <FormLabel>4 Red 0 White</FormLabel> */}
                                  <FormControl>
                                    <Input placeholder="Enter rule for 4 red 0 white" type="text" {...field} />
                                  </FormControl>
                                  <FormMessage className="text-xs" />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="3-white-1-red"
                              render={({ field }) => (
                                <FormItem className="relative">
                                  {/* <FormLabel>3 White 1 Red</FormLabel> */}
                                  <FormControl>
                                    <Input placeholder="Enter rule for 3 white 1 red" type="text" {...field} />
                                  </FormControl>
                                  <FormMessage className="text-xs" />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="3-red-1-white"
                              render={({ field }) => (
                                <FormItem className="relative">
                                  {/* <FormLabel>3 Red 1 White</FormLabel> */}
                                  <FormControl>
                                    <Input placeholder="Enter rule for 3 red 1 white" type="text" {...field} />
                                  </FormControl>
                                  <FormMessage className="text-xs" />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="even-10-9"
                              render={({ field }) => (
                                <FormItem className="relative">
                                  {/* <FormLabel>Even 10:9</FormLabel> */}
                                  <FormControl>
                                    <Input placeholder="Enter rule for even 10:9" type="text" {...field} />
                                  </FormControl>
                                  <FormMessage className="text-xs" />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="even-9-10"
                              render={({ field }) => (
                                <FormItem className="relative">
                                  {/* <FormLabel>Even 9:10</FormLabel> */}
                                  <FormControl>
                                    <Input placeholder="Enter rule for even 9:10" type="text" {...field} />
                                  </FormControl>
                                  <FormMessage className="text-xs" />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name="odd-10-9"
                              render={({ field }) => (
                                <FormItem className="relative">
                                  {/* <FormLabel>Odd 10:9</FormLabel> */}
                                  <FormControl>
                                    <Input placeholder="Enter rule for odd 10:9" type="text" {...field} />
                                  </FormControl>
                                  <FormMessage className="text-xs" />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="odd-9-10"
                              render={({ field }) => (
                                <FormItem className="relative">
                                  {/* <FormLabel>Odd 9:10</FormLabel> */}
                                  <FormControl>
                                    <Input placeholder="Enter rule for 9:10" type="text" {...field} />
                                  </FormControl>
                                  <FormMessage className="text-xs" />
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>

                        <Button type="submit" className="w-full" disabled={isPending}>
                          {isPending ? (
                            <span className="flex items-center gap-x-1">
                              <Loader2 className="w-4 h-4 animate-spin" />
                              Please wait
                            </span>
                          ) : (
                            'Buy Room'
                          )}
                        </Button>
                      </form>
                    </Form>
                  </DialogContent>
                </Dialog>
                <Dialog open={depositeopen} onOpenChange={setdepositeopen}>
                  <DialogTrigger asChild>
                    <div className="relative w-44 px-2 py-1 bg-inherit border-2 rounded border-black-200 flex justify-between items-center">
                      <p className="text-xs">Balance: </p>
                      <div className="flex items-center">
                        <p className="text-xs ">{userDetail?.walletBalance ? userDetail?.walletBalance : 0} xUsd</p>
                        &nbsp;
                        <p className="text-xs">
                          <img src="/plus.svg" alt="recharge wallet" className="h-4" />
                        </p>
                      </div>
                    </div>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Deposit</DialogTitle>
                      <DialogDescription>Enter your amount (in USDT) to deposit to your account</DialogDescription>
                    </DialogHeader>

                    <Input type="number" onChange={(e) => setAmount(parseInt(e.target.value))} />
                    <Button onClick={() => handleWalletRecharge()} className="w-full" disabled={isPending}>
                      {isPending ? (
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
              </>
            )}
          </div>
        </nav>
      </div>
      <div className="h-screen container p-8">
        <Outlet />
      </div>
    </div>
  );
};

export const Route = createFileRoute('/_base')({
  component: BaseLayoutComponent,
});
