// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  output: 'static',
  site: 'https://netspire.studio',
  // Explicitly disable any SSR features
  experimental: {
    serverIslands: false
  }
});
