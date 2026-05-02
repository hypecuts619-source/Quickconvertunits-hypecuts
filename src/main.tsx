import {StrictMode, Suspense, lazy} from 'react';
import {createRoot} from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { registerSW } from 'virtual:pwa-register';
import './index.css';
import './lib/i18n';

const App = lazy(() => import('./App.tsx'));
const PrivacyPolicy = lazy(() => import('./PrivacyPolicy.tsx'));
const TermsOfService = lazy(() => import('./TermsOfService.tsx'));
const AboutUs = lazy(() => import('./AboutUs.tsx'));
const Contact = lazy(() => import('./Contact.tsx'));
const Blog = lazy(() => import('./Blog.tsx'));
const BlogPost = lazy(() => import('./BlogPost.tsx'));

// Automatically register the service worker
if ('serviceWorker' in navigator) {
  registerSW({ immediate: true });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Suspense fallback={<div style={{height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>Loading...</div>}>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/:conversion" element={<App />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  </StrictMode>,
);
