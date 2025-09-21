let loadingPromise: Promise<void> | null = null;

export function loadGoogleMaps(apiKey: string): Promise<void> {
  if (typeof window !== 'undefined' && (window as any).google && (window as any).google.maps) {
    return Promise.resolve();
  }
  if (loadingPromise) return loadingPromise;
  loadingPromise = new Promise<void>((resolve, reject) => {
    const existing = document.querySelector('script[data-gmaps-loader]') as HTMLScriptElement | null;
    if (existing) {
      existing.addEventListener('load', () => resolve());
      existing.addEventListener('error', () => reject(new Error('Google Maps failed to load')));
      return;
    }
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}`;
    script.async = true;
    script.defer = true;
    script.setAttribute('data-gmaps-loader', 'true');
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Google Maps failed to load'));
    document.head.appendChild(script);
  });
  return loadingPromise;
}


