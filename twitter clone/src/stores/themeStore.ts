import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ThemeState {
  isDark: boolean;
  toggleTheme: () => void;
}

const updateThemeClass = (isDark: boolean) => {
  if (isDark) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
};

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      isDark: false,
      toggleTheme: () => 
        set((state) => {
          const newIsDark = !state.isDark;
          updateThemeClass(newIsDark);
          return { isDark: newIsDark };
        }),
    }),
    {
      name: 'theme-storage',
      onRehydrateStorage: (state) => {
        if (state) {
          updateThemeClass(state.isDark);
        }
      },
    }
  )
);