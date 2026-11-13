# Docusaurus with the Replyze chat widget

A minimal Docusaurus 3 site with the Replyze AI chat widget on every page, added by a small local plugin.

- [`plugins/replyze-chat.js`](plugins/replyze-chat.js) puts the widget snippet in the HTML of every page at build time, right before `</body>`.
- [`docusaurus.config.js`](docusaurus.config.js) registers it with your widget token:

```js
plugins: [
  ['./plugins/replyze-chat.js', { token: 'wgt_YOUR_TOKEN' }],
],
```

Docusaurus moves between pages without reloading, so the script loads once and an open chat stays open from page to page. The `url` setting also gives the site a `/sitemap.xml`, which helps a crawler find every page.

## Run it

```bash
npm install
npm run build
npm run serve
```

Put your widget token in place of `wgt_YOUR_TOKEN` (Replyze dashboard: **Settings → Integrations → Install widget**). If the widget has a list of allowed domains (**Settings → Chat Widget**), add `localhost` to try it locally.

## Tested

- @docusaurus/core 3.10.2, @docusaurus/preset-classic 3.10.2, React 19.3.1, Node.js 22.19.0.
- `npm run build` and `npm run serve`, then Chromium with the live widget (November 2026): the chat opened, then three clicks between pages and Back. `widget.js` was requested once and ran once, there was one chat on the page, the launcher was visible on every page, and the open chat stayed open.
