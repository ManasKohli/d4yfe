import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    // `@/` is the src/ root, so imports don't depend on where a file sits. Mirrored in jsconfig.json for editors.
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
});
