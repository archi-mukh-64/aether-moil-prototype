import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import fs from 'fs'

const pathFixPlugin = () => {
  return {
    name: 'path-fix-plugin',
    enforce: 'pre',
    resolveId(source, importer) {
      if (source.startsWith('dom-helpers/')) {
        const sub = source.replace('dom-helpers/', '');
        const target = path.resolve('M:/frontend', 'node_modules/dom-helpers/esm', sub + '.js');
        if (fs.existsSync(target)) return target;
      }
      if (source.includes('dom-helpers') && source.includes('#')) {
        const match = source.match(/(.*node_modules[\\/]dom-helpers[\\/].*?\.js)/);
        if (match && fs.existsSync(match[1])) return match[1];
      }
      if (source.startsWith('@/')) {
        return '/src/' + source.slice(2);
      }
      if (source.startsWith('./') || source.startsWith('../')) {
        // NEVER intercept relative imports originating from node_modules
        // or Vite's optimised dependency directory (.vite/deps/).
        // e.g. react.js → ./chunk-3OZBND64.js must stay inside
        // /node_modules/.vite/deps/, not be redirected to /src/.
        const normalizedImporter = importer ? importer.replace(/\\/g, '/') : '';
        if (
          normalizedImporter.includes('/node_modules/') ||
          normalizedImporter.includes('/.vite/deps/')
        ) {
          return null;
        }
        let baseDir = '/src';
        if (importer) {
          let norm = importer.split('?')[0].replace(/\\/g, '/');
          const idx = norm.indexOf('/src/');
          if (idx !== -1) {
            baseDir = path.posix.dirname(norm.slice(idx));
          }
        }
        const rel = path.posix.normalize(path.posix.join(baseDir, source));
        return rel;
      }
      if (source.startsWith('/src/')) return source;
      return null;
    },
    load(id) {
      // Vite may request virtual chunk modules like "/src/chunk-XYZ.js" for pre‑bundled dependencies.
      // These modules exist only in memory; let Vite handle them.
      if (id.includes('/src/chunk-') || id.startsWith('\0') || id.includes('?commonjs')) {
        return null;
      }
      let cleanId = id.split('?')[0].replace(/\\/g, '/');
      if (cleanId.startsWith('/src/')) {
        cleanId = 'M:/frontend' + cleanId;
      } else if (cleanId.includes('user#') || cleanId.includes('moil-project/frontend')) {
        cleanId = cleanId.replace(/^.*?moil-project\/frontend/, 'M:/frontend');
      }
      if (cleanId.startsWith('M:/frontend/M:/frontend')) {
        cleanId = cleanId.replace('M:/frontend/M:/frontend', 'M:/frontend');
      }
      if (fs.existsSync(cleanId) && fs.statSync(cleanId).isFile()) {
        return fs.readFileSync(cleanId, 'utf-8');
      }
      return null;
    }
  }
}

export default defineConfig({
  root: 'M:/frontend',
  plugins: [
    pathFixPlugin(),
    react()
  ],
  base: '/',
  resolve: {
    alias: {
      '@': 'M:/frontend/src',
    },
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json'],
  },
  optimizeDeps: {
    esbuildOptions: {
      plugins: [
        {
          name: 'resolve-dom-helpers-esbuild',
          setup(build) {
            build.onResolve({ filter: /^dom-helpers/ }, args => {
              const sub = args.path.replace(/^dom-helpers\/?/, '');
              const file = sub ? (sub.endsWith('.js') ? sub : sub + '.js') : 'index.js';
              const target = path.resolve('M:/frontend/node_modules/dom-helpers/esm', file);
              if (fs.existsSync(target)) {
                return { path: target };
              }
            });
          }
        }
      ]
    }
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
    fs: {
      strict: false,
      allow: ['..', 'M:/', 'C:/Users/user#/OneDrive/Documents/moil-project']
    },
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
