import React, { useCallback } from 'react';
import { AlertTriangle } from 'lucide-react';
import { bus, useRealtimeStore } from '../store/realtime';

type Props = { className?: string };

export default function PanicButton({ className }: Props) {
  const currentUserId = useRealtimeStore((s) => s.currentUserId);

  const handleClick = useCallback(() => {
    if (!currentUserId) return alert('Not authenticated');
    const timestamp = Date.now();
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const position = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          bus.emit('sos:triggered', { userId: currentUserId, position, timestamp });
          // Attempt to share location link
          const link = `https://www.google.com/maps?q=${position.lat},${position.lng}`;
          if (navigator.share) {
            navigator.share({ title: 'Emergency SOS Location', text: 'Help needed. Live location:', url: link }).catch(() => {});
          }
          alert('SOS sent with live location to authorities and contacts.');
        },
        () => {
          bus.emit('sos:triggered', { userId: currentUserId, timestamp });
          alert('SOS sent. Location unavailable.');
        },
        { enableHighAccuracy: true, timeout: 8000 }
      );
    } else {
      bus.emit('sos:triggered', { userId: currentUserId, timestamp });
      alert('SOS sent. Location unavailable.');
    }
  }, [currentUserId]);

  return (
    <button onClick={handleClick} className={className ?? 'w-full bg-red-600 text-white py-4 rounded-2xl font-bold'}>
      <div className="flex items-center justify-center space-x-3">
        <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
          <AlertTriangle className="w-6 h-6 text-white" />
        </div>
        <span>Emergency SOS</span>
      </div>
    </button>
  );
}


