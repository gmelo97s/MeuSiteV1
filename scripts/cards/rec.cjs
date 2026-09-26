// Grava tours com interação (celular, 390x844 @2x) e salva a hora e o lugar de cada toque.
// uso: node scripts/cards/rec.cjs [burger mitte bolsa echofi]  → scripts/cards/seq/<id>/ e seq/meta.js
// Precisa do Playwright (PLAYWRIGHT_PATH ou no node) e do ffmpeg (FFMPEG ou no PATH).
const { chromium } = require(process.env.PLAYWRIGHT_PATH || 'playwright');
const fs = require('fs'), path = require('path');
const { execFileSync } = require('child_process');
const FF = process.env.FFMPEG || 'ffmpeg';
process.chdir(__dirname);
const SITES = { echofi: 'https://echofi-bp.webflow.io/', burger: 'https://testeburguerking.lovable.app/', mitte: 'https://mittebar.vercel.app/', bolsa: 'https://bolsaeverso.lovable.app/' };

const glide = (p, dy, ms) => p.evaluate(({ dy, ms }) => new Promise((res) => {
  const y0 = scrollY, s = performance.now();
  const e = (t) => (t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
  (function f(n) { const k = Math.min(1, (n - s) / ms); scrollTo(0, Math.round(y0 + dy * e(k))); k < 1 ? requestAnimationFrame(f) : res(); })(s);
}), { dy, ms });

const TOURS = {
  burger: async (A) => {
    await A.wait(1200);
    await A.glide(400, 1200);
    await A.wait(250);
    await A.tap('button:has-text("Hambúrgueres")');
    await A.wait(900);
    await A.tap('button[aria-label="Adicionar Gui Bacon"]');
    await A.wait(1000);
    await A.tap('input >> nth=0'); await A.type('Ana');
    await A.wait(500);
    await A.tap('button:has-text("Delivery")');
    await A.wait(1600);
  },
  mitte: async (A) => {
    await A.wait(1400);
    await A.tap('button:has-text("AGENDAR MEU ANIVERSÁRIO")');
    await A.waitFor('input');
    await A.wait(700);
    await A.tap('input'); await A.type('Carla');
    await A.wait(400);
    await A.tap('button:has-text("PRÓXIMO")');
    await A.wait(900);
    await A.tap('input'); await A.type('Souza');
    await A.wait(400);
    await A.tap('button:has-text("PRÓXIMO") >> nth=-1');
    await A.wait(1600);
  },
  bolsa: async (A) => {
    await A.wait(1000);
    await A.glide(330, 1000);
    await A.wait(300);
    await A.tap('button:has-text("DETALHES") >> nth=0');
    await A.wait(1200);
    await A.tap('button:has-text("ADICIONAR À SACOLA")');
    await A.wait(1500);
    await A.glide(420, 1200);
    await A.wait(1300);
  },
  echofi: async (A) => {
    await A.wait(1300);
    await A.tapXY(346, 47);
    await A.wait(1300);
    await A.tapXY(346, 47);
    await A.wait(500);
    await A.glide(820, 1500);
    await A.wait(900);
    await A.glide(1100, 1500);
    await A.wait(1200);
  },
};

(async () => {
  const only = process.argv.slice(2);
  const b = await chromium.launch({ args: ['--ignore-certificate-errors', '--hide-scrollbars', '--force-device-scale-factor=2'] });
  for (const id of Object.keys(TOURS)) {
    if (only.length && !only.includes(id)) continue;
    const ctx = await b.newContext({ ignoreHTTPSErrors: true, viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, locale: 'pt-BR',
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1' });
    const p = await ctx.newPage();
    const hide = `#lovable-badge,[id*="lovable-badge"],a[href*="lovable.dev"],.w-webflow-badge{display:none!important} ::-webkit-scrollbar{display:none} html{scrollbar-width:none;scroll-behavior:auto!important} body{scroll-behavior:auto!important}`;
    await p.addInitScript((css) => { document.addEventListener('DOMContentLoaded', () => { const s = document.createElement('style'); s.textContent = css; document.head.appendChild(s); }); }, hide);
    await p.goto(SITES[id], { waitUntil: 'networkidle', timeout: 60000 }).catch(() => {});
    await p.addStyleTag({ content: hide });
    const killBadges = () => p.evaluate(() => { for (const el of document.querySelectorAll('a,div,button')) if (/Edit with|Made with/i.test(el.textContent || '') && getComputedStyle(el).position === 'fixed') el.style.display = 'none'; }).catch(() => {});
    await killBadges();
    // carrega imagens preguiçosas
    const H = await p.evaluate(() => document.documentElement.scrollHeight);
    for (let y = 0; y < Math.min(H, 3400); y += 420) { await p.evaluate((y) => scrollTo(0, y), y); await p.waitForTimeout(200); }
    await p.evaluate(() => scrollTo(0, 0)); await p.waitForTimeout(2200);

    const raw = path.join('raw', id); fs.rmSync(raw, { recursive: true, force: true }); fs.mkdirSync(raw, { recursive: true });
    const cdp = await ctx.newCDPSession(p);
    const frames = []; let stopped = false;
    cdp.on('Page.screencastFrame', async (f) => {
      if (stopped) return;
      const file = path.join(raw, String(frames.length).padStart(5, '0') + '.jpg');
      fs.writeFileSync(file, Buffer.from(f.data, 'base64'));
      frames.push({ file, t: f.metadata.timestamp });
      try { await cdp.send('Page.screencastFrameAck', { sessionId: f.sessionId }); } catch (e) {}
    });
    await cdp.send('Page.startScreencast', { format: 'jpeg', quality: 90, maxWidth: 780, maxHeight: 1688, everyNthFrame: 1 });
    await p.waitForTimeout(400);
    const t0 = Date.now() / 1000;
    const taps = [];
    const now = () => +(Date.now() / 1000 - t0).toFixed(3);
    const A = {
      wait: (ms) => p.waitForTimeout(ms),
      waitFor: (sel) => p.locator(sel).first().waitFor({ timeout: 8000 }).then(killBadges),
      glide: (dy, ms) => glide(p, dy, ms),
      type: (s) => p.keyboard.type(s, { delay: 110 }),
      tap: async (sel) => {
        const loc = p.locator(sel).first();
        const bb = await loc.boundingBox();
        taps.push({ t: now(), x: Math.round(bb.x + bb.width / 2), y: Math.round(bb.y + bb.height / 2), w: Math.round(bb.width), h: Math.round(bb.height), sel });
        await loc.click({ timeout: 1500 }).catch(() => loc.dispatchEvent('click'));
      },
      tapXY: async (x, y) => { taps.push({ t: now(), x, y, w: 40, h: 40 }); await p.mouse.click(x, y); },
    };
    try { await TOURS[id](A); } catch (e) { console.log(id, 'ERR', e.message.split('\n')[0]); }
    const dur = now();
    stopped = true;
    await cdp.send('Page.stopScreencast');
    await p.waitForTimeout(300);
    const base = frames[0].t;
    let list = '';
    frames.forEach((f, i) => { const nx = i + 1 < frames.length ? frames[i + 1].t : f.t + 0.1; list += `file '${path.resolve(f.file)}'\nduration ${Math.max(0.001, nx - f.t).toFixed(4)}\n`; });
    list += `file '${path.resolve(frames[frames.length - 1].file)}'\n`;
    fs.writeFileSync(path.join(raw, 'list.txt'), list);
    const out = path.join('seq', id); fs.rmSync(out, { recursive: true, force: true }); fs.mkdirSync(out, { recursive: true });
    execFileSync(FF, ['-hide_banner', '-loglevel', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', path.join(raw, 'list.txt'), '-vf', 'fps=30', '-q:v', '3', path.join(out, '%04d.jpg')]);
    const n = fs.readdirSync(out).length;
    // hora dos toques medida no relógio do screencast (o primeiro quadro é o zero)
    const offset = t0 - base;
    const meta = { id, frames: n, dur, offset: +offset.toFixed(3), taps: taps.map((t) => ({ ...t, t: +(t.t + offset).toFixed(3) })) };
    fs.writeFileSync(path.join(out, 'meta.json'), JSON.stringify(meta, null, 1));
    console.log(id, n, 'quadros', JSON.stringify(meta.taps.map((t) => [t.t, t.x, t.y])));
    fs.rmSync(raw, { recursive: true, force: true });
    await ctx.close();
  }
  await b.close();
  // quadros do computador (camada de trás) a partir dos vídeos do portfólio
  const ids = Object.keys(TOURS), meta = {}, dframes = {};
  for (const id of ids) {
    const out = path.join('seq', id + '-d');
    if (!only.length || only.includes(id)) {
      fs.rmSync(out, { recursive: true, force: true }); fs.mkdirSync(out, { recursive: true });
      execFileSync(FF, ['-hide_banner', '-loglevel', 'error', '-y', '-i', path.resolve('../../public/videos', `${id}-d.webm`), '-vf', 'fps=30,scale=800:-2', '-q:v', '3', path.join(out, '%04d.jpg')]);
    }
    if (fs.existsSync(path.join('seq', id, 'meta.json'))) meta[id] = JSON.parse(fs.readFileSync(path.join('seq', id, 'meta.json')));
    if (fs.existsSync(out)) dframes[id] = fs.readdirSync(out).filter((f) => f.endsWith('.jpg')).length;
  }
  fs.writeFileSync(path.join('seq', 'meta.js'), `window.META_ALL=${JSON.stringify(meta)};window.DFRAMES=${JSON.stringify(dframes)};`);
})();
