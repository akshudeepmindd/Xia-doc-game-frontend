import LoginDialog from '@/components/login-dialog';
import Logo from '@/components/logo';
import Register from '@/components/register-dialog';
import { Button, buttonVariants } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import useProfile from '@/hooks/useProfile';
import useTokenTransfer from '@/hooks/useTokenTransfer';
import { setAuthToken } from '@/services';
import { createRoom } from '@/services/room';
import { useMutation } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, Outlet, createFileRoute } from '@tanstack/react-router';
import { addHours } from 'date-fns';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';

const CreateRoom = z.object({
  name: z.string().min(1, "Room name is required"),
  password: z.string(),
  roomType: z.enum(["private", "public"]),
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
}).refine(data => {
  if (data.roomType === "private") {
    return !!data.password
  }
  return true
}, {
  message: "Password length should be at least 6",
  path: ["password"]
})

const BaseLayoutComponent = () => {
  const { username, roomOwner, userId } = useProfile();
  const { mutateAsync: purchaseRoom } = useMutation({
    mutationFn: createRoom
  })
  const { isPending, sendToken } = useTokenTransfer({
    onError: (massage) => {
      console.log(massage)
    },
    onSuccess: async (response: z.infer<typeof CreateRoom>) => {
      const rules = []
      rules.push({
        even: response.even,
        odd: response.odd,
        '4-white-0-red': response['4-white-0-red'],
        '4-red-0-white': response['4-red-0-white'],
        '3-white-1-red': response['3-white-1-red'],
        '3-red-1-white': response['3-red-1-white'],
        'even-9-10': response['even-9-10'],
        'even-10-9': response['even-10-9'],
        'odd-9-10': response['odd-9-10'],
        'odd-10-9': response['odd-10-9'],
      })

      const payload = {
        name: response.name,
        password: response.password,
        startTime: new Date(),
        endTime: addHours(new Date(), 5),
        status: "active",
        owner: userId,
        roomType: response.roomType,
        houseEdgeFee: +response.houseEdgeFee,
        rules: rules,
      }
      await purchaseRoom(payload) // API call for purchase room
    }
  });
  const form = useForm<z.infer<typeof CreateRoom>>({
    resolver: zodResolver(CreateRoom),
    defaultValues: {
      name: "",
      password: "",
      roomType: 'private'
    }
  })
  const handleLogout = () => setAuthToken();
  const handleBuyRoom = async (data: z.infer<typeof CreateRoom>) => {
    try {
      await sendToken("0x3C0a4590701059C198Be9B02A527EE2e7b407CB5", 0.1, data) // Address of admin who'll get the amount
    } catch (error) {
      console.log("handleBuyRoom-Error", error)
    }
  }

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
              </>
            )}
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="secondary" size="sm" disabled={isPending}>
                  {isPending ? <><Loader2 className='w-4 h-5 mr-1 animate-spin' /> Please wait</> : "Buy rooms"}
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogTitle>
                  Buy Room
                </DialogTitle>
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

                    {form.getValues("roomType") === "private" && <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem className="relative">
                          <FormLabel>Room password</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter password" type='password' {...field} />
                          </FormControl>
                          <FormMessage className="text-xs" />
                        </FormItem>
                      )}
                    />}

                    <FormField
                      control={form.control}
                      name="roomType"
                      render={({ field }) => (
                        <FormItem className="relative">
                          <FormLabel>Room Type</FormLabel>
                          <FormControl>
                            <RadioGroup onValueChange={field.onChange}
                              defaultValue={field.value} orientation='horizontal' className='flex items-center'>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="private" id="r1" />
                                <Label htmlFor="r1">Private</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="public" id="r2" />
                                <Label htmlFor="r2">Public</Label>
                              </div>
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
                            <Input placeholder="Enter House Edge fee" type='text' {...field} />
                          </FormControl>
                          <FormMessage className="text-xs" />
                        </FormItem>
                      )}
                    />

                    <div className='flex flex-col gap-y-2 mt-2'>
                      <Label className='text-lg'>
                        Set rules for the Room
                      </Label>
                      <div className='w-full grid grid-cols-2 gap-3 gap-x-2'>
                        <FormField
                          control={form.control}
                          name="even"
                          render={({ field }) => (
                            <FormItem className="relative">
                              {/* <FormLabel>Even</FormLabel> */}
                              <FormControl>
                                <Input placeholder="Enter rule for even" type='text' {...field} />
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
                                <Input placeholder="Enter rule for odd" type='text' {...field} />
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
                                <Input placeholder="Enter rule for 4 white 0 red" type='text' {...field} />
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
                                <Input placeholder="Enter rule for 4 red 0 white" type='text' {...field} />
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
                                <Input placeholder="Enter rule for 3 white 1 red" type='text' {...field} />
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
                                <Input placeholder="Enter rule for 3 red 1 white" type='text' {...field} />
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
                                <Input placeholder="Enter rule for even 10:9" type='text' {...field} />
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
                                <Input placeholder="Enter rule for even 9:10" type='text' {...field} />
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
                                <Input placeholder="Enter rule for odd 10:9" type='text' {...field} />
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
                                <Input placeholder="Enter rule for 9:10" type='text' {...field} />
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
                        'Register'
                      )}
                    </Button>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>

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
