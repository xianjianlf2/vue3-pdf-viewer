// vite.config.ts
import { resolve } from "node:path";
import { defineConfig } from "file:///C:/Users/116751/vue-pdf-view/node_modules/.pnpm/vite@4.4.6_@types+node@20.4.3/node_modules/vite/dist/node/index.js";
import vue from "file:///C:/Users/116751/vue-pdf-view/node_modules/.pnpm/@vitejs+plugin-vue@4.2.3_vite@4.4.6_vue@3.3.4/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import dts from "file:///C:/Users/116751/vue-pdf-view/node_modules/.pnpm/vite-plugin-dts@3.3.1_typescript@5.1.6_vite@4.4.6/node_modules/vite-plugin-dts/dist/index.mjs";
var __vite_injected_original_dirname = "C:\\Users\\116751\\vue-pdf-view";
var vite_config_default = defineConfig({
  plugins: [dts({
    insertTypesEntry: true,
    staticImport: true,
    copyDtsFiles: true
  }), vue()],
  resolve: {
    alias: {
      "@": "/src"
    }
  },
  build: {
    lib: {
      entry: resolve(__vite_injected_original_dirname, "src/index.ts"),
      name: "PdfViewer",
      fileName: (format) => `pdf-viewer.${format}.js`
    },
    rollupOptions: {
      external: ["vue"],
      input: resolve(__vite_injected_original_dirname, "src/index.ts"),
      output: {
        globals: { vue: "Vue" }
      }
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFwxMTY3NTFcXFxcdnVlLXBkZi12aWV3XCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFwxMTY3NTFcXFxcdnVlLXBkZi12aWV3XFxcXHZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9DOi9Vc2Vycy8xMTY3NTEvdnVlLXBkZi12aWV3L3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgcmVzb2x2ZSB9IGZyb20gJ25vZGU6cGF0aCdcbmltcG9ydCB7IGRlZmluZUNvbmZpZyB9IGZyb20gJ3ZpdGUnXG5pbXBvcnQgdnVlIGZyb20gJ0B2aXRlanMvcGx1Z2luLXZ1ZSdcbmltcG9ydCBkdHMgZnJvbSAndml0ZS1wbHVnaW4tZHRzJ1xuXG4vLyBodHRwczovL3ZpdGVqcy5kZXYvY29uZmlnL1xuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcbiAgcGx1Z2luczogW2R0cyh7XG4gICAgaW5zZXJ0VHlwZXNFbnRyeTogdHJ1ZSxcbiAgICBzdGF0aWNJbXBvcnQ6IHRydWUsXG4gICAgY29weUR0c0ZpbGVzOiB0cnVlLFxuICB9KSwgdnVlKCldLFxuICByZXNvbHZlOiB7XG4gICAgYWxpYXM6IHtcbiAgICAgICdAJzogJy9zcmMnLFxuICAgIH0sXG4gIH0sXG4gIGJ1aWxkOiB7XG4gICAgbGliOiB7XG4gICAgICBlbnRyeTogcmVzb2x2ZShfX2Rpcm5hbWUsICdzcmMvaW5kZXgudHMnKSxcbiAgICAgIG5hbWU6ICdQZGZWaWV3ZXInLFxuICAgICAgZmlsZU5hbWU6IGZvcm1hdCA9PiBgcGRmLXZpZXdlci4ke2Zvcm1hdH0uanNgLFxuXG4gICAgfSxcbiAgICByb2xsdXBPcHRpb25zOiB7XG4gICAgICBleHRlcm5hbDogWyd2dWUnXSxcbiAgICAgIGlucHV0OiByZXNvbHZlKF9fZGlybmFtZSwgJ3NyYy9pbmRleC50cycpLFxuICAgICAgb3V0cHV0OiB7XG4gICAgICAgIGdsb2JhbHM6IHsgdnVlOiAnVnVlJyB9LFxuICAgICAgfSxcbiAgICB9LFxuICB9LFxufSlcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBOFEsU0FBUyxlQUFlO0FBQ3RTLFNBQVMsb0JBQW9CO0FBQzdCLE9BQU8sU0FBUztBQUNoQixPQUFPLFNBQVM7QUFIaEIsSUFBTSxtQ0FBbUM7QUFNekMsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUIsU0FBUyxDQUFDLElBQUk7QUFBQSxJQUNaLGtCQUFrQjtBQUFBLElBQ2xCLGNBQWM7QUFBQSxJQUNkLGNBQWM7QUFBQSxFQUNoQixDQUFDLEdBQUcsSUFBSSxDQUFDO0FBQUEsRUFDVCxTQUFTO0FBQUEsSUFDUCxPQUFPO0FBQUEsTUFDTCxLQUFLO0FBQUEsSUFDUDtBQUFBLEVBQ0Y7QUFBQSxFQUNBLE9BQU87QUFBQSxJQUNMLEtBQUs7QUFBQSxNQUNILE9BQU8sUUFBUSxrQ0FBVyxjQUFjO0FBQUEsTUFDeEMsTUFBTTtBQUFBLE1BQ04sVUFBVSxZQUFVLGNBQWMsTUFBTTtBQUFBLElBRTFDO0FBQUEsSUFDQSxlQUFlO0FBQUEsTUFDYixVQUFVLENBQUMsS0FBSztBQUFBLE1BQ2hCLE9BQU8sUUFBUSxrQ0FBVyxjQUFjO0FBQUEsTUFDeEMsUUFBUTtBQUFBLFFBQ04sU0FBUyxFQUFFLEtBQUssTUFBTTtBQUFBLE1BQ3hCO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
