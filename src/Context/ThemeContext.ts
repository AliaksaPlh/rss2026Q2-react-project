import { createContext } from 'react';
// import { LIGHT, DARK } from '../consts';
import type { Theme } from '../types/types.ts';

export const ThemeContext = createContext<Theme | null>(null);
