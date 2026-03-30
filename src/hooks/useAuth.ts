import { supabase } from "@/lib/supabase";
import { Session, User } from "@supabase/supabase-js";
import { useEffect, useState } from "react";

interface AuthState {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
}

export function useAuth(): AuthState {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // get current session on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setIsLoading(false);
    });

    // listen for auth changes (login, logout, token refresh)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setIsLoading(false);
    });

    // cleanup subscription on unmount
    return () => subscription.unsubscribe();
  }, []);

  return { user: session?.user ?? null, session, isLoading };
}
