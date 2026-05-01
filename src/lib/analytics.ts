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
    
    // Hotjar event tracking for conversion success
    if ((window as any).hj) {
      (window as any).hj("event", `conversion_completed_${category}`);
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

    // Hotjar state change for heatmaps and funnel tracking
    if ((window as any).hj) {
      (window as any).hj("stateChange", stepName);
    }
  }
};
