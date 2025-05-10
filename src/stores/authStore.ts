import { create } from 'zustand';
import { supabase } from '../lib/supabase';

interface Profile {
  id: string;
  name: string;
  avatar: string;
}

interface User {
  id: string;
  email: string;
  isAdmin: boolean;
  profiles: Profile[];
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  currentProfile: Profile | null;
  hasSelectedProfile: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  selectProfile: (profile: Profile) => void;
  clearError: () => void;
  resetPassword: (email: string) => Promise<void>;
  updatePassword: (newPassword: string) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  currentProfile: null,
  hasSelectedProfile: false,
  isLoading: false,
  error: null,

  login: async (email: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      const { data: authData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) throw signInError;

      if (!authData.user) throw new Error('No user data returned from authentication');

      // Fetch user data including profiles
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select(`
          id,
          email,
          is_admin,
          profiles (
            id,
            name,
            avatar_url
          )
        `)
        .eq('id', authData.user.id)
        .single();

      if (userError) throw userError;
      if (!userData) throw new Error('User data not found');

      const profiles = userData.profiles?.map(p => ({
        id: p.id,
        name: p.name,
        avatar: p.avatar_url
      })) || [];

      const userWithData = {
        id: userData.id,
        email: userData.email,
        isAdmin: userData.is_admin,
        profiles
      };

      set({ 
        user: userWithData,
        isAuthenticated: true,
        currentProfile: userData.is_admin ? {
          id: 'admin',
          name: 'Admin',
          avatar: 'https://i.pravatar.cc/150?img=1'
        } : null,
        hasSelectedProfile: userData.is_admin,
        isLoading: false,
        error: null
      });
    } catch (error) {
      set({ 
        user: null,
        isAuthenticated: false,
        currentProfile: null,
        hasSelectedProfile: false,
        error: error instanceof Error ? error.message : 'An error occurred during login', 
        isLoading: false 
      });
    }
  },

  register: async (email: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (signUpError) throw signUpError;
      if (!authData.user) throw new Error('Registration failed');

      // The trigger will create the user and profile records
      // Just fetch the created data
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select(`
          id,
          email,
          is_admin,
          profiles (
            id,
            name,
            avatar_url
          )
        `)
        .eq('id', authData.user.id)
        .single();

      if (userError) throw userError;
      if (!userData) throw new Error('User data not found after registration');

      const profiles = userData.profiles?.map(p => ({
        id: p.id,
        name: p.name,
        avatar: p.avatar_url
      })) || [];

      const userWithData = {
        id: userData.id,
        email: userData.email,
        isAdmin: userData.is_admin,
        profiles
      };

      set({ 
        user: userWithData,
        isAuthenticated: true,
        currentProfile: userData.is_admin ? {
          id: 'admin',
          name: 'Admin',
          avatar: 'https://i.pravatar.cc/150?img=1'
        } : null,
        hasSelectedProfile: userData.is_admin,
        isLoading: false,
        error: null
      });
    } catch (error) {
      let errorMessage = 'An error occurred during registration';
      if (error instanceof Error) {
        errorMessage = error.message;
        if (error.message.includes('already registered')) {
          errorMessage = 'An account with this email already exists. Please sign in instead.';
        }
      }
      
      set({ 
        user: null,
        isAuthenticated: false,
        currentProfile: null,
        hasSelectedProfile: false,
        error: errorMessage,
        isLoading: false 
      });
    }
  },

  resetPassword: async (email: string) => {
    set({ isLoading: true, error: null });
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) throw error;
      set({ isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to process password reset',
        isLoading: false
      });
    }
  },

  updatePassword: async (newPassword: string) => {
    set({ isLoading: true, error: null });
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;
      set({ isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to update password',
        isLoading: false
      });
    }
  },

  logout: async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      set({ 
        user: null, 
        isAuthenticated: false, 
        currentProfile: null, 
        hasSelectedProfile: false,
        error: null
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to log out',
      });
    }
  },

  selectProfile: (profile) => {
    set({ currentProfile: profile, hasSelectedProfile: true });
  },

  clearError: () => set({ error: null }),
}));