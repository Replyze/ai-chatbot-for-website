// @ts-check

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Example docs',
  tagline: 'A Docusaurus site with the Replyze chat widget',
  // Your site's address. The sitemap (/sitemap.xml) is built from it.
  url: 'https://docs.example.com',
  baseUrl: '/',
  onBrokenLinks: 'throw',

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          routeBasePath: '/',
          sidebarPath: './sidebars.js',
        },
        blog: false,
      }),
    ],
  ],

  plugins: [
    // The chat widget on every page. Your widget token is in the Replyze
    // dashboard: Settings → Integrations → Install widget.
    ['./plugins/replyze-chat.js', { token: 'wgt_YOUR_TOKEN' }],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        title: 'Example docs',
      },
    }),
};

export default config;
