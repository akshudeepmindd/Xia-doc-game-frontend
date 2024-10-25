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
import { Loader2, User2Icon, UserCircle2Icon } from 'lucide-react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '../ui/input';
import useProfile from '@/hooks/useProfile';
import useTokenTransfer from '@/hooks/useTokenTransfer';
import { useForm } from 'react-hook-form';
import { USER_PROFILE } from '@/lib/constants';
import { setAuthToken } from '@/services';
import { userProfile, rechargeXusdt, executePayment } from '@/services/auth';
import { createRoom, deductXusdt } from '@/services/room';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery, useMutation } from '@tanstack/react-query';
import { addHours } from 'date-fns';
import { z } from 'zod';
import { FormattedMessage, useIntl } from 'react-intl';
import { toast } from 'sonner';
const CreateRoom = z
  .object({
    name: z.string().min(1, 'Room name is required'),
    password: z.string(),
    roomType: z.enum(['private', 'public']),
    houseEdgeFee: z.string().min(0).max(100),
    startTime: z.string(),
    '4-white-0-red': z.string().min(0).max(100),
    '4-red-0-white': z.string().min(0).max(100),
    '3-white-1-red': z.string().min(0).max(100),
    '3-red-1-white': z.string().min(0).max(100),
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
  const intl = useIntl();
  const [open, setOpen] = useState(false);
  const [depositeopen, setdepositeopen] = useState(false);
  const [amount, setAmount] = useState(0);
  const [bankDetails, setBankDetails] = useState({
    bankCode: '',
    depositorBankName: '',
    depositorName: '',
    depositorBankAcctNo: '',
    channel: 'qr',
    bankName: '',
  });
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
      startTime: '',
      '4-white-0-red': '12',
      '4-red-0-white': '12',
      '3-white-1-red': '3.3',
      '3-red-1-white': '3.3',
    },
  });

  const { mutateAsync: transferXusdt, isPending: isDeductLoading } = useMutation({
    mutationFn: deductXusdt,
  });
  const { mutateAsync: addtoWallet, isPending: isInitatingPayment } = useMutation({
    mutationFn: executePayment,
  });
  const handleLogout = () => setAuthToken();

  const handleBuyRoom = async (response: z.infer<typeof CreateRoom>) => {
    try {
      // await sendToken("0x3C0a4590701059C198Be9B02A527EE2e7b407CB5", 0.1, data) // Address of admin who'll get the amount
      const rules = [];

      rules.push({
        FOUR_WHITE: response['4-white-0-red'],
        FOUR_BLACK: response['4-red-0-white'],
        THREE_WHITE_ONE_BLACK: response['3-white-1-red'],
        THREE_BLACK_ONE_WHITE: response['3-red-1-white'],
      });

      const payload = {
        name: response.name,
        password: response.password,
        startTime: response.startTime,
        endTime: addHours(new Date(response.startTime), 5),
        status: 'active',
        owner: userId,
        roomType: response.roomType,
        houseEdgeFee: +response.houseEdgeFee,
        SpoRequested: [],
        rules: rules,
      };
      if (userDetail?.user?.walletBalance >= 1000) {
        await transferXusdt({ amount: 1000 });
        await purchaseRoom(payload); // API call for purchase room
        setOpen(false);
      } else {
        toast.error('Insufficent Balance');
      }
    } catch (error) {
      console.log('handleBuyRoom-Error', error);
    }
  };
  const handleWalletRecharge = async () => {
    localStorage.setItem('rechargeAmount', amount);
    const response = addtoWallet({
      amount,
      bankCode: bankDetails.bankCode,
      depositorBankName: bankDetails.depositorBankName,
      depositorName: bankDetails.depositorName,
      depositorBankAcctNo: bankDetails.depositorBankAcctNo,
      userId: localStorage.getItem('userId'),
      channel: bankDetails.channel,
    })
      .then((res) => window.location.replace(res.message.data.payUrl))

      .catch((e) => console.log(e));
    // console.log(amount, 'amount');
    // await sendToken('0xebE3B38b9BADD80452809987E353E03a88C13387', amount);
  };
  const formatmessage = (message: string) => {
    return intl.formatMessage({ id: message });
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
            <FormattedMessage id="app.home" />
          </a>
          <a href="#" className="rounded-full hover:bg-gray-700 px-3 py-4 rounded text-[#AE9BD6]">
            <FormattedMessage id="app.features" />
          </a>
          <a href="#" className="rounded-full hover:bg-gray-700 px-3 py-4 rounded text-[#AE9BD6]">
            <FormattedMessage id="app.pricing" />
          </a>
          {localStorage.getItem('token') ? (
            <>
              {userDetail?.dealer ? (
                <a href="/dealerpanel" className="rounded-full hover:bg-gray-700 px-3 py-4 rounded text-[#AE9BD6]">
                  <FormattedMessage id="app.dashboard" />
                </a>
              ) : (
                <>
                  <a href="/room" className="rounded-full hover:bg-gray-700 px-3 py-4 rounded text-[#AE9BD6]">
                    <FormattedMessage id="app.myrooms" />
                  </a>
                  {userDetail?.user?.role === 'user' && (
                    <a href="/playrooms" className="rounded-full hover:bg-gray-700 px-3 py-4 rounded text-[#AE9BD6]">
                      <FormattedMessage id="app.playrooms" />
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
                          <Loader2 className="w-4 h-5 mr-1 animate-spin" /> <FormattedMessage id="app.pleasewait" />
                        </>
                      ) : (
                        <FormattedMessage id="app.buyroom" />
                      )}
                    </Button>
                  </DialogTrigger>
                )}
                {
                  <DialogContent>
                    <DialogTitle>
                      <FormattedMessage id="app.buyroom" />
                    </DialogTitle>
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(handleBuyRoom)} className="space-y-4 w-full">
                        <FormField
                          control={form.control}
                          name="startTime"
                          render={({ field }) => (
                            <FormItem className="relative">
                              <FormLabel>
                                <FormattedMessage id="app.startdatetime" />
                              </FormLabel>
                              <FormControl>
                                <Input placeholder={formatmessage('app.enterusername')} {...field} />
                              </FormControl>
                              <FormMessage className="text-xs" />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem className="relative">
                              <FormLabel>
                                <FormattedMessage id="app.startdatetime" />
                              </FormLabel>
                              <FormControl>
                                <Input placeholder={formatmessage('app.enterusername')} {...field} />
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
                                <FormLabel>
                                  <FormattedMessage id="app.roompassword" />
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder={intl.formatMessage({ id: 'app.enterpassword' })}
                                    type="password"
                                    {...field}
                                  />
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
                              <FormLabel>
                                <FormattedMessage id="app.roomtype" />
                              </FormLabel>
                              <FormControl>
                                <RadioGroup
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                  orientation="horizontal"
                                  className="flex items-center"
                                >
                                  <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="private" id="r1" />
                                    <Label htmlFor="r1">
                                      <FormattedMessage id="app.private" />
                                    </Label>
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
                              <FormLabel>
                                <FormattedMessage id="app.houseedgefee" />
                              </FormLabel>
                              <FormControl>
                                <Input placeholder={formatmessage('app.enterhouseedgefee')} type="text" {...field} />
                              </FormControl>
                              <FormMessage className="text-xs" />
                            </FormItem>
                          )}
                        />

                        <div className="flex flex-col gap-y-2 mt-2">
                          <Label className="text-lg">
                            <FormattedMessage id="app.setrules" />
                          </Label>
                          <div className="w-full grid grid-cols-2 gap-3 gap-x-2">
                            <FormField
                              control={form.control}
                              name="4-white-0-red"
                              render={({ field }) => (
                                <FormItem className="relative">
                                  {/* <FormLabel>4 White 0 Red</FormLabel> */}
                                  <FormControl>
                                    <Input
                                      placeholder={formatmessage('app.enterfourwhiterule')}
                                      type="text"
                                      {...field}
                                    />
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
                                    <Input
                                      placeholder={formatmessage('app.enterfourblackrule')}
                                      type="text"
                                      {...field}
                                    />
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
                                    <Input
                                      placeholder={formatmessage('app.enterthreewhiterule')}
                                      type="text"
                                      {...field}
                                    />
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
                                    <Input
                                      placeholder={formatmessage('app.enterthreeredrule')}
                                      type="text"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage className="text-xs" />
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>

                        <Button type="submit" className="w-full buttoncss" disabled={isPending}>
                          {isDeductLoading ? (
                            <span className="flex items-center gap-x-1">
                              <Loader2 className="w-4 h-4 animate-spin" />
                              <FormattedMessage id="app.pleasewait" />
                            </span>
                          ) : (
                            <FormattedMessage id="app.buyroom" />
                          )}
                        </Button>
                      </form>
                    </Form>
                  </DialogContent>
                }
              </Dialog>
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
                    <DialogTitle>
                      {' '}
                      <FormattedMessage id="app.deposite" />
                    </DialogTitle>
                    <DialogDescription>
                      <FormattedMessage id="app.depositetext" />
                    </DialogDescription>
                  </DialogHeader>
                  <label>Amount (Minimum - 200000VND)</label>
                  <Input type="number" onChange={(e) => setAmount(parseInt(e.target.value))} min={200000} />
                  <select>
                    <option defaultChecked>Select Channel</option>
                    <option value={'qr'}>QR</option>
                    {/* <option value={'direct'}>Direct</option> */}
                    <option value={'c2c'}>C2C</option>
                  </select>
                  <Button
                    onClick={() => handleWalletRecharge()}
                    className="w-full buttoncss"
                    disabled={RechargewalletPending}
                  >
                    {RechargewalletPending ? (
                      <span className="flex items-center gap-x-1">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <FormattedMessage id="app.depositpending" />
                      </span>
                    ) : (
                      <FormattedMessage id="app.submit" />
                    )}
                  </Button>
                </DialogContent>
              </Dialog>
              <div className="mt-3 flex justify-between ">
                <a href="/profile">
                  <UserCircle2Icon size={30} />
                </a>
                <p className="pl-2">{userDetail?.user?.telegramusername}</p>
              </div>
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
                <FormattedMessage id="app.logout" />
              </Button>
            </>
          ) : (
            <>
              <LoginDialog>
                <Button className="buttoncss rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 w-28 mt-1">
                  <FormattedMessage id="app.login" />
                </Button>
              </LoginDialog>
              <RegisterDialog>
                <Button className="buttoncss rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 w-28 mt-1">
                  <FormattedMessage id="app.join" />
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
        <div className="flex flex-col justify-center items-center">
          <a href="/" className="rounded-full rounded-full hover:bg-gray-700 px-3 py-4 rounded text-[#AE9BD6] px-1">
            <FormattedMessage id="app.home" />
          </a>
          <a href="#" className="rounded-full hover:bg-gray-700 px-3 py-4 rounded text-[#AE9BD6]">
            <FormattedMessage id="app.features" />
          </a>
          <a href="#" className="rounded-full hover:bg-gray-700 px-3 py-4 rounded text-[#AE9BD6]">
            <FormattedMessage id="app.pricing" />
          </a>
        </div>

        {localStorage.getItem('token') ? (
          <>
            <div className="flex flex-col justify-center items-center">
              {userDetail?.dealer ? (
                <a href="/dealerpanel" className="rounded-full hover:bg-gray-700 px-3 py-4 rounded text-[#AE9BD6]">
                  <FormattedMessage id="app.dashboard" />
                </a>
              ) : (
                <>
                  <a href="/room" className="rounded-full hover:bg-gray-700 px-3 py-4 rounded text-[#AE9BD6]">
                    <FormattedMessage id="app.myrooms" />
                  </a>
                  {userDetail?.user?.role === 'user' && (
                    <a href="/playrooms" className="rounded-full hover:bg-gray-700 px-3 py-4 rounded text-[#AE9BD6]">
                      <FormattedMessage id="app.playrooms" />
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
                          <Loader2 className="w-4 h-5 mr-1 animate-spin" /> <FormattedMessage id="app.pleasewait" />
                        </>
                      ) : (
                        <FormattedMessage id="app.buyroom" />
                      )}
                    </Button>
                  </DialogTrigger>
                )}
                {
                  <DialogContent>
                    <DialogTitle className="flex justify-around">
                      <FormattedMessage id="app.buyroom" />
                      <p className="text-sm font-normal">
                        <FormattedMessage id="app.priceperroom" />: <span className="font-bold text-md">1000xUSDT</span>
                      </p>
                    </DialogTitle>
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(handleBuyRoom)} className="space-y-4 w-full">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem className="relative">
                              <FormLabel>
                                <FormattedMessage id="app.roomname" />
                              </FormLabel>
                              <FormControl>
                                <Input placeholder={formatmessage('app.enterusername')} {...field} />
                              </FormControl>
                              <FormMessage className="text-xs" />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="startTime"
                          render={({ field }) => (
                            <FormItem className="relative">
                              <FormLabel>
                                <FormattedMessage id="app.startdatetime" />
                              </FormLabel>
                              <FormControl>
                                <Input
                                  type="datetime-local"
                                  placeholder={formatmessage('app.enterusername')}
                                  {...field}
                                />
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
                                <FormLabel>
                                  <FormattedMessage id="app.roompassword" />
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder={intl.formatMessage({ id: 'app.enterpassword' })}
                                    type="password"
                                    {...field}
                                  />
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
                              <FormLabel>
                                <FormattedMessage id="app.roomtype" />
                              </FormLabel>
                              <FormControl>
                                <RadioGroup
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                  orientation="horizontal"
                                  className="flex items-center"
                                >
                                  <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="private" id="r1" />
                                    <Label htmlFor="r1">
                                      <FormattedMessage id="app.private" />
                                    </Label>
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
                              <FormLabel>
                                <FormattedMessage id="app.houseedgefee" />
                              </FormLabel>
                              <FormControl>
                                <Input placeholder={formatmessage('app.enterhouseedgefee')} type="text" {...field} />
                              </FormControl>
                              <FormMessage className="text-xs" />
                            </FormItem>
                          )}
                        />

                        <div className="flex flex-col gap-y-2 mt-2">
                          <Label className="text-lg">
                            <FormattedMessage id="app.setrules" />
                          </Label>
                          <div className="w-full grid grid-cols-2 gap-3 gap-x-2">
                            <FormField
                              control={form.control}
                              name="4-white-0-red"
                              render={({ field }) => (
                                <FormItem className="relative">
                                  {/* <FormLabel>4 White 0 Red</FormLabel> */}
                                  <FormControl>
                                    <Input
                                      placeholder={formatmessage('app.enterfourwhiterule')}
                                      type="text"
                                      {...field}
                                    />
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
                                    <Input
                                      placeholder={formatmessage('app.enterfourblackrule')}
                                      type="text"
                                      defaultValue={12}
                                      {...field}
                                    />
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
                                    <Input
                                      placeholder={formatmessage('app.enterthreewhiterule')}
                                      type="text"
                                      defaultValue={3.3}
                                      {...field}
                                    />
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
                                    <Input
                                      placeholder={formatmessage('app.enterthreeredrule')}
                                      type="text"
                                      defaultValue={3.3}
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage className="text-xs" />
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>

                        <Button type="submit" className="w-full buttoncss" disabled={isPending}>
                          {isDeductLoading ? (
                            <span className="flex items-center gap-x-1">
                              <Loader2 className="w-4 h-4 animate-spin" />
                              <FormattedMessage id="app.pleasewait" />
                            </span>
                          ) : (
                            <FormattedMessage id="app.buyroom" />
                          )}
                        </Button>
                      </form>
                    </Form>
                  </DialogContent>
                }
              </Dialog>
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
                    <DialogTitle>
                      {' '}
                      <FormattedMessage id="app.deposite" />
                    </DialogTitle>
                    <DialogDescription>
                      <FormattedMessage id="app.depositetext" />
                    </DialogDescription>
                  </DialogHeader>
                  <label>
                    Amount <span className="text-xs">(Minimum - 200000VND)</span>
                  </label>
                  <Input type="number" onChange={(e) => setAmount(parseInt(e.target.value))} min={200000} />
                  <select onChange={(e) => setBankDetails({ ...bankDetails, channel: e.target.value })}>
                    <option defaultChecked>Select Channel</option>
                    <option value={'qr'}>QR</option>
                    {/* <option value={'direct'}>Direct</option> */}
                    <option value={'c2c'}>C2C</option>
                  </select>
                  <Button
                    onClick={() => handleWalletRecharge()}
                    className="w-full buttoncss"
                    disabled={RechargewalletPending}
                  >
                    {RechargewalletPending ? (
                      <span className="flex items-center gap-x-1">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <FormattedMessage id="app.depositpending" />
                      </span>
                    ) : (
                      <FormattedMessage id="app.submit" />
                    )}
                  </Button>
                </DialogContent>
              </Dialog>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <User2Icon size={20} className="" />
                <p className="pl-2 pt-2">{userDetail?.user?.telegramusername}</p>
              </div>
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
                <FormattedMessage id="app.logout" />
              </Button>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center gap-y-3">
            {/* <> */}
            <LoginDialog>
              <Button className="buttoncss rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 w-28 mt-1">
                <FormattedMessage id="app.login" />
              </Button>
            </LoginDialog>
            <RegisterDialog>
              <Button className="buttoncss rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 w-28 mt-1">
                <FormattedMessage id="app.join" />
              </Button>
            </RegisterDialog>
            {/* </> */}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
