import { useState } from 'react';

interface HeaderProps {
  activeTab: 'swap' | 'explore' | 'leaderboard' | 'chart';
  onTabChange: (tab: 'swap' | 'explore' | 'leaderboard' | 'chart') => void;
}

export default function Header({ activeTab, onTabChange }: HeaderProps) {
  const [connected, setConnected] = useState(false);

  return (
    <header className="header">
      <div style={{ display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap' }}>
        <a href="#" className="header-brand" onClick={(e) => { e.preventDefault(); onTabChange('explore'); }}>
          <svg className="header-logo" viewBox="0 0 64 64" fill="none">
            <rect width="64" height="64" rx="16" fill="#121218"/>
            <defs>
              <linearGradient id="logoG" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#a855f7"/>
                <stop offset="100%" stopColor="#22c55e"/>
              </linearGradient>
            </defs>
            <path d="M24 12h16l-3 22H27l-3-22z" fill="url(#logoG)" opacity="0.9"/>
            <rect x="26" y="38" width="12" height="6" rx="2" fill="#a855f7" opacity="0.7"/>
            <rect x="28" y="46" width="8" height="4" rx="1" fill="#22c55e" opacity="0.5"/>
            <circle cx="32" cy="24" r="4" fill="#0a0a0f" opacity="0.4"/>
          </svg>
          {/* <span className="header-title">vialswap</span> */}
        </a>
      </div>

      <div className="header-nav">
        <button
          className={`nav-btn ${activeTab === 'explore' ? 'active' : ''}`}
          onClick={() => onTabChange('explore')}
        >
          Explore
        </button>
        <button
          className={`nav-btn ${activeTab === 'swap' ? 'active' : ''}`}
          onClick={() => onTabChange('swap')}
        >
          Swap
        </button>
        <button
          className={`nav-btn ${activeTab === 'chart' ? 'active' : ''}`}
          onClick={() => onTabChange('chart')}
        >
          Charts
        </button>
        <button
          className={`nav-btn ${activeTab === 'leaderboard' ? 'active' : ''}`}
          onClick={() => onTabChange('leaderboard')}
        >
          Leaderboard
        </button>
        <button
          className="connect-btn"
          onClick={() => setConnected(!connected)}
        >
          {connected ? '0x1a2b...3c4d' : 'Connect Wallet'}
        </button>
      </div>
    </header>
  );
}
