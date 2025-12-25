import { supabase } from './supabaseClient';

// Sign up with email and password
export const signUp = async (email, password, username) => {
  // If Supabase is not configured, simulate successful signup
  if (!supabase) {
    console.warn('Supabase not configured, simulating signup');
    return { user: { id: 'local-user', email, user_metadata: { username } } };
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        username,
      },
    },
  });

  if (error) {
    throw error;
  }
  return data;
};

// Sign in with email and password
export const signIn = async (email, password) => {
  // If Supabase is not configured, simulate successful login
  if (!supabase) {
    console.warn('Supabase not configured, simulating login');
    return { user: { id: 'local-user', email } };
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw error;
  }
  return data;
};

// Sign out
export const signOut = async () => {
  // If Supabase is not configured, simulate successful logout
  if (!supabase) {
    console.warn('Supabase not configured, simulating logout');
    return true;
  }

  const { error } = await supabase.auth.signOut();
  if (error) {
    throw error;
  }
  return true;
};

// Get current user
export const getCurrentUser = async () => {
  // If Supabase is not configured, return null (no authenticated user)
  if (!supabase) {
    console.warn('Supabase not configured, no authenticated user');
    return null;
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
};

// Listen for auth state changes
export const onAuthStateChange = callback => {
  // If Supabase is not configured, return a mock subscription
  if (!supabase) {
    console.warn('Supabase not configured, returning mock subscription');
    return {
      unsubscribe: () => {},
    };
  }

  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange(callback);
  return subscription;
};
