import React, { useState } from 'react';

const mockTourists = [
  { id: 'T001234', name: 'John Doe', nationality: 'Indian', status: 'Safe' },
  { id: 'T001235', name: 'Jane Smith', nationality: 'British', status: 'Warning' },
  { id: 'T001236', name: 'Wang Li', nationality: 'Chinese', status: 'Safe' },
];

export default function TouristManagement() {
  const [search, setSearch] = useState('');
  const filtered = mockTourists.filter(t => t.name.toLowerCase().includes(search.toLowerCase()) || t.id.includes(search));
  return (
    <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl p-8 mt-8">
      <h2 className="text-2xl font-bold mb-4 text-[#1a237e]">Tourist Management</h2>
      <input
        className="w-full border rounded-lg px-3 py-2 mb-4"
        placeholder="Search by name or ID..."
        value={search}
        onChange={e => setSearch(e.target.value)}
      />
      <table className="w-full text-left border-t">
        <thead>
          <tr className="text-gray-700">
            <th className="py-2">ID</th>
            <th>Name</th>
            <th>Nationality</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map(t => (
            <tr key={t.id} className="border-t hover:bg-blue-50">
              <td className="py-2 font-mono">{t.id}</td>
              <td>{t.name}</td>
              <td>{t.nationality}</td>
              <td>
                <span className={`px-2 py-1 rounded text-xs font-semibold ${t.status === 'Safe' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{t.status}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
