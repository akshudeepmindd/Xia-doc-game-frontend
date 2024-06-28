import { Loader2 } from 'lucide-react';
import { Card, CardContent, CardFooter } from './ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import useProfile from '@/hooks/useProfile';
import { useMutation, useQuery } from '@tanstack/react-query';
import { getRooms, roomJoinRequest, roomRequestStatus } from '@/services/room';
import { GET_REQUEST_STATUS, GET_ROOM } from '@/lib/constants';
import { useEffect } from 'react';
import { toast } from 'sonner';
import { useNavigate } from '@tanstack/react-router';

const GamesGrid = () => {
  const { userId } = useProfile();
  const navigate = useNavigate();

  const { isLoading, data: roomDetail } = useQuery({
    queryKey: [GET_ROOM],
    queryFn: () => getRooms(userId),
    enabled: !!userId,
  });

  const { isLoading: isLoading2, data: requestStatus } = useQuery({
    queryKey: [GET_REQUEST_STATUS],
    queryFn: () => roomRequestStatus({ userId, roomId: roomDetail.message._id }),
    enabled: !isLoading,
    refetchInterval: 2000,
    refetchIntervalInBackground: true,
  });

  const joinRequest = useMutation({
    mutationFn: roomJoinRequest,
  });

  useEffect(() => {
    if (userId === roomDetail?.message?.dealer) {
      console.log(roomDetail?.message?.dealer, 'DEALER');
      navigate({ to: `/dealer/${roomDetail?.message?._id}` });
      return;
    }

    if (!isLoading2) {
      if (requestStatus?.status === 'ACCEPTED') {
        navigate({ to: `/play/${roomDetail.message._id}` });
      } else if (requestStatus?.status === 'REJECTED') {
        toast.error('Your request has been rejected. Please try again later');
      }
    }
  }, [requestStatus?.status, isLoading2, roomDetail]);

  if (isLoading) return <>Loading...</>;

  return (
    <div className="grid grid-cols-4 w-full">
      <Dialog open={requestStatus?.status === 'PENDING'}>
        <DialogTrigger asChild>
          <Card
            className="w-full h-[28rem]"
            onClick={() => joinRequest.mutate({ userId, roomId: roomDetail.message._id })}
          >
            <CardContent className="p-0 h-96 overflow-hidden rounded">
              <img className="w-full" src="/xoc-dia-thumbnail.jpg" alt="xoc-dia" />
            </CardContent>
            <CardFooter className="py-4">
              <div className="flex items-center">
                <span className="text-lg font-semibold">Xoc Dia</span>
              </div>
            </CardFooter>
          </Card>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader className="flex flex-row items-center gap-x-4">
            <div>
              <Loader2 className="w-8 h-8 animate-spin" />
            </div>
            <div>
              <DialogTitle>Your request has been sent to the Admin</DialogTitle>
              <DialogDescription>Thank you for your interest. We will get back to you soon.</DialogDescription>
            </div>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GamesGrid;
