// components/auth/auth-route-guard.tsx
'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAppSelector } from '@/store/hook';

const PUBLIC_ROUTES = ['/login'];

type AuthRouteGuardProps = {
  children: React.ReactNode;
};

export function AuthRouteGuard({ children }: AuthRouteGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  useEffect(() => {
    const isPublicRoute = PUBLIC_ROUTES.some((route) =>
      pathname.startsWith(route)
    );

    // If not authenticated and trying to access protected route, redirect to login
    if (!isAuthenticated && !isPublicRoute) {
      router.push('/login');
    }

    // If authenticated and trying to access login, redirect to home
    if (isAuthenticated && isPublicRoute) {
      router.push('/mission');
    }
  }, [isAuthenticated, pathname, router]);

  // Show nothing while checking auth (prevents flash of content)
  if (!isAuthenticated && !PUBLIC_ROUTES.some((route) => pathname.startsWith(route))) {
    return null;
  }

  return <>{children}</>;
}
