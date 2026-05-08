export const trackConversionEvent = (category: string, fromUnit: string, toUnit: string, value: string) => {
  if (typeof window !== "undefined") {
    // GA4 tracking
    if ((window as any).gtag) {
      (window as any).gtag("event", "unit_conversion", {
        event_category: category,
        from_unit: fromUnit,
        to_unit: toUnit,
        conversion_value: value,
      });
    }
  }
};

export const trackFunnelStep = (stepName: string) => {
  if (typeof window !== "undefined") {
    // GA4 tracking
    if ((window as any).gtag) {
      (window as any).gtag("event", "funnel_step", {
        step_name: stepName
      });
    }
  }
};

export const trackPageView = (url: string) => {
  if (typeof window !== "undefined" && (window as any).gtag) {
    (window as any).gtag("config", "G-Z7W1M7R0YB", {
      page_path: url,
    });
  }
};
