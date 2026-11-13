import { defineConfig } from 'vitepress';

// Your widget token is in the Replyze dashboard:
// Settings → Integrations → Install widget.
const REPLYZE_TOKEN = 'wgt_YOUR_TOKEN';

export default defineConfig({
  title: 'Example docs',
  description: 'A VitePress site with the Replyze chat widget',

  // The chat widget on every page. These tags are in the HTML of every page;
  // VitePress keeps them as they are when it moves between pages, so the
  // script runs once and the chat stays open.
  head: [
    ['script', {}, `window.ReplyzeConfig = { token: '${REPLYZE_TOKEN}', apiUrl: 'https://client.replyze.chat' };`],
    ['script', { src: 'https://cdn.replyze.chat/widget.js', async: '' }],
  ],

  // Writes /sitemap.xml, which a crawler reads to find every page.
  sitemap: {
    hostname: 'https://docs.example.com',
  },

  themeConfig: {
    sidebar: [
      {
        text: 'Guide',
        items: [
          { text: 'Introduction', link: '/' },
          { text: 'Install', link: '/install' },
          { text: 'FAQ', link: '/faq' },
        ],
      },
    ],
  },
});
