import React, { useState, useEffect, useCallback } from 'react'
import { supabase } from './lib/supabase'
import Auth from './components/Auth'
import TodoApp from './components/TodoApp'
import ThemeToggle from './components/ThemeToggle'
import { Session } from '@supabase/supabase-js'
import { v4 as uuidv4 } from 'uuid' // Import uuid for generating unique IDs

function App() {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [attemptingAnonymousAuth, setAttemptingAnonymousAuth] = useState(false) // New state to prevent re-attempts

  // Function to sign up an anonymous user
  const signUpAnonymous = useCallback(async () => {
    if (attemptingAnonymousAuth) return; // Prevent multiple attempts
    setAttemptingAnonymousAuth(true);
    setLoading(true);

    try {
      const anonymousEmail = `anon-${uuidv4()}@example.com`;
      const anonymousPassword = uuidv4(); // Use UUID as a temporary password

      const { data, error } = await supabase.auth.signUp({
        email: anonymousEmail,
        password: anonymousPassword,
        options: {
          emailRedirectTo: window.location.origin,
          data: { is_anonymous: true } // Optional: Add a flag to user metadata
        }
      });

      if (error) {
        console.error('Error signing up anonymous user:', error.message);
        // If it's a duplicate user error (e.g., if we tried to sign up with the same email twice),
        // we might need a more robust way to check for existing anonymous users.
        // For "temporary" access, creating a new one each time session is lost is acceptable.
      } else if (data.user) {
        console.log('Anonymous user signed up:', data.user.id);
        // The onAuthStateChange listener will pick up this session
      }
    } catch (error: any) {
      console.error('Unexpected error during anonymous signup:', error.message);
    } finally {
      setLoading(false);
      setAttemptingAnonymousAuth(false);
    }
  }, [attemptingAnonymousAuth]);

  useEffect(() => {
    const handleInitialSession = async () => {
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      setSession(currentSession);
      setLoading(false);

      // If no session, attempt to create an anonymous one
      if (!currentSession && !attemptingAnonymousAuth) {
        await signUpAnonymous();
      }
    };

    handleInitialSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      setLoading(false); // Ensure loading is false after any auth state change
    });

    // Cleanup function for Supabase subscription
    return () => {
      subscription.unsubscribe();
    };
  }, [signUpAnonymous, attemptingAnonymousAuth]); // Add signUpAnonymous to dependencies

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <svg className="animate-spin h-12 w-12 text-primary" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p className="ml-4 text-text text-xl">กำลังโหลด...</p>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen">
      <div className="absolute top-4 right-4 z-50">
        <ThemeToggle />
      </div>
      {session ? <TodoApp /> : <Auth />}
    </div>
  )
}

export default App
