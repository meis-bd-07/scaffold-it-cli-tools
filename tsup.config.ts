import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs'],
  outDir: 'dist',
  clean: true,
  dts: false, // or true if you want .d.ts files
  target: 'es2020',
  sourcemap: true,
  // outExtension() {
  //   return { js: ".cjs" };
  // },
  // banner: { js: "#!/usr/bin/env node" }, // keeps shebang on output
});
