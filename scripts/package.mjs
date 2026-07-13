import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import path from 'node:path';

const root = process.cwd();
const manifest = JSON.parse(await readFile(path.join(root, 'manifest.json'), 'utf8'));
const targets = ['chrome', 'edge', 'firefox'];
const files = ['content.js', 'content.css', 'control-panel.css', 'news.css', 'fonts', 'icons', '_locales', 'LICENSE'];
const buildRoot = path.join(root, 'build', 'package');
const releaseRoot = path.join(root, 'releases');
await rm(buildRoot, { recursive: true, force: true });
await mkdir(buildRoot, { recursive: true });
await mkdir(releaseRoot, { recursive: true });

for (const target of targets) {
  const stage = path.join(buildRoot, target);
  await mkdir(stage, { recursive: true });
  for (const file of files) await cp(path.join(root, file), path.join(stage, file), { recursive: true });
  const packedManifest = structuredClone(manifest);
  if (target === 'firefox') {
    packedManifest.browser_specific_settings = { gecko: { id: 'style-for-hacknews@evilirving.com', strict_min_version: '109.0' } };
  }
  await writeFile(path.join(stage, 'manifest.json'), `${JSON.stringify(packedManifest, null, 2)}\n`);
  const zipPath = path.join(releaseRoot, `style-for-hacknews-${target}-v${manifest.version}.zip`);
  await rm(zipPath, { force: true });
  execFileSync('zip', ['-X', '-q', '-r', zipPath, '.'], { cwd: stage });
  console.log(`已生成 releases/${path.basename(zipPath)}`);
}
