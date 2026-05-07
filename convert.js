import fs from 'fs';

let content = fs.readFileSync('functions/[[path]].ts', 'utf-8');

// Replace the Cloudflare Pages onRequest with Cloudflare Workers fetch
content = content.replace(
  /export async function onRequest\(\{\s*request,\s*next\s*\}\:\s*\{\s*request\:\s*Request,\s*next\:\s*\(\)\s*\=\>\s*Promise\<Response\>\s*\}\)\s*\{([\s\S]*?)const response = await next\(\);/m,
  `export default {
  async fetch(request: Request, env: any, ctx: any): Promise<Response> {
    const response = await env.ASSETS.fetch(request);`);

// Also we need to fix the import paths
content = content.replace(/import \{ getCanonicalUnitId, getSEOUrlPath \} from '\.\.\/src\/lib\/units';/g, "import { getCanonicalUnitId, getSEOUrlPath } from './lib/units';");

fs.writeFileSync('src/worker.ts', content);
fs.unlinkSync('functions/[[path]].ts');
console.log('Converted to worker.ts');
