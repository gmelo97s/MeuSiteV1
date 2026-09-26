// Renderiza a composição quadro a quadro e gera o MP4 em media/.
// uso (dentro de scripts/video): node render.cjs <desk|reel> [t1,t2,... só para testar quadros soltos]
// Precisa do Playwright (PLAYWRIGHT_PATH ou no node) e do ffmpeg (FFMPEG ou no PATH).
const { chromium } = require(process.env.PLAYWRIGHT_PATH || 'playwright');
const fs = require('fs'), path = require('path');
const { execFileSync } = require('child_process');
const FF = process.env.FFMPEG || 'ffmpeg';
process.chdir(__dirname);
const [,, fmt = 'desk', only] = process.argv;
const R = fmt === 'reel';
(async () => {
  const b = await chromium.launch({ args: ['--ignore-certificate-errors', '--allow-file-access-from-files', '--disable-web-security'] });
  const p = await (await b.newContext({ ignoreHTTPSErrors: true, viewport: R ? { width: 1080, height: 1920 } : { width: 1920, height: 1080 }, deviceScaleFactor: 1 })).newPage();
  const errs = []; p.on('pageerror', (e) => errs.push(e.message)); p.on('console', (m) => m.type() === 'error' && errs.push(m.text()));
  await p.goto('file://' + path.resolve('compose.html') + '?fmt=' + fmt);
  await p.evaluate(() => window.ready); await p.waitForTimeout(800);
  const dur = await p.evaluate(() => window.DURATION);
  const times = only ? only.split(',').map(Number) : Array.from({ length: Math.round(dur * 30) }, (_, i) => i / 30);
  const dir = only ? 'test-' + fmt : 'frames-' + fmt;
  fs.rmSync(dir, { recursive: true, force: true }); fs.mkdirSync(dir);
  const t0 = Date.now();
  for (let i = 0; i < times.length; i++) {
    await p.evaluate((t) => window.renderAt(t), times[i]);
    const name = only ? `t${times[i].toFixed(2)}.jpg` : String(i).padStart(5, '0') + '.jpg';
    await p.screenshot({ path: path.join(dir, name), type: 'jpeg', quality: 93 });
    if (!only && i % 150 === 0) console.log(fmt, i, '/', times.length, Math.round((Date.now() - t0) / 1000) + 's');
  }
  console.log(fmt, 'ok', times.length, 'quadros', errs.slice(0, 5));
  await b.close();
  if (only) return;
  const out = path.resolve('../../media', `origem-digital-demo-${R ? 'reels' : 'desktop'}.mp4`);
  execFileSync(FF, ['-hide_banner', '-loglevel', 'error', '-y', '-framerate', '30', '-i', path.join(dir, '%05d.jpg'),
    '-c:v', 'libx264', '-preset', 'slow', '-crf', R ? '19' : '18', '-profile:v', 'high', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', out]);
  console.log('vídeo:', out);
})();
