import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import fs from 'fs'

// Custom plugin to resolve any packages corrupted by '#' in user directory
const fixHashPathPlugin = () => {
  return {
    name: 'fix-hash-path-plugin',
    enforce: 'pre',
    resolveId(source, importer) {
      if (source.startsWith('dom-helpers/')) {
        const sub = source.replace('dom-helpers/', '');
        const target = path.resolve(__dirname, 'node_modules/dom-helpers/esm', sub + '.js');
        if (fs.existsSync(target)) {
          return target;
        }
      }
      if (source.includes('#\\') || source.includes('#/')) {
        const cleaned = source.replace(/#[\\/].*$/, '');
        if (fs.existsSync(cleaned)) return cleaned;
        if (fs.existsSync(cleaned + '.js')) return cleaned + '.js';
        if (fs.existsSync(cleaned + '.mjs')) return cleaned + '.mjs';
      }
      return null;
    }
  }
}

export default defineConfig({
  plugins: [
    fixHashPathPlugin(),
    react()
  ],
  base: './',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json'],
  },
  server: {
    port: 5173,
    host: true,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
        secure: false,
      }
    }
  },
  preview: {
    port: 5173,
    host: true,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})
