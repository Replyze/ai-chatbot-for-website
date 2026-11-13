# MkDocs (Material) with the Replyze chat widget

A minimal MkDocs site with the Material theme and the Replyze AI chat widget on every page, added with a theme override.

[`overrides/main.html`](overrides/main.html) extends the theme and adds the snippet to the `<head>` of every page:

```html
{% extends "base.html" %}

{% block extrahead %}
  {{ super() }}
  <script>
    window.ReplyzeConfig = { token: 'wgt_YOUR_TOKEN', apiUrl: 'https://client.replyze.chat' };
  </script>
  <script src="https://cdn.replyze.chat/widget.js" async></script>
{% endblock %}
```

[`mkdocs.yml`](mkdocs.yml) points the theme at that folder with `custom_dir: overrides`. It also turns on Material's `navigation.instant`, which moves between pages without reloading: the script loads once and an open chat stays open. Without it, every page is a full page load and the script runs once per page. `site_url` gives the site a `/sitemap.xml`, which helps a crawler find every page.

## Run it

```bash
python -m venv .venv
.venv/bin/pip install -r requirements.txt      # Windows: .venv\Scripts\pip
.venv/bin/mkdocs build                         # Windows: .venv\Scripts\mkdocs
python -m http.server 8000 --directory site
```

Put your widget token in place of `wgt_YOUR_TOKEN` (Replyze dashboard: **Settings → Integrations → Install widget**). If the widget has a list of allowed domains (**Settings → Chat Widget**), add `localhost` to try it locally.

## Tested

- MkDocs 1.6.1, mkdocs-material 9.8.1, Python 3.12.4.
- `mkdocs build`, the `site` folder served over HTTP, then Chromium with the live widget (November 2026), with `navigation.instant` on: the chat opened, then three clicks between pages and Back. `widget.js` was requested once and ran once, there was one chat on the page, the launcher was visible on every page, and the open chat stayed open.
- The same run with `navigation.instant` removed: every click was a full page load, and on every page `widget.js` ran once, with one chat and the launcher visible.
