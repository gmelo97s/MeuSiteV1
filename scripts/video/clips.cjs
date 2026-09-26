// Grava trechos do site em uso (CDP screencast) e converte em sequências de 30 fps em clips/<nome>.
// uso (com o site rodando em npm run preview): node scripts/video/clips.cjs [D1 M2 ...]
// Sem nomes, grava todos e também extrai os vídeos do portfólio (public/videos/*-m.webm).
const { chromium } = require(process.env.PLAYWRIGHT_PATH || 'playwright');
const fs = require('fs'), path = require('path');
const { execFileSync } = require('child_process');
const FF = process.env.FFMPEG || 'ffmpeg';
process.chdir(__dirname);
const URL = process.env.SITE_URL || 'http://localhost:4173/';
const only = process.argv.slice(2);

const sleep = (p, ms) => p.waitForTimeout(ms);
// rolagem suave controlada (ease in-out), resolve quando termina
const glide = (p, dy, ms) => p.evaluate(({ dy, ms }) => new Promise((res) => {
  const y0 = window.scrollY, s = performance.now();
  const e = (t) => (t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
  (function f(n) { const k = Math.min(1, (n - s) / ms); window.scrollTo(0, Math.round(y0 + dy * e(k))); k < 1 ? requestAnimationFrame(f) : res(); })(s);
}), { dy, ms });
const topOf = (p, sel) => p.evaluate((sel) => document.querySelector(sel).getBoundingClientRect().top + window.scrollY, sel);
const jump = async (p, y) => { await p.evaluate((y) => window.scrollTo(0, y), y); };
const setRange = (p, sel, from, to, ms) => p.evaluate(({ sel, from, to, ms }) => new Promise((res) => {
  const el = document.querySelector(sel), s = performance.now();
  (function f(n) { const k = Math.min(1, (n - s) / ms); const v = Math.round((from + (to - from) * k) / 5) * 5; el.value = v; el.dispatchEvent(new Event('input', { bubbles: true })); k < 1 ? requestAnimationFrame(f) : res(); })(s);
}), { sel, from, to, ms });

const D = { viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1.25 };
const M = { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true,
  userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1' };

const CLIPS = {
  D1: { ctx: D, fromLoad: true, run: async (p) => {
    await sleep(p, 4600);
    await p.click('#negocio'); await p.keyboard.type('Bar do Zé', { delay: 120 });
    await sleep(p, 3200);
  } },
  D2: { ctx: D, prep: async (p) => { await jump(p, await topOf(p, '#dia')); await sleep(p, 1200); }, run: async (p) => {
    await sleep(p, 400); await glide(p, 900 * 4.3, 10000); await sleep(p, 600);
  } },
  D3: { ctx: D, prep: async (p) => { await jump(p, (await topOf(p, '#projetos')) + 120); await sleep(p, 2500); }, run: async (p) => {
    await sleep(p, 2200); await p.click('#wtab-burger'); await sleep(p, 3000); await p.click('#wtab-mitte'); await sleep(p, 3200);
  } },
  D4: { ctx: D, prep: async (p) => { await jump(p, (await topOf(p, '.sim')) - 90); await sleep(p, 2200); }, run: async (p) => {
    await sleep(p, 900);
    for (let i = 0; i < 3; i++) { await p.click('.sim__step[data-step="calc-pw"][data-dir="1"]'); await sleep(p, 450); }
    await setRange(p, '#calc-tk', 45, 120, 1600); await sleep(p, 500);
    await p.hover('.bar[data-m="9"]'); await sleep(p, 1400);
  } },
  D5: { ctx: D, prep: async (p) => { await jump(p, (await topOf(p, '#funcionario')) - 250); await sleep(p, 800); }, run: async (p) => {
    await glide(p, 620, 2200); await sleep(p, 900); await glide(p, 360, 1400); await sleep(p, 2600);
  } },
  D6: { ctx: D, prep: async (p) => { await jump(p, (await topOf(p, '#final')) - 500); await sleep(p, 800); }, run: async (p) => {
    await glide(p, 560, 2200); await sleep(p, 3000);
  } },
  M1: { ctx: M, fromLoad: true, run: async (p) => {
    await sleep(p, 4400);
    await p.tap('#negocio'); await p.keyboard.type('Bar do Zé', { delay: 130 });
    await sleep(p, 900); await p.evaluate(() => document.activeElement.blur());
    await glide(p, 470, 1600); await sleep(p, 2600);
  } },
  M2: { ctx: M, prep: async (p) => { await jump(p, await topOf(p, '#dia')); await sleep(p, 1200); }, run: async (p) => {
    await sleep(p, 500); await glide(p, 1900, 7000); await sleep(p, 500);
  } },
  M3: { ctx: M, prep: async (p) => { await jump(p, (await topOf(p, '#chat-phone')) - 844 + 120); await sleep(p, 1000); }, run: async (p) => {
    await glide(p, 520, 1300); await sleep(p, 8800);
  } },
  M4: { ctx: M, prep: async (p) => { await jump(p, (await topOf(p, '.sim')) - 70); await sleep(p, 2000); }, run: async (p) => {
    await sleep(p, 700);
    for (let i = 0; i < 3; i++) { await p.tap('.sim__step[data-step="calc-pw"][data-dir="1"]'); await sleep(p, 420); }
    await glide(p, 760, 2000); await sleep(p, 2200);
  } },
};

(async () => {
  const b = await chromium.launch({ args: ['--ignore-certificate-errors', '--hide-scrollbars'] });
  for (const [name, c] of Object.entries(CLIPS)) {
    if (only.length && !only.includes(name)) continue;
    const ctx = await b.newContext({ ...c.ctx, ignoreHTTPSErrors: true, locale: 'pt-BR' });
    const p = await ctx.newPage();
    const raw = path.join('raw', name);
    fs.rmSync(raw, { recursive: true, force: true }); fs.mkdirSync(raw, { recursive: true });
    const cdp = await ctx.newCDPSession(p);
    const frames = [];
    let stopped = false;
    cdp.on('Page.screencastFrame', async (f) => {
      if (stopped) return;
      const file = path.join(raw, String(frames.length).padStart(5, '0') + '.jpg');
      fs.writeFileSync(file, Buffer.from(f.data, 'base64'));
      frames.push({ file, t: f.metadata.timestamp });
      try { await cdp.send('Page.screencastFrameAck', { sessionId: f.sessionId }); } catch (e) {}
    });
    const start = () => cdp.send('Page.startScreencast', { format: 'jpeg', quality: 90, everyNthFrame: 1 });
    let t0;
    if (c.fromLoad) {
      await p.goto(URL, { waitUntil: 'commit' });
      await start(); t0 = Date.now() / 1000;
      await c.run(p);
    } else {
      await p.goto(URL); await p.waitForTimeout(4200);
      await p.evaluate(() => document.getElementById('exit')?.remove());
      await c.prep(p);
      await start(); t0 = Date.now() / 1000; await p.waitForTimeout(120);
      await c.run(p);
    }
    stopped = true;
    await cdp.send('Page.stopScreencast');
    await p.waitForTimeout(200);
    const end = frames[frames.length - 1].t + 0.2;
    let list = '';
    frames.forEach((f, i) => { const nx = i + 1 < frames.length ? frames[i + 1].t : end; list += `file '${path.resolve(f.file)}'\nduration ${Math.max(0.001, nx - f.t).toFixed(4)}\n`; });
    list += `file '${path.resolve(frames[frames.length - 1].file)}'\n`;
    fs.writeFileSync(path.join(raw, 'list.txt'), list);
    const out = path.join('clips', name);
    fs.rmSync(out, { recursive: true, force: true }); fs.mkdirSync(out, { recursive: true });
    execFileSync(FF, ['-hide_banner', '-loglevel', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', path.join(raw, 'list.txt'), '-vf', 'fps=30', '-q:v', '3', path.join(out, '%04d.jpg')]);
    const n = fs.readdirSync(out).length;
    console.log(name, 'frames', frames.length, '->', n, 'seq (', (n / 30).toFixed(1), 's )');
    fs.rmSync(raw, { recursive: true, force: true });
    await ctx.close();
  }
  await b.close();
  // vídeos do portfólio (celular) viram sequências para o carrossel
  for (const id of ['burger', 'supra', 'mitte', 'bolsa']) {
    const name = 'P' + id;
    if (only.length && !only.includes(name)) continue;
    const out = path.join('clips', name);
    fs.rmSync(out, { recursive: true, force: true }); fs.mkdirSync(out, { recursive: true });
    execFileSync(FF, ['-hide_banner', '-loglevel', 'error', '-y', '-i', path.resolve('../../public/videos', `${id}-m.webm`), '-vf', 'fps=30', '-q:v', '3', path.join(out, '%04d.jpg')]);
    console.log(name, fs.readdirSync(out).length, 'seq');
  }
  // quantos quadros cada trecho tem (a composição lê isso)
  const count = {};
  fs.readdirSync('clips', { withFileTypes: true }).filter((e) => e.isDirectory()).forEach((e) => { count[e.name] = fs.readdirSync(path.join('clips', e.name)).length; });
  fs.writeFileSync('clips/manifest.js', `window.CLIPCOUNT=${JSON.stringify(count)};`);
})();
