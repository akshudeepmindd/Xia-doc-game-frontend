import LoginDialog from '@/components/login-dialog';
import Logo from '@/components/logo';
import Register from '@/components/register-dialog';
import { Button, buttonVariants } from '@/components/ui/button';
import useProfile from '@/hooks/useProfile';
import { setAuthToken } from '@/services';
import { Link, Outlet, createFileRoute } from '@tanstack/react-router';

const BaseLayoutComponent = () => {
  const { username, roomOwner } = useProfile();

  const handleLogout = () => setAuthToken();

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
