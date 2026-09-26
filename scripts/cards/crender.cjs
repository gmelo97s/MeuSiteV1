// Renderiza o card de um projeto (8 s, 752x864) e gera public/videos/card-<id>.{webm,mp4,webp}.
// uso: node scripts/cards/crender.cjs <id> [t1,t2,... só para testar quadros soltos]
const { chromium } = require(process.env.PLAYWRIGHT_PATH || 'playwright');
const fs = require('fs'), path = require('path');
const { execFileSync } = require('child_process');
const FF = process.env.FFMPEG || 'ffmpeg';
process.chdir(__dirname);
const [,, id = 'burger', only] = process.argv;
(async () => {
  const b = await chromium.launch({ args: ['--allow-file-access-from-files'] });
  const p = await (await b.newContext({ viewport: { width: 470, height: 540 }, deviceScaleFactor: 1.6 })).newPage();
  const errs = []; p.on('pageerror', (e) => errs.push(e.message)); p.on('console', (m) => m.type() === 'error' && errs.push(m.text()));
  await p.goto('file://' + path.resolve('card.html') + '?id=' + id);
  await p.evaluate(() => window.ready); await p.waitForTimeout(500);
  const dur = await p.evaluate(() => window.DURATION);
  const times = only ? only.split(',').map(Number) : Array.from({ length: Math.round(dur * 30) }, (_, i) => i / 30);
  const dir = only ? `ctest-${id}` : `cframes-${id}`;
  fs.rmSync(dir, { recursive: true, force: true }); fs.mkdirSync(dir);
  for (let i = 0; i < times.length; i++) {
    await p.evaluate((t) => window.renderAt(t), times[i]);
    await p.screenshot({ path: path.join(dir, only ? `t${times[i].toFixed(2)}.jpg` : String(i).padStart(4, '0') + '.jpg'), type: 'jpeg', quality: 94 });
  }
  console.log(id, 'ok', times.length, errs.slice(0, 5));
  await b.close();
  if (only) return;
  const out = path.resolve('../../public/videos', `card-${id}`);
  const q = ['-hide_banner', '-loglevel', 'error', '-y', '-framerate', '30', '-i', path.join(dir, '%04d.jpg')];
  execFileSync(FF, [...q, '-c:v', 'libvpx-vp9', '-b:v', '0', '-crf', '37', '-row-mt', '1', '-deadline', 'good', '-cpu-used', '2', '-pix_fmt', 'yuv420p', '-an', out + '.webm']);
  execFileSync(FF, [...q, '-c:v', 'libx264', '-preset', 'slow', '-crf', '25', '-profile:v', 'high', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', '-an', out + '.mp4']);
  execFileSync(FF, ['-hide_banner', '-loglevel', 'error', '-y', '-i', path.join(dir, '0000.jpg'), '-vf', 'scale=470:540', '-c:v', 'libwebp', '-quality', '78', out + '.webp']);
  console.log('vídeo:', out + '.{webm,mp4,webp}');
})();
