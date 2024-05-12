import { defineConfig } from "vite";
import uni from "@dcloudio/vite-plugin-uni";
import AutoImport from "unplugin-auto-import/vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    uni(),
    AutoImport({
      dts: "src/auto-imports.d.ts",
      imports: ["vue", "uni-app", "pinia"],
    }),
  ],
  build: {
    watch: {
      exclude: ["node_modules/**", "/__uno.css"],
    },
  },
  server: {
    hmr: true,
    watch: {
      usePolling: true, // 修复HMR热更新失效
    },
  },
});
