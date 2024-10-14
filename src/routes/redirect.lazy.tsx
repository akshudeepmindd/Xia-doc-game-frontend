import { createLazyFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react';

export default function PaymentRedirect() {
  const [paymentStatus, setPaymentStatus] = useState('');
  useEffect(() => {
    function ExtractStatus() {
      const url = window.location.href.split('?')[1];
      if (url.split('=')[1] == '1') {
        setPaymentStatus('1');
      } else {
        setPaymentStatus('0');
      }
    }
    ExtractStatus();
  });
  return <h1>Redirect</h1>;
}
export const Route = createLazyFileRoute('/redirect')({
  component: () => <PaymentRedirect />,
});