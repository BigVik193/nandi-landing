'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import type { User, Session, SupabaseClient } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  supabase: SupabaseClient;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: React.ReactNode;
}

// Pages that require authentication
const PROTECTED_ROUTES = [
  '/dashboard',
  '/onboarding',
  '/virtual-items'
];

// Pages that should redirect authenticated users
const PUBLIC_ROUTES = [
  '/auth/signup',
  '/auth/signin',
  '/auth/verify-email'
];

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  const router = useRouter();

  const supabase = createClient();

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      const { data: { session: initialSession } } = await supabase.auth.getSession();
      
      setSession(initialSession);
      setUser(initialSession?.user ?? null);
      setLoading(false);
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.id);
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);

        // Handle auth events
        if (event === 'SIGNED_IN' && session?.user) {
          console.log('User signed in:', session.user.id);
        } else if (event === 'SIGNED_OUT') {
          console.log('User signed out');
          setUser(null);
          setSession(null);
        } else if (event === 'TOKEN_REFRESHED' && session) {
          console.log('Token refreshed for user:', session.user?.id);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  // Handle redirects based on auth state and current route
  useEffect(() => {
    if (loading) return;

    const isProtectedRoute = PROTECTED_ROUTES.some(route => pathname.startsWith(route));
    const isPublicRoute = PUBLIC_ROUTES.some(route => pathname.startsWith(route));

    if (!session && isProtectedRoute) {
      // User is not authenticated but trying to access protected route
      console.log('Redirecting to signin - no session for protected route:', pathname);
      router.push('/auth/signin');
    } else if (session && isPublicRoute) {
      // User is authenticated but on a public route, check onboarding status
      console.log('User authenticated on public route, checking onboarding status:', pathname);
      checkOnboardingStatus();
    }
  }, [session, pathname, loading, router]);

  const checkOnboardingStatus = async () => {
    if (!session?.user) return;

    try {
      const response = await fetch(`/api/developers/${session.user.id}/onboarding-status`);
      
      if (response.ok) {
        const data = await response.json();
        const nextStep = data.onboardingStatus?.nextStep || '/dashboard';
        router.push(nextStep);
      } else {
        // If onboarding status check fails, redirect to onboarding start
        router.push('/onboarding/project');
      }
    } catch (error) {
      console.error('Onboarding status check error:', error);
      // On error, start onboarding from the beginning
      router.push('/onboarding/project');
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Error signing out:', error);
      }
      // Clear local state
      setUser(null);
      setSession(null);
      // Redirect to home page
      router.push('/');
    } catch (error) {
      console.error('Unexpected error during sign out:', error);
    }
  };

  const value = {
    user,
    session,
    loading,
    supabase,
    signOut
  };

  // Show loading state with proper styling while auth is being determined
  if (loading) {
    return (
      <AuthContext.Provider value={value}>
        {children}
      </AuthContext.Provider>
    );
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}