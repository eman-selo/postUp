import { defineConfig } from "vite";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import babel from "@rolldown/plugin-babel";
import { visualizer } from "rollup-plugin-visualizer";
// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] }),
    visualizer({
      open: true, // يفتح تقرير التحليل تلقائياً في المتصفح بعد الـ Build
      filename: "bundle-analysis.html", // اسم الملف الناتج
      gzipSize: true, // يعرض الحجم الفعلي بعد الضغط
      brotliSize: true,
    }),
  ],
});
