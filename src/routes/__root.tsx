import { Toaster } from '@/components/ui/sonner';
import { Outlet, createRootRoute } from '@tanstack/react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useConnector } from '@usedapp/core';
import { useEffect } from 'react';
import '../styles/common.css';
const queryClient = new QueryClient();

const RootComponent = () => {
  const { activateBrowserWallet, account } = useConnector();

  useEffect(() => {
    if (!account) {
      activateBrowserWallet();
    }
  }, [])

  return (
    <QueryClientProvider client={queryClient}>
      <Toaster position="top-right" />
      <Outlet />
    </QueryClientProvider>
  );
};

export const Route = createRootRoute({
  component: RootComponent,
});
