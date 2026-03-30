import { supabase } from "@/lib/supabase";

export async function signInWithEmail(
  email: string,
  password: string,
): Promise<void> {
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw new Error(`Failed to sign in: ${error.message}`);
}

export async function signUpWithEmail(
  email: string,
  password: string,
): Promise<void> {
  const { error } = await supabase.auth.signUp({
    email,
    password,
  });
  if (error) throw new Error(`Failed to sign up: ${error.message}`);
}

export async function signOut(): Promise<void> {
  const { error } = await supabase.auth.signOut();
  if (error) throw new Error(`Failed to sign out: ${error.message}`);
}
