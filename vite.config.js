import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@components': resolve(__dirname, './src/generals/components'), // Alias cho `components`
      '@helpers': resolve(__dirname, './src/generals/helpers'), // Alias cho `helpers`
      '@generals': resolve(__dirname, './src/generals'), // Alias cho `generals`
      '@pages': resolve(__dirname, './src/pages'), // Alias cho thư mục `pages`
      '@api': resolve(__dirname, './src/api'), // Alias cho `api`
      '@assets': resolve(__dirname, './src/assets'), // Alias cho `assets`
      '@': resolve(__dirname, './src'), // Alias cho thư mục `src`
    },
  },
})
