function toRad(value: number): number { return (value * Math.PI) / 180; }
function getDistance(a: { latitude: number; longitude: number }, b: { latitude: number; longitude: number }): number {
  const R = 6371000; // meters
  const dLat = toRad(b.latitude - a.latitude);
  const dLon = toRad(b.longitude - a.longitude);
  const lat1 = toRad(a.latitude);
  const lat2 = toRad(b.latitude);
  const sinDLat = Math.sin(dLat / 2);
  const sinDLon = Math.sin(dLon / 2);
  const c = 2 * Math.asin(Math.sqrt(sinDLat * sinDLat + Math.cos(lat1) * Math.cos(lat2) * sinDLon * sinDLon));
  return R * c;
}

export type LatLng = { lat: number; lng: number };

export type GeoZone = {
  id: string;
  name: string;
  center: LatLng;
  radiusMeters: number;
  riskLevel: 'low' | 'medium' | 'high' | 'restricted';
};

export const sampleZones: GeoZone[] = [
  // Mountainous region (e.g., near Shillong outskirts)
  { id: 'ne-mountain-1', name: 'Shillong Hills', center: { lat: 25.5788, lng: 91.8933 }, radiusMeters: 30000, riskLevel: 'medium' },
  // River valley / flood-prone area along Brahmaputra
  { id: 'ne-river-1', name: 'Brahmaputra Floodplain', center: { lat: 26.1445, lng: 91.7362 }, radiusMeters: 45000, riskLevel: 'medium' },
  // Protected national park area
  { id: 'ne-park-1', name: 'Kaziranga National Park (buffer)', center: { lat: 26.5775, lng: 93.1711 }, radiusMeters: 25000, riskLevel: 'high' },
  // Steep valleys / landslide-prone zone
  { id: 'ne-landslide-1', name: 'Mawphlang Slopes', center: { lat: 25.6020, lng: 91.8382 }, radiusMeters: 12000, riskLevel: 'high' },
  // Restricted border area (simulated)
  { id: 'ne-restrict-1', name: 'Border Security Buffer', center: { lat: 26.7000, lng: 92.0000 }, radiusMeters: 35000, riskLevel: 'restricted' },
  // Safe urban zone (e.g., Guwahati downtown)
  { id: 'ne-safe-1', name: 'Guwahati Downtown', center: { lat: 26.1445, lng: 91.7362 }, radiusMeters: 8000, riskLevel: 'low' },
];

export function isInsideZone(position: LatLng, zone: GeoZone): boolean {
  const distance = getDistance(
    { latitude: position.lat, longitude: position.lng },
    { latitude: zone.center.lat, longitude: zone.center.lng }
  );
  return distance <= zone.radiusMeters;
}

export function getZonesForPosition(position: LatLng, zones: GeoZone[] = sampleZones): GeoZone[] {
  return zones.filter((z) => isInsideZone(position, z));
}

export function computeSafetyScoreFromZones(zones: GeoZone[]): number {
  if (zones.length === 0) return 95;
  const penalties = zones.map((z) =>
    z.riskLevel === 'low' ? 0 : z.riskLevel === 'medium' ? 15 : z.riskLevel === 'high' ? 35 : 50
  );
  const totalPenalty = Math.min(80, Math.max(0, Math.max(...penalties)));
  return Math.max(5, 100 - totalPenalty);
}


