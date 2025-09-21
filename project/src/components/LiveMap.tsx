import React, { useEffect, useRef, useState } from 'react';
import { GeoZone, sampleZones } from '../utils/geofence';
import { loadLeaflet } from '../utils/loadLeaflet';

type LatLng = { lat: number; lng: number };
type Props = {
  center: LatLng;
  markers?: Array<{ id: string; position: LatLng; color?: string; safetyScore?: number; lastUpdated?: number; isTracking?: boolean; name?: string; nationality?: string; nationalId?: string; status?: string }>;
  zones?: GeoZone[];
  height?: string;
  zoom?: number;
  sosIds?: string[];
  showOverlay?: boolean;
  onSearchChange?: (text: string) => void;
  onReady?: (helpers: { focusOnMarker: (id: string) => void; focusOnLocation: (lat: number, lng: number, label?: string) => void }) => void;
};

const containerStyle: React.CSSProperties = { width: '100%', height: '100%' };

export default function LiveMap({ center, markers = [], zones = sampleZones, height = '100%', zoom = 13, sosIds = [], showOverlay = true, onSearchChange, onReady }: Props) {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const [ready, setReady] = useState(false);
  const mapInstance = useRef<any>(null);
  const markerInstances = useRef<any[]>([]);
  const circleInstances = useRef<any[]>([]);
  const pulseCirclesRef = useRef<any[]>([]);
  const pulseTimersRef = useRef<number[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadLeaflet()
      .then(() => setReady(true))
      .catch(() => setReady(false));
  }, []);

  useEffect(() => {
    if (!ready || !mapRef.current) return;
    const L = (window as any).L;
    if (!mapInstance.current) {
      // Create the map with initial center and zoom. Subsequent updates should not force-zoom
      mapInstance.current = L.map(mapRef.current).setView([center.lat, center.lng], zoom);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(mapInstance.current);
    } else {
      // Pan to new center without changing the user's current zoom level
      try {
        mapInstance.current.panTo([center.lat, center.lng]);
      } catch (e) {
        // fallback if panTo is unavailable for some map implementations
        mapInstance.current.setView([center.lat, center.lng]);
      }
    }

    circleInstances.current.forEach((c) => mapInstance.current.removeLayer(c));
    circleInstances.current = zones.map((z) => {
      const color = z.riskLevel === 'low' ? '#16a34a' : z.riskLevel === 'medium' ? '#f59e0b' : z.riskLevel === 'high' ? '#ef4444' : '#6b7280';
      const circle = L.circle([z.center.lat, z.center.lng], {
        radius: z.radiusMeters,
        color,
        weight: 1,
        opacity: 0.6,
        fillColor: color,
        fillOpacity: 0.08,
      }).addTo(mapInstance.current);
      return circle;
    });

    markerInstances.current.forEach((m) => mapInstance.current.removeLayer(m));
    markerInstances.current = markers.map((m) => {
      // Create a DivIcon so we can style markers and include an inner dot and label
      const html = `
        <div style="display:flex;align-items:center;">
          <div style="width:18px;height:18px;border-radius:9999px;border:2px solid white;background:${m.color ?? '#2563eb'};box-shadow:0 2px 6px rgba(0,0,0,0.15);"></div>
        </div>
      `;
      const icon = L.divIcon({ html, className: '', iconSize: [18, 18], iconAnchor: [9, 9] });
      const marker = L.marker([m.position.lat, m.position.lng], { icon }).addTo(mapInstance.current);

      // Bind a popup showing tourist details (name, id, nationality, status)
      const lastUpdated = m.lastUpdated ? new Date(m.lastUpdated).toLocaleString() : 'Unknown';
      const statusColor = m.status === 'Alert' || m.color === '#ef4444' ? '#dc2626' : '#10b981';
      const popupHtml = `
        <div style="min-width:220px;padding:8px;font-family:Inter, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial;">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
            <div style="font-weight:700;font-size:16px;color:#111827">${m.name ?? 'Unknown'}</div>
            <button style="background:transparent;border:0;font-size:16px;color:#9CA3AF;cursor:pointer">&times;</button>
          </div>
          <div style="font-size:12px;color:#374151;margin-bottom:6px">ID: <strong style="color:#111827">${m.nationalId ?? m.id}</strong></div>
          <div style="font-size:12px;color:#374151;margin-bottom:6px">Nationality: <strong style="color:#111827">${m.nationality ?? 'Unknown'}</strong></div>
          <div style="display:flex;align-items:center;gap:8px;justify-content:space-between;margin-top:6px">
            <div style="font-size:12px;color:#6b7280">Updated: ${lastUpdated}</div>
            <div style="padding:6px 10px;border-radius:999px;background:${statusColor};color:white;font-weight:700;font-size:12px">${m.status ?? (m.color === '#ef4444' ? 'Alert' : 'Safe')}</div>
          </div>
        </div>
      `;
      marker.bindPopup(popupHtml as any, { offset: [0, -10] });

      return marker;
    });

    // expose helper to parent once markers are created
    if (onReady) {
      onReady({
        focusOnMarker: (id: string) => {
          const mk = markerInstances.current.find((mi) => (mi.getPopup && mi.getPopup().getContent && mi.getPopup().getContent().includes(id)));
          if (mk) {
            mk.openPopup();
            mapInstance.current.panTo(mk.getLatLng());
          }
        },
        focusOnLocation: (lat: number, lng: number, label?: string) => {
          try {
            mapInstance.current.panTo([lat, lng]);
            const popup = L.popup({ offset: [0, -10], closeButton: true })
              .setLatLng([lat, lng])
              .setContent(`<div style="min-width:180px;font-family:Inter, system-ui, -apple-system">${label ? `<div style='font-weight:700;margin-bottom:4px'>${label}</div>` : ''}<div style='font-size:12px;color:#374151'>Location: <strong>${lat.toFixed(5)}, ${lng.toFixed(5)}</strong></div></div>`);
            popup.openOn(mapInstance.current);
          } catch (e) {
            try { mapInstance.current.setView([lat, lng]); } catch {}
          }
        }
      });
    }

    // Clear existing pulse animations
    pulseCirclesRef.current.forEach((c) => mapInstance.current.removeLayer(c));
    pulseCirclesRef.current = [];
    pulseTimersRef.current.forEach((t) => window.clearInterval(t));
    pulseTimersRef.current = [];

    // Create pulsing circles for SOS ids
    const idToMarker = new Map<string, { position: LatLng }>();
    markers.forEach((m) => idToMarker.set(m.id, { position: m.position }));
    sosIds.forEach((id) => {
      const found = idToMarker.get(id);
      if (!found) return;
      const circle = L.circle([found.position.lat, found.position.lng], {
        radius: 120,
        color: '#ef4444',
        weight: 0,
        fillColor: '#ef4444',
        fillOpacity: 0.35,
      }).addTo(mapInstance.current);
      pulseCirclesRef.current.push(circle);
      let radius = 80;
      let opacity = 0.35;
      const timer = window.setInterval(() => {
        radius += 30;
        opacity -= 0.02;
        if (radius > 500) { radius = 80; opacity = 0.35; }
        circle.setStyle({ fillOpacity: Math.max(0.05, opacity) });
        circle.setRadius(radius);
      }, 60);
      pulseTimersRef.current.push(timer);
    });
  }, [ready, center, JSON.stringify(markers), JSON.stringify(zones), JSON.stringify(sosIds)]);

  useEffect(() => {
    if (!mapInstance.current) return;
    const map = mapInstance.current;
    const onZoomEnd = () => {
      // ensure pulse circles and markers remain on top after zoom
      pulseCirclesRef.current.forEach((c) => { try { c.bringToFront?.(); } catch {} });
      markerInstances.current.forEach((m) => { try { m.bringToFront?.(); } catch {} });
    };
    map.on && map.on('zoomend', onZoomEnd);
    return () => { map.off && map.off('zoomend', onZoomEnd); };
  }, [mapInstance.current]);

  return (
    <div style={{ height }} className="relative">
      <div ref={mapRef} style={containerStyle} />
      {/* Legend (non-blocking) */}
      {showOverlay && (
        <div className="absolute top-3 left-3 bg-white rounded-2xl p-4 shadow-xl border border-gray-200 z-30" style={{ width: 320, pointerEvents: 'none', opacity: 0.96 }}>
          <div className="text-lg font-bold text-gray-900 mb-3">Live Tourist Monitoring</div>
          <div className="relative mb-4">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="7"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            </span>
            <input
              value={search}
              onChange={(e) => { setSearch(e.target.value); onSearchChange?.(e.target.value); }}
              placeholder="Search by name or ID..."
              className="w-full border border-gray-200 rounded-xl pl-11 pr-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 bg-white pointer-events-auto"
            />
          </div>
          <div className="flex items-center justify-between text-sm pointer-events-none">
            <div className="flex items-center gap-3 text-green-700">
              <span className="inline-flex items-center justify-center w-6 h-6 bg-green-50 rounded-full text-green-600">👤</span>
              <div>
                <div className="text-sm font-semibold text-green-700">{markers.length} Tourists Active</div>
              </div>
            </div>
            <div className="flex items-center gap-3 text-red-700">
              <span className="inline-flex items-center justify-center w-6 h-6 bg-red-50 rounded-full text-red-600">⚠️</span>
              <div>
                <div className="text-sm font-semibold text-red-700">{sosIds.length} SOS Alerts</div>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="absolute top-3 right-3 bg-white/90 rounded-lg p-2 shadow text-xs z-30" style={{ pointerEvents: 'none', opacity: 0.96 }}>
        <div className="flex items-center space-x-2 mb-1 pointer-events-auto"><span className="inline-block w-3 h-3 rounded-full" style={{background:'#16a34a'}}></span><span>Safe Zone</span></div>
        <div className="flex items-center space-x-2 mb-1 pointer-events-auto"><span className="inline-block w-3 h-3 rounded-full" style={{background:'#f59e0b'}}></span><span>Alert Zone</span></div>
        <div className="flex items-center space-x-2 pointer-events-auto"><span className="inline-block w-3 h-3 rounded-full" style={{background:'#ef4444'}}></span><span>Danger Zone</span></div>
      </div>
    </div>
  );
}


