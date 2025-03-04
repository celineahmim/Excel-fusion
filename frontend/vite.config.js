import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  root: '.', // Assurez-vous que le root est correct
  build: {
    outDir: 'dist',
    emptyOutDir: true
  }
});
