import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

type Role = 'tourist' | 'authority' | 'guest';
type NavItem = { to: string; label: string };
const navItems: Record<Role, NavItem[]> = {
  tourist: [
    { to: '/tourist/dashboard', label: 'Dashboard' },
    { to: '/tourist/digital-id', label: 'Digital ID' },
    { to: '/tourist/kyc', label: 'KYC' },
    { to: '/tourist/login', label: 'Logout' },
  ],
  authority: [
    { to: '/authority/dashboard', label: 'Dashboard' },
    { to: '/authority/login', label: 'Logout' },
  ],
  guest: [
    { to: '/', label: 'Home' },
    { to: '/tourist/login', label: 'Tourist Login' },
    { to: '/authority/login', label: 'Authority Login' },
  ],
};

interface NavigationBarProps {
  role?: Role;
}

export default function NavigationBar({ role = 'guest' }: NavigationBarProps) {
  const { language, setLanguage } = useLanguage();
  const location = useLocation();
  return (
    <nav className="bg-white/90 backdrop-blur-lg border-b border-gray-100 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold text-[#1a237e] tracking-wide">Smart Tourist Safety</Link>
        <div className="flex items-center gap-4">
          <select
            value={language}
            onChange={e => setLanguage(e.target.value as 'en' | 'hi' | 'mr' | 'bn' | 'te')}
            className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="en">🇺🇸 EN</option>
            <option value="hi">🇮🇳 HI</option>
            <option value="mr">🇮🇳 MR</option>
            <option value="bn">🇧🇩 BN</option>
            <option value="te">🇮🇳 TE</option>
          </select>
          {navItems[role].map((item: NavItem) => (
            <Link
              key={item.to}
              to={item.to}
              className={`font-medium px-3 py-2 rounded-lg transition-colors ${location.pathname === item.to ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-blue-50 hover:text-blue-700'}`}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
