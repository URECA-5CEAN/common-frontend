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
    localStorage.removeItem('isKakao');
    set({ isLoggedIn: false });
  },
}));
