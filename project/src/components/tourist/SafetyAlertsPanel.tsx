import React from 'react';
import { X, AlertTriangle, Shield, Clock, MapPin } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function SafetyAlertsPanel({ open, onClose }: Props) {
  const { t } = useLanguage();
  if (!open) return null;

  const alerts = [
    { type: 'warning', title: 'High crowd density', location: 'Marina Beach area', time: '5 min ago', icon: AlertTriangle, color: 'yellow' },
    { type: 'info', title: 'Weather advisory', location: 'Heavy rain expected', time: '15 min ago', icon: Shield, color: 'blue' },
    { type: 'success', title: 'Safe zone entered', location: 'Government Museum', time: '1 hour ago', icon: Shield, color: 'green' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/40">
      <div className="w-full md:max-w-xl bg-white rounded-t-2xl md:rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 text-orange-600" />
            <span className="font-semibold text-gray-800">{t('safetyAlerts')}</span>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>
        <div className="p-5 space-y-3 max-h-[70vh] overflow-y-auto">
          {alerts.map((alert, index) => (
            <div key={index} className={`flex items-start p-4 rounded-xl border-l-4 ${
              alert.color === 'yellow' ? 'bg-yellow-50 border-yellow-400' :
              alert.color === 'blue' ? 'bg-blue-50 border-blue-400' :
              'bg-green-50 border-green-400'
            }`}>
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center mr-3 ${
                alert.color === 'yellow' ? 'bg-yellow-100' :
                alert.color === 'blue' ? 'bg-blue-100' : 'bg-green-100'
              }`}>
                <alert.icon className={`w-4 h-4 ${
                  alert.color === 'yellow' ? 'text-yellow-600' :
                  alert.color === 'blue' ? 'text-blue-600' : 'text-green-600'
                }`} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-800">{alert.title}</p>
                <p className="text-xs text-gray-600 flex items-center"><MapPin className="w-3 h-3 mr-1" />{alert.location}</p>
                <div className="flex items-center mt-2">
                  <Clock className="w-3 h-3 text-gray-400 mr-1" />
                  <span className="text-xs text-gray-500">{alert.time}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


