import { defineConfig } from 'vitest/config';
import path from 'node:path';

// Separate from vite.config.ts on purpose: that file wires up Figma Make's
// dev-only plugins (story discovery, HTML transforms) which have no role in
// running plain unit tests and can only get in the way here.
export default defineConfig({
  resolve: {
    alias: { '@': path.resolve(import.meta.dirname, './src') },
  },
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
});
