import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { TanStackRouterVite } from '@tanstack/router-vite-plugin';
import path from 'path'; 

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), TanStackRouterVite()],
  envDir: path.join(__dirname, 'env'),
  envPrefix: ['VITE_', 'XD_'],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
});
