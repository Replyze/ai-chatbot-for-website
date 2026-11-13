// Checks a built example: every page carries the widget, and the sitemap is where the
// README says a crawler finds it.
//
//   node scripts/check-build.mjs docusaurus   (after that example's build)
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const WIDGET = 'https://cdn.replyze.chat/widget.js';

// out: the build folder. sitemap: the file the README table names. robots: robots.txt
// must name the sitemap. tag: the page has a real <script src> tag (Nextra's next/script
// adds it in the browser, from data in the page).
const EXAMPLES = {
  docusaurus: { out: 'build', sitemap: 'sitemap.xml', tag: true },
  vitepress: { out: 'docs/.vitepress/dist', sitemap: 'sitemap.xml', tag: true },
  mkdocs: { out: 'site', sitemap: 'sitemap.xml', tag: true },
  starlight: { out: 'dist', sitemap: 'sitemap-index.xml', robots: true, tag: true },
  nextra: { out: '.next/server/app', sitemap: null, tag: false },
};

const name = process.argv[2];
const example = EXAMPLES[name];
if (!example) {
  console.error('Usage: node scripts/check-build.mjs <' + Object.keys(EXAMPLES).join('|') + '>');
  process.exit(2);
}
const out = join(ROOT, 'examples', name, example.out);
const problems = [];

const pages = [];
const walk = (dir) => {
  for (const entry of readdirSync(dir)) {
    const path = join(dir, entry);
    if (statSync(path).isDirectory()) {
      if (name !== 'nextra') walk(path); // Nextra: only the prerendered pages at the top
    } else if (entry.endsWith('.html') && !/^(404|_not-found|_global-error)\.html$/.test(entry)) {
      pages.push(path);
    }
  }
};
if (existsSync(out)) walk(out);
if (pages.length < 3) problems.push(`expected the 3 pages (index, install, faq) in ${example.out}, found ${pages.length}`);

for (const page of pages) {
  const html = readFileSync(page, 'utf8');
  const rel = page.slice(out.length + 1).replace(/\\/g, '/');
  if (!html.includes('window.ReplyzeConfig')) problems.push(`${rel}: no window.ReplyzeConfig`);
  if (!html.includes('wgt_YOUR_TOKEN')) problems.push(`${rel}: no token`);
  if (!html.includes('https://client.replyze.chat')) problems.push(`${rel}: no apiUrl`);
  if (example.tag) {
    const tags = html.match(/<script[^>]*\ssrc="https:\/\/cdn\.replyze\.chat\/widget\.js"[^>]*>/g) || [];
    if (tags.length !== 1) problems.push(`${rel}: ${tags.length} widget script tags, expected 1`);
    else if (!/\sasync(=""|\s|>)/.test(tags[0])) problems.push(`${rel}: the widget script tag is not async`);
  } else if (!html.includes(WIDGET)) {
    problems.push(`${rel}: no ${WIDGET}`);
  }
}

if (example.sitemap) {
  const sitemap = join(out, example.sitemap);
  if (!existsSync(sitemap)) problems.push(`no ${example.sitemap}`);
  if (example.robots) {
    const robots = join(out, 'robots.txt');
    const text = existsSync(robots) ? readFileSync(robots, 'utf8') : '';
    if (!new RegExp('^Sitemap: \\S+/' + example.sitemap.replace('.', '\\.') + '$', 'm').test(text)) {
      problems.push(`robots.txt does not name ${example.sitemap}`);
    }
  }
}

if (problems.length) {
  console.error(problems.map((p) => `FAIL  ${name}: ${p}`).join('\n'));
  process.exit(1);
}
console.log(`${name}: ${pages.length} pages carry the widget${example.sitemap ? `, ${example.sitemap} is there` : ''}.`);
