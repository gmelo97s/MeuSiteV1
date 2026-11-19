import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    target: 'es2020',
    assetsInlineLimit: 0,
    // Mantém o CSS da página exatamente como foi escrito (sem reescrever propriedades).
    cssMinify: false,
  },
});
