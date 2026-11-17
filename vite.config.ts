import { fileURLToPath, URL } from 'node:url';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';
import vercel from './vercel.json' with { type: 'json' };

/** Production headers from vercel.json, so `npm run preview` serves the same CSP that Vercel does. */
const productionHeaders = Object.fromEntries(
  vercel.headers.find(rule => rule.source === '/(.*)')?.headers.map(header => [header.key, header.value]) ?? [],
);

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    // `@/` is the src/ root, so imports don't depend on where a file sits. Mirrored in tsconfig.json.
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  preview: { headers: productionHeaders },
  test: {
    environment: 'jsdom',
    globals: true,
    include: ['src/**/*.test.{ts,tsx}'],
  },
});
