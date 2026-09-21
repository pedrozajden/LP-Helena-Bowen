import http from 'node:http';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root = path.dirname(fileURLToPath(import.meta.url));
const types = {'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.jpg':'image/jpeg','.png':'image/png','.svg':'image/svg+xml','.mp4':'video/mp4','.webm':'video/webm','.vtt':'text/vtt; charset=utf-8'};
http.createServer(async (req,res) => {
  try {
    const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    const relative = pathname === '/' ? 'index.html' : pathname.slice(1);
    if (!['index.html','styles.css','script.js','site-config.js','favicon.svg'].includes(relative) && !/^assets\/[a-z0-9-]+\.(jpg|png|mp4|webm|vtt)$/.test(relative)) {res.writeHead(404);res.end('Not found');return;}
    const data = await readFile(path.join(root,relative));
    res.writeHead(200, {'Content-Type':types[path.extname(relative)] || 'application/octet-stream'});res.end(data);
  } catch {res.writeHead(404);res.end('Not found');}
}).listen(4173,'0.0.0.0',() => console.log('Preview: http://localhost:4173'));
