let leafletPromise: Promise<typeof import('leaflet')> | null = null;

export function loadLeaflet(): Promise<any> {
  if (leafletPromise) return leafletPromise as any;
  leafletPromise = new Promise((resolve, reject) => {
    if ((window as any).L) return resolve((window as any).L);

    const css = document.createElement('link');
    css.rel = 'stylesheet';
    css.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    document.head.appendChild(css);

    const script = document.createElement('script');
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    script.async = true;
    script.onload = () => resolve((window as any).L);
    script.onerror = () => reject(new Error('Failed to load Leaflet'));
    document.body.appendChild(script);
  });
  return leafletPromise as any;
}


