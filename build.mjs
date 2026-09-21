import { mkdir, copyFile, cp } from 'node:fs/promises';
await mkdir('dist', { recursive: true });
for (const file of ['index.html','styles.css','script.js','site-config.js','favicon.svg']) await copyFile(file, `dist/${file}`);
await cp('assets', 'dist/assets', {recursive:true});
console.log('Site estático preparado em dist/');
