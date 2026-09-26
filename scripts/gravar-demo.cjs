// Grava um loop de rolagem de um site (desce, para, sobe) para usar como vídeo de demonstração.
// uso: node scripts/gravar-demo.cjs <nome> <url> <m|d> [duracaoSeg] [telasParaDescer]
//   m = celular (390x844), d = computador (1280x800)
// Depois converta com: scripts/converter-demo.sh <nome>-<m|d> <largura>
// Precisa do Playwright (npm i -g playwright) e do ffmpeg (variável FFMPEG ou no PATH).
const { chromium } = require(process.env.PLAYWRIGHT_PATH || 'playwright');
const fs = require('fs'), path = require('path');
const [,, name, url, mode, durArg, screensArg] = process.argv;
const DUR = Number(durArg || 10) * 1000;
const SCREENS = Number(screensArg || 2.2);
const mob = mode === 'm';
const vp = mob ? { width: 390, height: 844 } : { width: 1280, height: 800 };
const dsf = mob ? 1.5 : 1;
(async () => {
  const browser = await chromium.launch({ args: ['--ignore-certificate-errors', '--hide-scrollbars'] });
  const ctx = await browser.newContext({ viewport: vp, deviceScaleFactor: dsf, isMobile: mob, hasTouch: mob, ignoreHTTPSErrors: true, locale: 'pt-BR',
    userAgent: mob ? 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1' : undefined });
  const page = await ctx.newPage();
  const failed = [];
  // o Chromium daqui não decodifica H.264: converte .mp4 para .webm na hora
  const FF = process.env.FFMPEG || 'ffmpeg';
  const { execFileSync } = require('child_process');
  await page.route(/\.mp4(\?|$)/, async route => {
    try {
      const resp = await route.fetch();
      const buf = await resp.body();
      const tmp = path.join(require('os').tmpdir(), '_demo_in.mp4');
      fs.writeFileSync(tmp, buf);
      execFileSync(FF, ['-hide_banner', '-loglevel', 'error', '-y', '-i', tmp, '-an', '-c:v', 'libvpx-vp9', '-b:v', '0', '-crf', '32', '-deadline', 'realtime', '-cpu-used', '8', '-row-mt', '1', tmp + '.webm']);
      await route.fulfill({ status: 200, contentType: 'video/webm', body: fs.readFileSync(tmp + '.webm') });
      console.log('mp4 convertido:', route.request().url().slice(0, 80));
    } catch (e) { console.log('falha ao converter mp4', e.message.slice(0, 80)); await route.continue(); }
  });
  page.on('requestfailed', r => failed.push(r.url().slice(0, 100)));
  try { await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 }); } catch (e) { console.log('goto timeout (seguindo)'); }
  // esconde os selos do Lovable e do Webflow e as barras de rolagem
  await page.addStyleTag({ content: `#lovable-badge,[id*="lovable-badge"],a[href*="lovable.dev"][style*="fixed"],.w-webflow-badge{display:none!important} ::-webkit-scrollbar{display:none} html{scrollbar-width:none}` });
  await page.evaluate(() => {
    for (const el of document.querySelectorAll('a,div,button')) {
      if (/Edit with|Made with|Made in Webflow/i.test(el.textContent || '') && getComputedStyle(el).position === 'fixed') el.style.display = 'none';
    }
  });
  // força carregar imagens lazy percorrendo a página
  const H = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < Math.min(H, vp.height * 4); y += vp.height / 2) { await page.evaluate(y => window.scrollTo(0, y), y); await page.waitForTimeout(250); }
  await page.evaluate(() => { document.documentElement.style.scrollBehavior = 'auto'; document.body.style.scrollBehavior = 'auto'; window.scrollTo(0, 0); });
  await page.waitForTimeout(2500);
  const outDir = path.join(require('os').tmpdir(), 'demo-frames', `${name}-${mode}`);
  fs.rmSync(outDir, { recursive: true, force: true }); fs.mkdirSync(outDir, { recursive: true });
  const cdp = await ctx.newCDPSession(page);
  const frames = [];
  cdp.on('Page.screencastFrame', async f => {
    const i = frames.length;
    const file = path.join(outDir, String(i).padStart(5, '0') + '.jpg');
    fs.writeFileSync(file, Buffer.from(f.data, 'base64'));
    frames.push({ file, t: f.metadata.timestamp });
    try { await cdp.send('Page.screencastFrameAck', { sessionId: f.sessionId }); } catch (e) {}
  });
  await cdp.send('Page.startScreencast', { format: 'jpeg', quality: 88, everyNthFrame: 1 });
  await page.waitForTimeout(300);
  const t0 = Date.now() / 1000;
  const maxY = await page.evaluate(s => Math.max(0, Math.min(document.documentElement.scrollHeight - innerHeight, innerHeight * s)), SCREENS);
  // coreografia: segura, desce, segura, sobe, segura (loop sem emenda)
  await page.evaluate(({ DUR, maxY }) => new Promise(res => {
    const ease = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    const k = [0, .12, .52, .64, .92, 1];
    const s = performance.now();
    (function tick(now) {
      const p = Math.min(1, (now - s) / DUR);
      let y = 0;
      if (p < k[1]) y = 0;
      else if (p < k[2]) y = maxY * ease((p - k[1]) / (k[2] - k[1]));
      else if (p < k[3]) y = maxY;
      else if (p < k[4]) y = maxY * (1 - ease((p - k[3]) / (k[4] - k[3])));
      else y = 0;
      window.scrollTo(0, Math.round(y));
      if (p < 1) requestAnimationFrame(tick); else res();
    })(s);
  }), { DUR, maxY });
  await page.waitForTimeout(150);
  await cdp.send('Page.stopScreencast');
  await page.waitForTimeout(300);
  const t1 = Date.now() / 1000;
  // lista de concat com durações
  const start = frames[0].t;
  let list = '';
  frames.forEach((f, i) => {
    const next = i + 1 < frames.length ? frames[i + 1].t : start + DUR / 1000;
    const d = Math.max(0.001, next - f.t);
    list += `file '${path.resolve(f.file)}'\nduration ${d.toFixed(4)}\n`;
  });
  list += `file '${path.resolve(frames[frames.length - 1].file)}'\n`;
  fs.writeFileSync(path.join(outDir, 'list.txt'), list);
  console.log(JSON.stringify({ name, mode, frames: frames.length, H, maxY, span: (frames[frames.length - 1].t - start).toFixed(2), failed: failed.slice(0, 5) }));
  await browser.close();
})();
