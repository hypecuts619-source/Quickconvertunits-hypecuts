import {StrictMode, Suspense, lazy} from 'react';
import {createRoot} from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { registerSW } from 'virtual:pwa-register';
import { ErrorBoundary } from './components/ErrorBoundary';
import { ScrollToTop } from './components/ScrollToTop';
import './index.css';
import './lib/i18n';

const App = lazy(() => import('./App.tsx'));
const PrivacyPolicy = lazy(() => import('./PrivacyPolicy.tsx'));
const TermsOfService = lazy(() => import('./TermsOfService.tsx'));
const AboutUs = lazy(() => import('./AboutUs.tsx'));
const Contact = lazy(() => import('./Contact.tsx'));
const Blog = lazy(() => import('./Blog.tsx'));
const BlogPost = lazy(() => import('./BlogPost.tsx'));
const Directory = lazy(() => import('./Directory.tsx'));
const ApiDocs = lazy(() => import('./ApiDocs.tsx'));

// Automatically register the service worker
if ('serviceWorker' in navigator) {
  registerSW({ immediate: true });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HelmetProvider>
      <ErrorBoundary>
        <BrowserRouter>
          <ScrollToTop />
          <Suspense fallback={
            <div style={{minHeight: '100vh', backgroundColor: '#fbfbfb', display: 'flex', flexDirection: 'column'}}>
              <div style={{height: '64px', background: '#ffffff', borderBottom: '1px solid #f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px'}}>
                <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                  <div style={{width: '28px', height: '28px', borderRadius: '8px', background: '#3b82f6'}}></div>
                  <div style={{fontWeight: '700', fontSize: '18px', color: '#111111'}}>QuickConvert</div>
                </div>
              </div>
              <div style={{maxWidth: '800px', margin: '0 auto', width: '100%', padding: '40px 16px'}}>
                 <div style={{height: '400px', width: '100%', background: 'white', borderRadius: '32px', border: '1px solid #f3f4f6'}}></div>
              </div>
            </div>
          }>
            <Routes>
              {/* Routes without language prefix */}
              <Route path="/" element={<App />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/terms" element={<TermsOfService />} />
              <Route path="/about" element={<AboutUs />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:slug" element={<BlogPost />} />
              <Route path="/api-docs" element={<ApiDocs />} />
              <Route path="/conversions" element={<Directory />} />
              <Route path="/conversions/:category" element={<Directory />} />
              <Route path="/conversions/:category/:pair" element={<Directory />} />
              <Route path="/:conversion" element={<App />} />

              {/* Routes with language prefix */}
              <Route path="/:lang">
                <Route index element={<App />} />
                <Route path="privacy-policy" element={<PrivacyPolicy />} />
                <Route path="terms" element={<TermsOfService />} />
                <Route path="about" element={<AboutUs />} />
                <Route path="contact" element={<Contact />} />
                <Route path="blog" element={<Blog />} />
                <Route path="blog/:slug" element={<BlogPost />} />
                <Route path="api-docs" element={<ApiDocs />} />
                <Route path="conversions" element={<Directory />} />
                <Route path="conversions/:category" element={<Directory />} />
                <Route path="conversions/:category/:pair" element={<Directory />} />
                <Route path=":conversion" element={<App />} />
              </Route>
            </Routes>
          </Suspense>
        </BrowserRouter>
      </ErrorBoundary>
    </HelmetProvider>
  </StrictMode>,
);
