import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import dts from 'vite-plugin-dts'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [dts({
    insertTypesEntry: true,
    staticImport: true,
    copyDtsFiles: true,
  }), vue()],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'PdfViewer',
      fileName: format => `pdf-viewer.${format}.js`,

    },
    rollupOptions: {
      external: ['vue'],
      input: resolve(__dirname, 'src/index.ts'),
      output: {
        globals: { vue: 'Vue' },
      },
    },
  },
})
