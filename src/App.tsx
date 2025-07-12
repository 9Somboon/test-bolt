import React, { useState, useEffect, useCallback } from 'react'
import { supabase } from './lib/supabase'
import Auth from './components/Auth'
import TodoApp from './components/TodoApp'
import ThemeToggle from './components/ThemeToggle'
import { Session } from '@supabase/supabase-js'
import { v4 as uuidv4 } from 'uuid'

function App() {
  const [session, setSession] = useState<Session | null>(null)
  const [isLoadingAuth, setIsLoadingAuth] = useState(true) // True initially, until auth state is determined
  const [hasAttemptedAnonymousSignup, setHasAttemptedAnonymousSignup] = useState(false); // New state to prevent multiple anonymous signups

  // Function to sign up an anonymous user
  const signUpAnonymous = useCallback(async () => {
    if (hasAttemptedAnonymousSignup) {
      // Prevent multiple attempts if already tried
      console.log('Anonymous signup already attempted, skipping.');
      return;
    }
    setHasAttemptedAnonymousSignup(true); // Mark that we are attempting anonymous signup

    try {
      const anonymousEmail = `anon-${uuidv4()}@example.com`;
      const anonymousPassword = uuidv4();

      console.log('Attempting anonymous signup...');
      const { data, error } = await supabase.auth.signUp({
        email: anonymousEmail,
        password: anonymousPassword,
        options: {
          emailRedirectTo: window.location.origin,
          data: { is_anonymous: true }
        }
      });

      if (error) {
        console.error('Error signing up anonymous user:', error.message);
        // If signup fails, onAuthStateChange will still fire with null session,
        // and Auth component will be shown.
      } else if (data.user) {
        console.log('Anonymous user signed up:', data.user.id);
        // The onAuthStateChange listener will pick this up and update session.
      }
    } catch (error: any) {
      console.error('Unexpected error during anonymous signup:', error.message);
    }
    // CRITICAL: Do NOT set isLoadingAuth or session here.
    // The onAuthStateChange listener is the single source of truth for the final state.
  }, [hasAttemptedAnonymousSignup]); // Dependency to ensure it only runs once per attempt

  useEffect(() => {
    let isMounted = true; // Flag to prevent state updates on unmounted component

    // This function's primary role is to kick off the initial session check
    // and anonymous signup if needed. It does NOT manage loading states directly.
    const initializeAuthFlow = async () => {
      console.log('Initializing auth flow...');
      // Get initial session. This call is crucial as it ensures
      // onAuthStateChange is triggered with the current session state.
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      if (!isMounted) return;

      // If no session, attempt anonymous signup.
      // We await this call to ensure the signup process is initiated
      // before the `initializeAuthFlow` function completes.
      // The actual session update and loading state change will happen in onAuthStateChange.
      if (!currentSession) {
        console.log('No current session, attempting anonymous signup...');
        await signUpAnonymous();
        if (!isMounted) return;
      } else {
        console.log('Existing session found:', currentSession.user?.id);
        // If there's an existing session, onAuthStateChange will still fire
        // with this session, and that's where we'll set isLoadingAuth to false.
      }
      // Do NOT set isLoadingAuth = false here. Let onAuthStateChange handle it.
    };

    initializeAuthFlow(); // Start the initial authentication flow

    // Set up the real-time auth state change listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      if (!isMounted) return;
      console.log('onAuthStateChange event:', _event, 'newSession:', newSession?.user?.id);

      setSession(newSession); // Always update session based on the latest state from Supabase

      // This is the definitive point where we know the initial auth process is complete.
      // Whether a session exists (newly created anonymous or existing) or not,
      // Supabase has determined the state, so we can stop loading.
      setIsLoadingAuth(false); // Auth process is complete, stop loading
    });

    // Cleanup function for Supabase subscription and mounted flag
    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [signUpAnonymous]); // Dependency is correct

  // Display loading spinner until the initial authentication process is complete.
  // isLoadingAuth will be true until onAuthStateChange fires for the first time.
  if (isLoadingAuth) {
    console.log('Rendering loading spinner...');
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

  // Once isLoadingAuth is false, render Auth or TodoApp based on session.
  // If session is null (e.g., anonymous signup failed), Auth component will be shown.
  console.log('Rendering main app, session:', session?.user?.id ? 'exists' : 'none');
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
