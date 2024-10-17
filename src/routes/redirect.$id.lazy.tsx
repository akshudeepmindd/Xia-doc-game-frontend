import Navbar from '@/components/common/navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader } from '@/components/ui/card';
import { rechargeXusdt } from '@/services/auth';
import { useMutation } from '@tanstack/react-query';
import { createLazyFileRoute } from '@tanstack/react-router';
import { useEffect, useState } from 'react';

export default function PaymentRedirect() {
  const [paymentStatus, setPaymentStatus] = useState('');
  const { mutateAsync: rechargewallet, isPending: RechargewalletPending } = useMutation({
    mutationFn: rechargeXusdt,
  });
  useEffect(() => {
    function ExtractStatus() {
      const url = window.location.href.split('?')[1];
      if (url.split('=')[1] == '1') {
        setPaymentStatus('1');
        const amount = localStorage.getItem('rechargeAmount');
        rechargeXusdt({ amount });
      } else {
        setPaymentStatus('0');
      }
    }
    ExtractStatus();
  });
  return (
    <div className="bg-auto bg-no-repeat bg-center bg-cover bg-[url('/bigbg.png')] pb-10">
      <Navbar />
      <div className="relative h-screen bg-auto bg-no-repeat bg-center bg-cover bg-[url('/bg.png')]">
        <div className="flex justify-center items-center flex-col h-full px-4 sm:px-6 md:px-8 lg:px-12">
          <Card>
            <CardDescription className="text-bold text-2xl pt-2 text-center">Payment Status</CardDescription>
            <CardContent>
              <CardHeader>
                {paymentStatus == '1' ? 'Payment SuccessFull' : 'Payment Either Declined or Cancelled by User'}
              </CardHeader>
              <CardDescription className="pl-2 text-justify">
                {paymentStatus == '1'
                  ? 'Payment is SuccessFully Done. Please check your wallet if amount is added to ur wallet'
                  : 'Payment is Unsuccessfull'}
              </CardDescription>
            </CardContent>
            <CardFooter>
              <Button className="flex-end" onClick={() => (window.location.href = '/')}>
                Go to Home
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
export const Route = createLazyFileRoute('/redirect/$id')({
  component: () => <PaymentRedirect />,
});
