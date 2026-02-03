/**
 * App theme: single source for navigation/tab colors and typography.
 * Primary color: #1fa358. Supports light and dark mode.
 */

import { Platform } from 'react-native';

/** App primary color (green) */
export const PRIMARY_COLOR = '#1fa358';

export type ColorScheme = 'light' | 'dark';

export const Colors: Record<
  ColorScheme,
  {
    text: string;
    textMuted: string;
    background: string;
    cardBackground: string;
    cardBorder: string;
    tint: string;
    icon: string;
    tabIconDefault: string;
    tabIconSelected: string;
  }
> = {
  light: {
    text: '#11181C',
    textMuted: '#687076',
    background: '#ffffff',
    cardBackground: '#f5f5f5',
    cardBorder: '#e5e5e5',
    tint: PRIMARY_COLOR,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: PRIMARY_COLOR,
  },
  dark: {
    text: '#ECEDEE',
    textMuted: '#9BA1A6',
    background: '#121212',
    cardBackground: '#1e1e1e',
    cardBorder: '#2d2d2d',
    tint: PRIMARY_COLOR,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: PRIMARY_COLOR,
  },
};

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
