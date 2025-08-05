import { create } from 'zustand';

interface AuthStore {
  isLoggedIn: boolean;
  setIsLoggedIn: (value: boolean) => void;
  logout: () => void;
  token: string | null;
  setToken: (value: string) => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  isLoggedIn: !!localStorage.getItem('authToken'),
  token: localStorage.getItem('authToken'),
  setIsLoggedIn: (value) => set({ isLoggedIn: value }),
  setToken: (value) => set({ token: value }),
  logout: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('isKakao');
    set({ isLoggedIn: false, token: null });
  },
}));
