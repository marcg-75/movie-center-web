import { createGlobPatternsForDependencies } from '@nx/next/tailwind';
import { join } from 'path';

// Since the tailwind config is a javascript file we can't import the theme using
// typescript path aliases
// eslint-disable-next-line @nx/enforce-module-boundaries
import config from '../../libs/shared/ui-library/tailwind.config';

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    join(
      __dirname,
      '{src,app,components}/**/*!(*.stories|*.spec).{ts,tsx,html}'
    ),
    ...createGlobPatternsForDependencies(__dirname),
  ],
  theme: config.theme,
  plugins: config.plugins,
};
