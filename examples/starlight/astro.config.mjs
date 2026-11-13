// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// Your widget token is in the Replyze dashboard:
// Settings → Integrations → Install widget.
const REPLYZE_TOKEN = 'wgt_YOUR_TOKEN';

export default defineConfig({
  // Your site's address. Starlight builds /sitemap-index.xml from it.
  site: 'https://docs.example.com',
  integrations: [
    starlight({
      title: 'Example docs',
      // The chat widget in the <head> of every page.
      head: [
        {
          tag: 'script',
          content: `window.ReplyzeConfig = { token: '${REPLYZE_TOKEN}', apiUrl: 'https://client.replyze.chat' };`,
        },
        {
          tag: 'script',
          attrs: { src: 'https://cdn.replyze.chat/widget.js', async: true },
        },
      ],
      sidebar: [
        {
          label: 'Guides',
          items: [
            { label: 'Install', slug: 'guides/install' },
            { label: 'FAQ', slug: 'guides/faq' },
          ],
        },
      ],
    }),
  ],
});
