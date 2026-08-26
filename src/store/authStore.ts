import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthState {
  token: string | null;
  isOnline: boolean;
  setToken: (token: string | null) => Promise<void>;
  setIsOnline: (status: boolean) => void;
  logout: () => Promise<void>;
  initAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  isOnline: false,
  setToken: async (token) => {
    if (token) {
      await AsyncStorage.setItem('token', token);
    } else {
      await AsyncStorage.removeItem('token');
    }
    set({ token });
  },
  setIsOnline: (status) => {
    set({ isOnline: status });
  },
  logout: async () => {
    await AsyncStorage.removeItem('token');
    set({ token: null, isOnline: false });
  },
  initAuth: async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        set({ token });
      }
    } catch (e) {
      console.error('Failed to init auth', e);
    }
  },
}));
