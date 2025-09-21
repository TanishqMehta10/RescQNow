import { useMemo } from 'react';
import { useRealtimeStore } from '../../store/realtime';

type SosAlert = { id: string; userId: string; time: number; position?: { lat: number; lng: number } };
type SafetyAlert = { id: string; userId: string; time: number; zoneId: string };

const DEFAULT_NATIONALITY = [
  { name: 'Indian', value: 7 },
  { name: 'American', value: 2 },
  { name: 'Thai', value: 1 },
  { name: 'Chinese', value: 1 },
  { name: 'Other', value: 2 }
];

const DEFAULT_ALERTS = [
  { type: 'medical', value: 6 },
  { type: 'sos', value: 4 },
  { type: 'theft', value: 3 },
  { type: 'harassment', value: 1 },
  { type: 'accident', value: 1 }
];

const COLORS = ['#10b981', '#0ea5e9', '#fb923c', '#f59e0b', '#3b82f6'];

export default function AnalyticsDashboard({ sosAlerts, safetyAlerts }: { sosAlerts?: SosAlert[]; safetyAlerts?: SafetyAlert[] }) {
  const tourists = useRealtimeStore((s) => s.tourists);

  const nationalityData = useMemo(() => {
    const counts: Record<string, number> = {};
    const vals = Object.values(tourists || {});
    if (vals.length > 0) {
      vals.forEach((t: any) => {
        const nat = t.nationality || 'Other';
        counts[nat] = (counts[nat] || 0) + 1;
      });
      return Object.entries(counts).map(([name, value]) => ({ name, value }));
    }
    return DEFAULT_NATIONALITY;
  }, [tourists]);

  const alertsData = useMemo(() => {
    const source = [...(sosAlerts || []), ...(safetyAlerts || [])];
    if (source.length > 0) {
      const counts: Record<string, number> = {};
      source.forEach((a: any) => {
        const type = a.type || (a.zoneId ? 'geofence' : 'sos') || 'unknown';
        counts[type] = (counts[type] || 0) + 1;
      });
      const result = Object.entries(counts).map(([type, value]) => ({ type, value }));
      result.sort((a, b) => b.value - a.value);
      return result;
    }
    return DEFAULT_ALERTS;
  }, [sosAlerts, safetyAlerts]);

  return (
    <div className="w-full max-w-6xl mx-auto bg-white rounded-2xl shadow-xl p-6">
      <h2 className="text-3xl font-extrabold text-gray-900 mb-6">Analytics & Reporting</h2>
      <p className="text-sm text-gray-600 mb-6">Insights into tourist activity and safety metrics.</p>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border shadow p-4 flex flex-col">
          <div className="flex items-center gap-2 text-lg font-semibold mb-2"><span>🌐</span> Tourists by Nationality</div>
          <div className="h-64">
            {/* Fallback lightweight pie (simple SVG segments + legend) */}
            <div className="flex items-center gap-6 w-full">
              <svg viewBox={`0 0 260 260`} className="mx-auto w-56 h-56">
                {(() => {
                  const total = nationalityData.reduce((s, d) => s + d.value, 0) || 1;
                  let startAcc = 0;
                  const cx = 130;
                  const cy = 130;
                  const r = 100;
                  const elements: JSX.Element[] = [];
                  nationalityData.forEach((d, i) => {
                    const startAngle = (startAcc / total) * 360;
                    startAcc += d.value;
                    const endAngle = (startAcc / total) * 360;
                    const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';
                    const startRad = ((startAngle - 90) * Math.PI) / 180.0;
                    const endRad = ((endAngle - 90) * Math.PI) / 180.0;
                    const x1 = cx + r * Math.cos(startRad);
                    const y1 = cy + r * Math.sin(startRad);
                    const x2 = cx + r * Math.cos(endRad);
                    const y2 = cy + r * Math.sin(endRad);
                    const path = `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${largeArcFlag} 0 ${x2} ${y2} Z`;
                    elements.push(<path key={d.name} d={path} fill={COLORS[i % COLORS.length]} stroke="#fff" strokeWidth={1} />);
                  });
                  return elements;
                })()}
              </svg>

              <div className="flex-1">
                <div className="space-y-3">
                  {nationalityData.map((d, i) => (
                    <div key={d.name} className="flex items-center gap-3 text-sm">
                      <span className="inline-block w-3 h-3 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
                      <div className="flex-1 flex justify-between">
                        <div className="text-gray-700">{d.name}</div>
                        <div className="text-gray-700 font-semibold">{d.value}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl border shadow p-4">
          <div className="flex items-center gap-2 text-lg font-semibold mb-2"><span>⚠️</span> SOS Alerts by Type</div>
          <div className="h-64">
            <div className="h-full flex flex-col justify-center w-full">
              <div className="space-y-4 w-full">
                {alertsData.map((d, _) => {
                  const max = Math.max(...alertsData.map((x) => x.value), 1);
                  const pct = (d.value / max) * 100;
                  return (
                    <div key={d.type} className="flex items-center gap-4">
                      <div className="w-28 text-sm text-gray-600 capitalize">{d.type}</div>
                      <div className="flex-1 bg-gray-100 rounded-full h-8 overflow-hidden relative">
                        <div
                          className="absolute left-0 top-0 bottom-0 rounded-l-full"
                          style={{ width: `${Math.max(6, pct)}%`, background: '#fb923c' }}
                        />
                      </div>
                      <div className="w-10 text-right text-sm text-gray-700 font-semibold">{d.value}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
