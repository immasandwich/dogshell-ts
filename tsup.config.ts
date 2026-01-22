import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/cli.tsx', 'src/commands/**/*.tsx'],
  format: ['esm'],
  target: 'node18',
  outDir: 'dist',
  clean: true,
  sourcemap: true,
  banner: ({ entryPoint }) => {
    if (entryPoint === 'src/cli.tsx') {
      return { js: '#!/usr/bin/env node' };
    }
    return {};
  },
});
