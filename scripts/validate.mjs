import { access, readFile, readdir } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const manifest = JSON.parse(await readFile(path.join(root, 'manifest.json'), 'utf8'));
const packageMeta = JSON.parse(await readFile(path.join(root, 'package.json'), 'utf8'));
if (manifest.manifest_version !== 3) throw new Error('仅支持 Manifest V3');
if (!/^\d+\.\d+\.\d+$/.test(manifest.version)) throw new Error('manifest 版本必须为 x.y.z');
if (manifest.version !== packageMeta.version) throw new Error('manifest 与 package 版本不一致');

const required = new Set([
  ...Object.values(manifest.icons || {}),
  ...manifest.content_scripts.flatMap((entry) => [...(entry.js || []), ...(entry.css || [])]),
]);
for (const entry of manifest.web_accessible_resources || []) {
  for (const resource of entry.resources || []) {
    if (!resource.includes('*')) {
      required.add(resource);
      continue;
    }
    const directory = path.dirname(resource);
    const suffix = resource.slice(resource.lastIndexOf('*') + 1);
    const files = await readdir(path.join(root, directory));
    if (!files.some((file) => file.endsWith(suffix))) throw new Error(`${resource} 没有匹配的发布资源`);
  }
}
for (const file of required) await access(path.join(root, file));

for (const locale of ['en', 'zh_CN', 'ja', 'ko']) {
  const file = path.join(root, '_locales', locale, 'messages.json');
  const messages = JSON.parse(await readFile(file, 'utf8'));
  for (const key of ['extensionName', 'extensionDescription']) {
    if (!messages[key]?.message) throw new Error(`${file} 缺少 ${key}`);
  }
}
console.log(`校验通过：MV3 v${manifest.version}`);
