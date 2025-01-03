import { useThemeStore } from '../stores/themeStore';

export function useTheme() {
  const { isDark, toggleTheme } = useThemeStore();
  return { isDark, toggleTheme };
}