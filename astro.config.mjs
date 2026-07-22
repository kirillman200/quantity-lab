// @ts-check
import { defineConfig } from 'astro/config';
import vue from '@astrojs/vue';

export default defineConfig({
  site: 'https://home.utilitas.app',
  output: 'static',
  trailingSlash: 'always',
  integrations: [vue()],
  vite: {
    build: {
      sourcemap: false,
    },
  },
});
