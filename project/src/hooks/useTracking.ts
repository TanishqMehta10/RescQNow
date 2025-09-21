import { useEffect } from 'react';
import { bus, useRealtimeStore } from '../store/realtime';
import { computeSafetyScoreFromZones, getZonesForPosition } from '../utils/geofence';

export function useTracking(userId: string, enabled: boolean) {
  const updateTourist = useRealtimeStore((s) => s.updateTourist);
  const setTracking = useRealtimeStore((s) => s.setTracking);

  useEffect(() => {
    if (!enabled) {
      setTracking(userId, false);
      return;
    }
    setTracking(userId, true);

    let watchId: number | null = null;
    if (navigator.geolocation) {
      watchId = navigator.geolocation.watchPosition(
        (pos) => {
          const position = { lat: pos.coords.latitude, lng: pos.coords.longitude, accuracy: pos.coords.accuracy };
          const zones = getZonesForPosition(position);
          const safetyScore = computeSafetyScoreFromZones(zones);
          updateTourist(userId, { lastPosition: position, lastUpdated: Date.now(), safetyScore });
          bus.emit('location:update', { userId, position, timestamp: Date.now() });
          // Emit geofence alerts when entering high or restricted areas
          zones.forEach((z) => {
            if (z.riskLevel === 'high' || z.riskLevel === 'restricted') {
              bus.emit('alert:geofence', { userId, zoneId: z.id, level: 'enter', timestamp: Date.now() });
            }
          });
        },
        () => {},
        { enableHighAccuracy: true, maximumAge: 10000, timeout: 10000 }
      );
    }

    return () => {
      if (watchId !== null && navigator.geolocation) navigator.geolocation.clearWatch(watchId);
      setTracking(userId, false);
    };
  }, [userId, enabled, setTracking, updateTourist]);
}


