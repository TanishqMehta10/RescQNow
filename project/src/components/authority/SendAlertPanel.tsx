import React, { useState } from 'react';

export default function SendAlertPanel() {
  const [alert, setAlert] = useState('');
  const [sent, setSent] = useState(false);
  const handleSend = () => {
    setSent(true);
    setTimeout(() => setSent(false), 2000);
    setAlert('');
  };
  return (
    <div className="max-w-lg mx-auto bg-white rounded-2xl shadow-xl p-8 mt-8">
      <h2 className="text-2xl font-bold mb-4 text-[#1a237e]">Send Alert</h2>
      <textarea
        className="w-full border rounded-lg px-3 py-2 mb-4"
        placeholder="Type your alert message..."
        value={alert}
        onChange={e => setAlert(e.target.value)}
        rows={4}
      />
      <button
        className="w-full bg-[#ff9800] text-white py-2 rounded-lg font-semibold hover:bg-[#e65100] transition"
        onClick={handleSend}
        disabled={!alert.trim()}
      >
        Send Alert
      </button>
      {sent && <div className="mt-4 text-green-700 font-semibold text-center">Alert sent to all tourists!</div>}
    </div>
  );
}
