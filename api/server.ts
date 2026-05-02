let app: any;
try {
  const mod = await import('../server');
  app = mod.default;
} catch (e: any) {
  const mod = await import('express');
  const express = mod.default || mod;
  app = express();
  app.all('*', (req: any, res: any) => res.status(500).send('Vercel Top-level Error: ' + e.message + ' | Stack: ' + e.stack));
}
export default function handler(req: any, res: any) {
  return app(req, res);
}
