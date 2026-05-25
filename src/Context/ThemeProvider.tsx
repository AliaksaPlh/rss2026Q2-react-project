import { useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { ThemeContext } from './ThemeContext';
import { DARK, LIGHT } from '../consts';
import type { Theme } from '../types/types';

type Props = {
  children: ReactNode;
};

export function ThemeProvider({ children }: Props) {
  const [theme, setTheme] = useState<Theme['theme']>(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme === LIGHT || savedTheme === DARK ? savedTheme : DARK;
  });

  useEffect(() => {
    document.documentElement.classList.remove(LIGHT, DARK);
    document.documentElement.classList.add(theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((currentTheme) => (currentTheme === DARK ? LIGHT : DARK));
  };

  const value = useMemo(() => ({ theme, toggleTheme }), [theme]);

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}
