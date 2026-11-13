// Checks the code in the READMEs against the examples that CI builds.
//
//   node scripts/check-snippets.mjs
//
// - Every block that sets up the widget uses the real embed: window.ReplyzeConfig with
//   token 'wgt_YOUR_TOKEN' and apiUrl 'https://client.replyze.chat', and the script
//   https://cdn.replyze.chat/widget.js.
// - Every code line of a framework's snippet (README.md and examples/<name>/README.md)
//   appears in that example's files, so the snippets can't drift from the code that is built.
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const EXAMPLES = ['docusaurus', 'vitepress', 'mkdocs', 'starlight', 'nextra'];
// README.md section heading -> example folder.
const SECTIONS = {
  Docusaurus: 'docusaurus',
  VitePress: 'vitepress',
  'MkDocs (Material)': 'mkdocs',
  'Astro Starlight': 'starlight',
  Nextra: 'nextra',
};
// Lines that are deliberately different in the README (a shorter placeholder).
const README_ONLY = new Set(["title: 'My docs',"]);
const SKIP_DIRS = new Set(['node_modules', 'build', 'dist', 'site', '.next', '.docusaurus', '.astro', '.venv', 'cache']);
const CODE = new Set(['js', 'jsx', 'mjs', 'ts', 'html', 'yaml', 'yml', 'txt', '']);

const problems = [];
const read = (file) => readFileSync(join(ROOT, file), 'utf8').replace(/\r\n/g, '\n');

// Fenced code blocks with the README section (### heading) they are in.
function blocks(file) {
  const out = [];
  let section = '';
  let open = null;
  read(file).split('\n').forEach((line, i) => {
    if (open) {
      if (/^\s*```\s*$/.test(line)) {
        out.push(open);
        open = null;
      } else {
        open.lines.push(line);
      }
      return;
    }
    const heading = line.match(/^#{2,3} (.+)$/);
    if (heading) section = heading[1].trim();
    const fence = line.match(/^\s*```\s*([\w-]*)/);
    if (fence) open = { file, line: i + 1, lang: fence[1], section, lines: [] };
  });
  return out;
}

// A code line without its comment, trimmed; '' for comment-only lines.
function codeLine(line, lang) {
  let s = line.trim();
  if (/^(\/\/|#(?!\s*\{)|<!--|\{\/\*|\*\/\}|\/\*|\*)/.test(s) && !/^#!/.test(s)) {
    if (!(lang === 'html' && s.startsWith('{%'))) return '';
  }
  if (lang === 'yaml' || lang === 'yml') s = s.replace(/\s+#.*$/, '');
  else s = s.replace(/\s+\/\/ .*$/, '');
  return s.trim();
}

function exampleLines(name) {
  const lines = new Set();
  const walk = (dir) => {
    for (const entry of readdirSync(dir)) {
      if (SKIP_DIRS.has(entry) || entry === 'README.md' || entry === 'package-lock.json') continue;
      const path = join(dir, entry);
      if (statSync(path).isDirectory()) walk(path);
      else {
        readFileSync(path, 'utf8')
          .replace(/\r\n/g, '\n')
          .replace(/\$\{REPLYZE_TOKEN\}/g, 'wgt_YOUR_TOKEN')
          .split('\n')
          .forEach((l) => lines.add(l.trim()));
      }
    }
  };
  walk(join(ROOT, 'examples', name));
  return lines;
}

function checkEmbed(block) {
  const text = block.lines.join('\n');
  const where = `${block.file}:${block.line}`;
  if (text.includes('ReplyzeConfig')) {
    if (!/token: '(wgt_YOUR_TOKEN|\$\{REPLYZE_TOKEN\})'|token: options\.token/.test(text)) problems.push(`${where}: ReplyzeConfig without token 'wgt_YOUR_TOKEN'`);
    if (!/apiUrl: 'https:\/\/client\.replyze\.chat'/.test(text)) problems.push(`${where}: ReplyzeConfig without apiUrl 'https://client.replyze.chat'`);
  }
  for (const m of text.matchAll(/https?:\/\/[\w.-]*replyze[\w.-]*\/[^\s'"`)]*/g)) {
    const url = m[0];
    if (url.includes('cdn.replyze.chat') && url !== 'https://cdn.replyze.chat/widget.js') problems.push(`${where}: unexpected widget URL ${url}`);
  }
  if (/cdn\.replyze\.chat/.test(text) && !/https:\/\/cdn\.replyze\.chat\/widget\.js/.test(text)) problems.push(`${where}: widget script URL is not https://cdn.replyze.chat/widget.js`);
}

function checkAgainstExample(block, name, files) {
  if (!CODE.has(block.lang)) return;
  for (const raw of block.lines) {
    const line = codeLine(raw, block.lang);
    if (!line || README_ONLY.has(line)) continue;
    if (!files.has(line)) problems.push(`${block.file}:${block.line}: not in examples/${name}: ${line}`);
  }
}

const files = Object.fromEntries(EXAMPLES.map((name) => [name, exampleLines(name)]));
let count = 0;

for (const block of blocks('README.md')) {
  count++;
  checkEmbed(block);
  const name = SECTIONS[block.section];
  if (name) checkAgainstExample(block, name, files[name]);
}
for (const name of EXAMPLES) {
  const file = relative(ROOT, join(ROOT, 'examples', name, 'README.md')).replace(/\\/g, '/');
  for (const block of blocks(file)) {
    count++;
    checkEmbed(block);
    if (block.lang !== 'bash') checkAgainstExample(block, name, files[name]);
  }
}

if (problems.length) {
  console.error(problems.map((p) => 'FAIL  ' + p).join('\n'));
  process.exit(1);
}
console.log(`${count} code blocks checked: embed code and example files match.`);
