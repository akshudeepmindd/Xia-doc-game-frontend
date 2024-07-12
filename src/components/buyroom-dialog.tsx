import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { ReactNode } from "@tanstack/react-router";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form';
import { z } from 'zod';
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "./ui/radio-group"
interface BuyRoomProps{
    children: ReactNode,
    handleSubmit?: (data: {
        name:string,
        password:string,
        startTime:string,
        endTime:string,
        status:string,
        roomType:string,
        owner: string
    }) => void,
    loading?: boolean
}

const buyRoomSchema = z.object({
  name: z.string().min(1, 'Username is required'),
  password: z.string(),
  startTime: z.string().date(),
  endTime: z.string().date(),
  status: z.string(),
  roomType: z.string(),
  owner: z.string()

});
export default function BuyRoom({children,handleSubmit, loading}:BuyRoomProps){
    
    const form = useForm<z.infer<typeof buyRoomSchema>>({
    resolver: zodResolver(buyRoomSchema),
    defaultValues: {
      name: '',
      password: '',
    },
  });
    return (
        <Dialog>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>

                <DialogTitle>Buy Room</DialogTitle>
                </DialogHeader>
             <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="relative">
                  <FormLabel>Room Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter username" {...field} />
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
                  <FormLabel>Start Time</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter password" type="datetime-local" {...field} />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="endTime"
              render={({ field }) => (
                <FormItem className="relative">
                  <FormLabel>End Time</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter password" type="datetime-local" {...field} />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="roomType"
              render={({ field }) => (
                <FormItem className="relative">
                  <FormLabel>Room Type</FormLabel>
                  <FormControl>
                   <RadioGroup defaultValue="public" {...field}>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="public" id="public" />
                        <Label htmlFor="public">Public</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="private" id="private" />
                        <Label htmlFor="private">Private</Label>
                    </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
            {form.getValues('roomType') == "private" && <FormField
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
                        />}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <span className="flex items-center gap-x-1">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Please wait
                </span>
              ) : (
                'Login'
              )}
            </Button>
          </form>
        </Form>
            </DialogContent>
        </Dialog>
    )
}