# Astro Starlight with the Replyze chat widget

A minimal Starlight site with the Replyze AI chat widget on every page, added with Starlight's `head` option in [`astro.config.mjs`](astro.config.mjs):

```js
starlight({
  title: 'Example docs',
  head: [
    {
      tag: 'script',
      content: `window.ReplyzeConfig = { token: 'wgt_YOUR_TOKEN', apiUrl: 'https://client.replyze.chat' };`,
    },
    {
      tag: 'script',
      attrs: { src: 'https://cdn.replyze.chat/widget.js', async: true },
    },
  ],
}),
```

Starlight loads every page in full, so the script runs once on each page (the browser takes it from its cache after the first page), and the chat starts closed on the next page.

With `site` set, Starlight writes `/sitemap-index.xml`. Crawlers that only try the usual names (`/sitemap.xml`, `/sitemap_index.xml`) won't find it, so [`public/robots.txt`](public/robots.txt) names it.

## Run it

```bash
npm install
npm run build
npm run preview
```

Put your widget token in place of `wgt_YOUR_TOKEN` (Replyze dashboard: **Settings → Integrations → Install widget**). If the widget has a list of allowed domains (**Settings → Chat Widget**), add `localhost` to try it locally.

## Tested

- Astro 7.3.8, @astrojs/starlight 0.42.11, sharp 0.35.5, Node.js 22.19.0. (Astro 7.4 needs Node.js 22.23 or newer; the `head` option is the same.)
- `npm run build` and `npm run preview`, then Chromium with the live widget (November 2026): the chat opened, then three clicks between pages and Back. Each page was a full page load; on every page `widget.js` ran once, there was one chat, and the launcher was visible.
