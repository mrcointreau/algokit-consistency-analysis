// @ts-check
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

// Use root path for development, GitHub Pages path for production
const isDev = process.env.NODE_ENV === 'development';

// https://astro.build/config
export default defineConfig({
  site: 'https://mrcointreau.github.io',
  base: isDev ? '/' : '/algokit-consistency-analysis/',
  integrations: [tailwind()],
  markdown: {
    remarkPlugins: ['remark-gfm'],
    shikiConfig: {
      theme: 'github-dark',
    },
  },
});
