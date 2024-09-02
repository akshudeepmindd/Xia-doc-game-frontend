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
  // const { username, roomOwner, userId } = useProfile();
  // const { isLoading: isLoading3, data: userDetail } = useQuery({
  //   queryKey: [USER_PROFILE],
  //   queryFn: () => userProfile(userId),
  //   enabled: !!userId,
  //   refetchInterval: 2000,
  //   refetchIntervalInBackground: true,
  // });
  // const [open, setOpen] = useState(false);
  // const [depositeopen, setdepositeopen] = useState(false);
  // const [amount, setAmount] = useState(0);
  // const { mutateAsync: purchaseRoom } = useMutation({
  //   mutationFn: createRoom,
  // });
  // const { mutateAsync: rechargewallet, isPending: RechargewalletPending } = useMutation({
  //   mutationFn: rechargeXusdt,
  // });
  // const { isPending, sendToken } = useTokenTransfer({
  //   onError: (massage) => {
  //     console.log(massage);
  //   },
  //   onSuccess: async (response: z.infer<typeof CreateRoom>) => {
  //     rechargewallet({ amount });
  //     setdepositeopen(false);
  //   },
  // });
  // const form = useForm<z.infer<typeof CreateRoom>>({
  //   resolver: zodResolver(CreateRoom),
  //   defaultValues: {
  //     name: '',
  //     password: '',
  //     roomType: 'private',
  //   },
  // });

  // const { mutateAsync: transferXusdt, isPending: isDeductLoading } = useMutation({
  //   mutationFn: deductXusdt,
  // });

  // const handleLogout = () => setAuthToken();

  // const handleBuyRoom = async (response: z.infer<typeof CreateRoom>) => {
  //   try {
  //     // await sendToken("0x3C0a4590701059C198Be9B02A527EE2e7b407CB5", 0.1, data) // Address of admin who'll get the amount
  //     const rules = [];

  //     rules.push({
  //       EVEN: response.even,
  //       ODD: response.odd,
  //       FOUR_WHITE: response['4-white-0-red'],
  //       FOUR_BLACK: response['4-red-0-white'],
  //       THREE_WHITE_ONE_BLACK: response['3-white-1-red'],
  //       THREE_BLACK_ONE_WHITE: response['3-red-1-white'],
  //       EVEN_NINE_TEN: response['even-9-10'],
  //       EVEN_TEN_NINE: response['even-10-9'],
  //       ODD_TEN_NINE: response['odd-9-10'],
  //       ODD_NINE_TEN: response['odd-10-9'],
  //     });

  //     const payload = {
  //       name: response.name,
  //       password: response.password,
  //       startTime: new Date(),
  //       endTime: addHours(new Date(), 5),
  //       status: 'active',
  //       owner: userId,
  //       roomType: response.roomType,
  //       houseEdgeFee: +response.houseEdgeFee,
  //       SpoRequested: [],
  //       rules: rules,
  //     };

  //     await transferXusdt({ amount: 1000 });
  //     await purchaseRoom(payload); // API call for purchase room
  //     setOpen(false);
  //   } catch (error) {
  //     console.log('handleBuyRoom-Error', error);
  //   }
  // };
  // const handleWalletRecharge = async () => {
  //   console.log(amount, 'amount');
  //   await sendToken('0xebE3B38b9BADD80452809987E353E03a88C13387', amount);
  // };
  return (
    <div className="flex flex-col min-h-screen">
      <div className="h-screen">
        <Outlet />
      </div>
    </div>
  );
};

export const Route = createFileRoute('/_base')({
  component: BaseLayoutComponent,
});
