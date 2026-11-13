# Nextra with the Replyze chat widget

A minimal Nextra 4 docs site (Next.js App Router) with the Replyze AI chat widget on every page, added with `next/script` in the root layout, [`app/layout.jsx`](app/layout.jsx):

```jsx
import Script from 'next/script';

// in <body>, after <Layout>:
<Script id="replyze-config" strategy="afterInteractive">
  {`window.ReplyzeConfig = { token: 'wgt_YOUR_TOKEN', apiUrl: 'https://client.replyze.chat' };`}
</Script>
<Script src="https://cdn.replyze.chat/widget.js" strategy="afterInteractive" />
```

The root layout stays mounted when the reader moves between pages, so the script loads once and an open chat stays open.

Nextra doesn't write a sitemap. A crawler still finds the pages through the sidebar links; for a big site, Next.js can generate one from an `app/sitemap.js` file.

## Run it

```bash
npm install
npm run build
npm run start
```

Put your widget token in place of `wgt_YOUR_TOKEN` (Replyze dashboard: **Settings → Integrations → Install widget**). If the widget has a list of allowed domains (**Settings → Chat Widget**), add `localhost` to try it locally.

### Why `overrides` pins zod

With the zod that npm installed for Nextra 4.6.1 in November 2026 (4.6.7), `next build` failed while prerendering `/`: `Invalid input: expected nonoptional, received undefined → at children`. Nextra's `Layout` takes `children` out of its props and then checks the rest against a schema that requires `children`; zod accepts that missing key up to 4.3.6 and rejects it from 4.4.0. The `overrides` entry in [`package.json`](package.json) keeps zod at 4.3.6. You can drop it once a Nextra release fixes this.

## Tested

- Next.js 16.4.6, nextra 4.6.1, nextra-theme-docs 4.6.1, React 19.3.1, zod 4.3.6, Node.js 22.19.0.
- `npm run build` (all pages prerendered as static) and `npm run start`, then Chromium with the live widget (November 2026): the chat opened, then three clicks between pages and Back. `widget.js` was requested once and ran once, there was one chat on the page, the launcher was visible on every page, and the open chat stayed open.
