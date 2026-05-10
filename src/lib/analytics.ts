import ReactGA from 'react-ga4';
import { onCLS, onINP, onLCP, onFCP, onTTFB } from 'web-vitals';

const TRACKING_ID = import.meta.env.VITE_GA_MEASUREMENT_ID;

export const initGA = () => {
  if (TRACKING_ID && typeof window !== 'undefined') {
    ReactGA.initialize(TRACKING_ID);
    
    // Core Web Vitals Tracking
    const sendToGA = ({ name, value, id }: { name: string; value: number; id: string }) => {
      ReactGA.event('web_vital', {
        event_category: 'Web Vitals',
        event_label: id,
        value: Math.round(name === 'CLS' ? value * 1000 : value),
        vital_name: name,
        non_interaction: true,
      });
    };

    onCLS(sendToGA);
    onINP(sendToGA);
    onLCP(sendToGA);
    onFCP(sendToGA);
    onTTFB(sendToGA);
  }
};

export const trackPageView = (path: string, options?: {
  category?: string;
  from_unit?: string;
  to_unit?: string;
}) => {
  if (TRACKING_ID && typeof window !== 'undefined') {
    ReactGA.send({
      hitType: 'pageview',
      page: path,
      title: document.title,
      ...options
    });
  }
};

export const trackConversionEvent = (category: string, fromUnit: string, toUnit: string, value?: number) => {
  if (TRACKING_ID && typeof window !== 'undefined') {
    ReactGA.event('unit_conversion', {
      category_id: category,
      from_unit: fromUnit,
      to_unit: toUnit,
      value: value
    });
  }
};

export const trackFunnelStep = (stepName: string) => {
  if (TRACKING_ID && typeof window !== 'undefined') {
    ReactGA.event('conversion_funnel', {
      step_name: stepName
    });
  }
};

export const trackNullState = (category: string, fromQuery: string, toQuery: string) => {
  if (TRACKING_ID && typeof window !== 'undefined') {
    ReactGA.event('conversion_null_state', {
      category_id: category,
      from_query: fromQuery,
      to_query: toQuery
    });
  }
};

export const trackPWAInstall = (action: 'prompt_shown' | 'install_accepted' | 'install_dismissed' | 'installed_success') => {
  if (TRACKING_ID && typeof window !== 'undefined') {
    ReactGA.event('pwa_install', {
      event_category: 'PWA',
      event_label: action
    });
  }
};
