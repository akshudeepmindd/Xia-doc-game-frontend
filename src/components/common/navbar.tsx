import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import RegisterDialog from '../register-dialog';
import LoginDialog from '../login-dialog';
import { Link } from '@tanstack/react-router';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@radix-ui/react-label';
import { RadioGroup, RadioGroupItem } from '@radix-ui/react-radio-group';
import { Loader2 } from 'lucide-react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '../ui/input';
import useProfile from '@/hooks/useProfile';
import useTokenTransfer from '@/hooks/useTokenTransfer';
import { useForm } from 'react-hook-form';
import { USER_PROFILE } from '@/lib/constants';
import { setAuthToken } from '@/services';
import { userProfile, rechargeXusdt } from '@/services/auth';
import { createRoom, deductXusdt } from '@/services/room';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery, useMutation } from '@tanstack/react-query';
import { addHours } from 'date-fns';
import { z } from 'zod';
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
const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
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
  const { mutateAsync: rechargewallet, isPending: RechargewalletPending } = useMutation({
    mutationFn: rechargeXusdt,
  });
  const { isPending, sendToken } = useTokenTransfer({
    onError: (massage) => {
      console.log(massage);
    },
    onSuccess: async (response: z.infer<typeof CreateRoom>) => {
      rechargewallet({ amount });
      setdepositeopen(false);
    },
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
    <nav className="text-white shadow-md bg-[#100820]">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <div className="text-2xl font-semibold">
          <a href="/" className="text-white">
            <img className="w-[70px]" src="/Union.png" />
          </a>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-6">
          <a href="/" className="rounded-full rounded-full hover:bg-gray-700 px-3 py-4 rounded text-[#AE9BD6] px-1">
            Home
          </a>
          <a href="#" className="rounded-full hover:bg-gray-700 px-3 py-4 rounded text-[#AE9BD6]">
            Features
          </a>
          <a href="#" className="rounded-full hover:bg-gray-700 px-3 py-4 rounded text-[#AE9BD6]">
            Pricing
          </a>
          {localStorage.getItem('token') ? (
            <>
              <Dialog open={depositeopen} onOpenChange={setdepositeopen}>
                <DialogTrigger asChild>
                  <div className="flex items-center py-2 relative">
                    <input
                      className="appearance-none bg-transparent border w-auto text-white-700 ml-2 py-2 px-1.5  rounded-full text-xs leading-tight focus:outline-none "
                      disabled
                      type="text"
                      value={userDetail?.user?.walletBalance ? `${userDetail?.user?.walletBalance} xUSDT` : `0`}
                    />
                    <img className="w-[30px] absolute right-0" src="/input.png" />
                  </div>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Deposit</DialogTitle>
                    <DialogDescription>Enter your amount (in USDT) to deposit to your account</DialogDescription>
                  </DialogHeader>

                  <Input type="number" onChange={(e) => setAmount(parseInt(e.target.value))} />
                  <Button
                    onClick={() => handleWalletRecharge()}
                    className="w-full buttoncss"
                    disabled={RechargewalletPending}
                  >
                    {RechargewalletPending ? (
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
              {userDetail?.dealer ? (
                <a href="/dealerpanel" className="rounded-full hover:bg-gray-700 px-3 py-4 rounded text-[#AE9BD6]">
                  Dashboard
                </a>
              ) : (
                <>
                  <a href="/room" className="rounded-full hover:bg-gray-700 px-3 py-4 rounded text-[#AE9BD6]">
                    My Rooms
                  </a>
                  {userDetail?.user?.role === 'user' && (
                    <a href="/playrooms" className="rounded-full hover:bg-gray-700 px-3 py-4 rounded text-[#AE9BD6]">
                      Play Rooms
                    </a>
                  )}
                </>
              )}

              <Dialog open={open} onOpenChange={() => setOpen(!open)}>
                {!userDetail?.dealer && (
                  <DialogTrigger asChild>
                    <Button
                      variant="secondary"
                      className="buttoncss rounded-full bg-gradient-to-r text-color-white from-violet-500 to-fuchsia-500 w-28 mt-2"
                      size="sm"
                      disabled={isDeductLoading}
                    >
                      {isDeductLoading ? (
                        <>
                          <Loader2 className="w-4 h-5 mr-1 animate-spin" /> Please wait
                        </>
                      ) : (
                        'Buy rooms'
                      )}
                    </Button>
                  </DialogTrigger>
                )}
                {
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

                        <Button type="submit" className="w-full buttoncss" disabled={isPending}>
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
                }
              </Dialog>
              <Button
                variant="secondary"
                className="buttoncss rounded-full bg-gradient-to-r text-color-white from-violet-500 to-fuchsia-500 w-15 mt-2"
                size="sm"
                disabled={isDeductLoading}
                onClick={() => {
                  handleLogout();
                  window.location.reload();
                }}
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <LoginDialog>
                <Button className="buttoncss rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 w-28 mt-1">
                  LOGIN
                </Button>
              </LoginDialog>
              <RegisterDialog>
                <Button className="buttoncss rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 w-28 mt-1">
                  JOIN
                </Button>
              </RegisterDialog>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button onClick={toggleMenu} className="md:hidden text-white focus:outline-none">
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden ${isOpen ? 'block' : 'hidden'} bg-gray-800`}>
        <a href="#" className="block px-4 py-2 text-white rounded-full hover:bg-gray-700">
          Home
        </a>
        <a href="#" className="block px-4 py-2 text-white rounded-full hover:bg-gray-700">
          About
        </a>
        <a href="#" className="block px-4 py-2 text-white rounded-full hover:bg-gray-700">
          Services
        </a>
        <a href="#" className="block px-4 py-2 text-white rounded-full hover:bg-gray-700">
          Contact
        </a>
      </div>
    </nav>
  );
};

export default Navbar;
