import React from 'react';
import { X, Shield, QrCode, ToggleLeft, ToggleRight, Lock, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

type Props = {
  open: boolean;
  onClose: () => void;
  trackingOptIn: boolean;
  setTrackingOptIn: (v: boolean) => void;
};

export default function SettingsPanel({ open, onClose, trackingOptIn, setTrackingOptIn }: Props) {
  const navigate = useNavigate();
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/40">
      <div className="w-full md:max-w-lg bg-white rounded-t-2xl md:rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b">
          <div className="flex items-center space-x-2">
            <Shield className="w-5 h-5 text-blue-600" />
            <span className="font-semibold text-gray-800">Settings</span>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <button onClick={() => { onClose(); navigate('/tourist/digital-id'); }} className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-xl">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <QrCode className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-800">Digital ID</p>
                <p className="text-xs text-gray-500">View and download your blockchain ID</p>
              </div>
            </div>
            <span className="text-blue-600 text-sm font-medium">Open</span>
          </button>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Lock className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-800">Live Tracking (Opt‑in)</p>
                <p className="text-xs text-gray-500">Share location with safety services</p>
              </div>
            </div>
            <button onClick={() => setTrackingOptIn(!trackingOptIn)} className="p-2">
              {trackingOptIn ? <ToggleRight className="w-8 h-8 text-green-600" /> : <ToggleLeft className="w-8 h-8 text-gray-400" />}
            </button>
          </div>

          <button onClick={() => { localStorage.removeItem('touristAuth'); sessionStorage.removeItem('touristAuth'); onClose(); navigate('/'); }} className="w-full flex items-center justify-between p-4 bg-red-50 hover:bg-red-100 rounded-xl">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <LogOut className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-red-700">Sign Out</p>
                <p className="text-xs text-red-500">Return to home</p>
              </div>
            </div>
            <span className="text-red-600 text-sm font-medium">Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
}


