import { Toaster } from '@/components/ui/sonner';
import { Outlet, createRootRoute } from '@tanstack/react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

const RootComponent = () => {
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
