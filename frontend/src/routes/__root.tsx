import { createRootRouteWithContext, redirect } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';
import { useAuth } from '../store/auth';
import { FullLayout } from '../components/layout/Fulllayout';
import { BlankLayout } from '../components/layout/BlankLayout';
import { LoadingPage } from '../components/ui/Loading';

interface RouterContext {
  auth: ReturnType<typeof useAuth>;
}

export const Route = createRootRouteWithContext<RouterContext>()({
  // beforeLoad: ({ context, location }) => {
  //   if (!context.auth.isAuthenticated && 
  //       !location.pathname.startsWith('/login') && 
  //       !location.pathname.startsWith('/register')) {
  //     throw redirect({ to: '/login' });
  //   }
  //    // Redirect authenticated users away from auth pages
  //   if (context.auth.isAuthenticated && 
  //       (location.pathname.startsWith('/login') || location.pathname.startsWith('/register'))) {
  //     throw redirect({ to: '/' });
  //   }
  // },
  component: RootComponent,
});

function RootComponent() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingPage message="Initializing..." />;
  }

  return (
    <>
      {isAuthenticated ? <FullLayout /> : <BlankLayout />}
      <TanStackRouterDevtools />
    </>
  );
}
