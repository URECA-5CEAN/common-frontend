import { create } from 'zustand';

interface AuthStore {
  isLoggedIn: boolean;
  setIsLoggedIn: (value: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  isLoggedIn: !!localStorage.getItem('authToken'),
  setIsLoggedIn: (value) => set({ isLoggedIn: value }),
  logout: () => {
    localStorage.removeItem('authToken');
    set({ isLoggedIn: false });
  },
}));
