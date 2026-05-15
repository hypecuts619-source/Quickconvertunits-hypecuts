import { createServer } from 'vite';
import { renderToString } from 'react-dom/server';
import React from 'react';

// Mock browser objects loosely
(global as any).window = { location: { search: '?embed=true' } };
(global as any).matchMedia = () => ({ matches: false, addListener: () => {}, removeListener: () => {} });

async function run() {
  const vite = await createServer({
    server: { middlewareMode: true },
    appType: 'custom'
  });

  try {
    const { MemoryRouter } = await vite.ssrLoadModule('react-router-dom');
    const { HelmetProvider } = await vite.ssrLoadModule('react-helmet-async');
    const { default: App } = await vite.ssrLoadModule('./src/App.tsx');

    const html = renderToString(
      React.createElement(HelmetProvider, null, 
        React.createElement(MemoryRouter, { initialEntries: ['/kph-to-mph?embed=true'] },
          React.createElement(App)
        )
      )
    );
    console.log("RENDERED OK. Length:", html.length);
  } catch (e: any) {
    console.error("ERROR!");
    console.error(e.message);
    console.error(e.stack);
  } finally {
    vite.close();
  }
}

run();
