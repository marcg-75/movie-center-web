import { createGlobPatternsForDependencies } from '@nx/next/tailwind';
import { join } from 'path';
import theme from './src/design-tokens/theme';
import { screenSizes } from './src/screenSizes';

export default {
  darkMode: 'class',
  content: [
    join(__dirname, './src/**/*.{js,ts,jsx,tsx,mdx}'),
    ...createGlobPatternsForDependencies(__dirname),
  ],
  theme: {
    screens: screenSizes,
    fontFamily: {
      sans: ['PT Sans', 'Helvetica Neue', 'sans-serif'],
      serif: ['Roboto'],
    },
    // colors: theme.colors,
    spacing: theme.spacing,
    fontSize: theme.textScale,
    opacity: theme.opacity,
    borderRadius: theme.borderRadius,
    boxShadow: theme.shadow,
    zIndex: {
      zero: 0,
      backdrop: 10,
      navigation: 20,
      header: 30,
      modal: 60,
      tooltip: 70,
    },
    extend: {
      colors: {
        transparent: 'transparent',
        translucent: 'rgba(0,0,0,.4)',
      },
      spacing: {
        zero: '0',
      },
      opacity: {
        0: 0,
      },
      boxShadow: {
        none: 'none',
        '3xl': '0 15px 15px rgb(0 0 0 / 25%)',
      },
      transitionDuration: {
        125: '125ms',
        250: '250ms',
        750: '750ms',
      },
      borderRadius: {
        none: '0',
        extra: '25px',
      },
      maxWidth: theme.spacing,
      minWidth: theme.spacing,
      maxHeight: { ...theme.spacing, 150: '600px' },
      minHeight: theme.spacing,
    },
  },
  plugins: [],
};
