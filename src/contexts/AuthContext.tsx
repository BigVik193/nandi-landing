'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import type { User, Session, SupabaseClient } from '@supabase/supabase-js';

interface Game {
  id: string;
  name: string;
  bundle_id: string;
  platform: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  games: Game[];
  selectedGame: Game | null;
  loading: boolean;
  supabase: SupabaseClient;
  signOut: () => Promise<void>;
  selectGame: (game: Game) => void;
  refreshGames: () => Promise<void>;
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
  const [games, setGames] = useState<Game[]>([]);
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  const router = useRouter();

  const supabase = createClient();

  // Fetch user's games
  const fetchUserGames = async (userId: string) => {
    try {
      const response = await fetch(`/api/developers/${userId}/games`);
      if (response.ok) {
        const data = await response.json();
        setGames(data.games);
        
        // Auto-select the first game if none is selected
        if (data.games.length > 0 && !selectedGame) {
          setSelectedGame(data.games[0]);
          console.log('Auto-selected first game:', data.games[0]);
        }
        
        console.log('User games loaded:', data.games.length);
      } else if (response.status === 404) {
        // User doesn't have games yet (expected for new users)
        console.log('No games found for user, will be set during onboarding');
        setGames([]);
        setSelectedGame(null);
      } else {
        console.error('Unexpected error fetching games:', response.status);
        setGames([]);
        setSelectedGame(null);
      }
    } catch (error) {
      console.error('Error fetching user games:', error);
      setGames([]);
      setSelectedGame(null);
    }
  };

  const refreshGames = async () => {
    if (user) {
      await fetchUserGames(user.id);
    }
  };

  const selectGame = (game: Game) => {
    setSelectedGame(game);
    console.log('Selected game:', game);
  };

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      const { data: { session: initialSession } } = await supabase.auth.getSession();
      
      setSession(initialSession);
      setUser(initialSession?.user ?? null);
      
      // Fetch games if user is authenticated
      if (initialSession?.user) {
        await fetchUserGames(initialSession.user.id);
      }
      
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
          await fetchUserGames(session.user.id);
        } else if (event === 'SIGNED_OUT' || (!session && event !== 'INITIAL_SESSION')) {
          console.log('User signed out or session expired');
          setUser(null);
          setSession(null);
          setGames([]);
          setSelectedGame(null);
        } else if (event === 'TOKEN_REFRESHED' && session) {
          console.log('Token refreshed for user:', session.user?.id);
          if (session.user && games.length === 0) {
            await fetchUserGames(session.user.id);
          }
        } else if (!session && user) {
          // Handle case where session becomes null but user still exists in state
          console.log('Session expired - clearing user state');
          setUser(null);
          setSession(null);
          setGames([]);
          setSelectedGame(null);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  // Periodic session validation
  useEffect(() => {
    if (!session) return;

    const checkSession = async () => {
      try {
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        if (!currentSession && session) {
          console.log('Session validation failed - session expired');
          setUser(null);
          setSession(null);
          setGames([]);
          setSelectedGame(null);
        }
      } catch (error) {
        console.error('Session validation error:', error);
        // On error, assume session is invalid
        setUser(null);
        setSession(null);
        setGames([]);
        setSelectedGame(null);
      }
    };

    // Check session validity every 5 minutes
    const interval = setInterval(checkSession, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [session, supabase.auth]);

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
      // User is authenticated but on a public route, redirect to dashboard
      console.log('User authenticated on public route, redirecting to dashboard:', pathname);
      router.push('/dashboard');
    }
  }, [session, pathname, loading, router]);



  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Error signing out:', error);
      }
      // Clear local state
      setUser(null);
      setSession(null);
      setGames([]);
      setSelectedGame(null);
      // Redirect to home page
      router.push('/');
    } catch (error) {
      console.error('Unexpected error during sign out:', error);
    }
  };

  const value = {
    user,
    session,
    games,
    selectedGame,
    loading,
    supabase,
    signOut,
    selectGame,
    refreshGames
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