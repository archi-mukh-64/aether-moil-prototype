import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import fs from 'fs'

// Plugin to resolve entry point, local files, dom-helpers, and vite client when directory path contains '#' (Windows username)
const resolveHashPathPlugin = () => {
  return {
    name: 'resolve-hash-path-plugin',
    enforce: 'pre',
    resolveId(source, importer) {
      // 1. Resolve main entry point
      if (source === '/src/main.jsx' || source === './src/main.jsx' || source.endsWith('/src/main.jsx')) {
        return path.resolve(__dirname, 'src/main.jsx');
      }
      // 2. Resolve /src/* files
      if (source.startsWith('/src/')) {
        const target = path.resolve(__dirname, source.slice(1));
        if (fs.existsSync(target)) return target;
      }
      // 3. Resolve dom-helpers packages cleanly
      if (source.startsWith('dom-helpers/')) {
        const sub = source.replace('dom-helpers/', '');
        const target = path.resolve(__dirname, 'node_modules/dom-helpers/esm', sub + '.js');
        if (fs.existsSync(target)) return target;
      }
      // 4. Fix Rollup's corrupted duplicate hash path on dom-helpers
      if (source.includes('dom-helpers') && source.includes('#')) {
        const match = source.match(/(.*node_modules[\\/]dom-helpers[\\/].*?\.js)/);
        if (match && fs.existsSync(match[1])) {
          return match[1];
        }
      }
      // 5. Resolve Vite internal client scripts
      if (source === '/@vite/client' || source === '@vite/client') {
        return path.resolve(__dirname, 'node_modules/vite/dist/client/client.mjs');
      }
      if (source === '@vite/env' || source === '/@vite/env') {
        return path.resolve(__dirname, 'node_modules/vite/dist/client/env.mjs');
      }
      return null;
    },
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url === '/@vite/client' || req.url?.startsWith('/@vite/client?') || req.url?.startsWith('/@vite/client')) {
          const clientPath = path.resolve(__dirname, 'node_modules/vite/dist/client/client.mjs');
          if (fs.existsSync(clientPath)) {
            let content = fs.readFileSync(clientPath, 'utf-8');
            content = content
              .replace(/__MODE__/g, JSON.stringify(server.config.mode || 'development'))
              .replace(/__BASE__/g, JSON.stringify(server.config.base || '/'))
              .replace(/__DEFINES__/g, JSON.stringify(server.config.define || {}))
              .replace(/__HMR_PROTOCOL__/g, JSON.stringify('ws'))
              .replace(/__HMR_HOSTNAME__/g, JSON.stringify('localhost'))
              .replace(/__HMR_PORT__/g, JSON.stringify(server.config.server.port || 5173))
              .replace(/__HMR_DIRECT_TARGET__/g, JSON.stringify('localhost:5173'))
              .replace(/__HMR_BASE__/g, JSON.stringify(server.config.base || '/'))
              .replace(/__HMR_TIMEOUT__/g, '30000')
              .replace(/__HMR_ENABLE_OVERLAY__/g, 'true')
              .replace(/__SERVER_HOST__/g, JSON.stringify('localhost'));
            
            res.setHeader('Content-Type', 'application/javascript');
            res.setHeader('Cache-Control', 'no-cache');
            return res.end(content);
          }
        }
        if (req.url === '/@vite/env' || req.url === '/@fs/@vite/env' || req.url?.startsWith('/@vite/env?')) {
          const envPath = path.resolve(__dirname, 'node_modules/vite/dist/client/env.mjs');
          if (fs.existsSync(envPath)) {
            const content = fs.readFileSync(envPath, 'utf-8');
            res.setHeader('Content-Type', 'application/javascript');
            res.setHeader('Cache-Control', 'no-cache');
            return res.end(content);
          }
        }
        next();
      });
    }
  }
}

export default defineConfig({
  plugins: [
    resolveHashPathPlugin(),
    react()
  ],
  base: '/',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json'],
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-ui': ['framer-motion', 'clsx', 'tailwind-merge'],
          'vendor-icons': ['lucide-react'],
          'vendor-charts': ['recharts'],
          'vendor-maps': ['leaflet', 'react-leaflet']
        }
      }
    }
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
