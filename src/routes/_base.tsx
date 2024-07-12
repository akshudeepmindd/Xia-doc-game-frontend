import LoginDialog from '@/components/login-dialog';
import Logo from '@/components/logo';
import Register from '@/components/register-dialog';
import { Button, buttonVariants } from '@/components/ui/button';
import useProfile from '@/hooks/useProfile';
import useTokenTransfer from '@/hooks/useTokenTransfer';
import { setAuthToken } from '@/services';
import { Link, Outlet, createFileRoute } from '@tanstack/react-router';
import { Loader2 } from 'lucide-react';

const BaseLayoutComponent = () => {
  const { username, roomOwner } = useProfile();
  const { isPending, sendToken } = useTokenTransfer({
    onError: (massage) => {
      console.log(massage)
    },
    onSuccess: () => {
      console.log("Token transfer done")
    }
  });
  const handleLogout = () => setAuthToken();
  const handleBuyRoom = async () => {
    await sendToken("0x3C0a4590701059C198Be9B02A527EE2e7b407CB5", 0.1) // Address of admin who'll get the amount
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
            <Button variant="secondary" size="sm" onClick={handleBuyRoom} disabled={isPending}>
              {isPending ? <><Loader2 className='w-4 h-5 mr-1 animate-spin' /> Please wait</> : "Buy rooms"}
            </Button>
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
