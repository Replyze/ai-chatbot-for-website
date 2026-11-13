# VitePress with the Replyze chat widget

A minimal VitePress site with the Replyze AI chat widget on every page, added with the `head` setting in [`docs/.vitepress/config.mjs`](docs/.vitepress/config.mjs):

```js
head: [
  ['script', {}, `window.ReplyzeConfig = { token: 'wgt_YOUR_TOKEN', apiUrl: 'https://client.replyze.chat' };`],
  ['script', { src: 'https://cdn.replyze.chat/widget.js', async: '' }],
],
```

The two tags are in the HTML of every page. When the reader moves to another page, VitePress leaves them alone, so the script loads once and an open chat stays open. `sitemap.hostname` makes the build write `/sitemap.xml`, which helps a crawler find every page.

## Run it

```bash
npm install
npm run docs:build
npm run docs:preview
```

Put your widget token in place of `wgt_YOUR_TOKEN` (Replyze dashboard: **Settings → Integrations → Install widget**). If the widget has a list of allowed domains (**Settings → Chat Widget**), add `localhost` to try it locally.

## Tested

- VitePress 1.6.4 (Vue 3.5.45), Node.js 22.19.0.
- `npm run docs:build` and `npm run docs:preview`, then Chromium with the live widget (November 2026): the chat opened, then three clicks between pages and Back. `widget.js` was requested once and ran once, there was one chat on the page, the launcher was visible on every page, and the open chat stayed open.
