import { useState } from 'react';
import './App.css';
import Header from './components/Header';
import Explore from './components/Explore';
import SwapPanel from './components/SwapPanel';
import Leaderboard from './components/Leaderboard';
import Chart from './components/Chart';

const shakerSymbols = ['⚗️', '💉', '🧪', '🔬', '💊', '🧬', '⚕️', '🧴', '🔮', '✨', '🌀', '💜'];

export default function App() {
  const [tab, setTab] = useState<'swap' | 'explore' | 'leaderboard' | 'chart'>('explore');

  return (
    <div className="app">
      <div className="floating-shakers" aria-hidden="true">
        {shakerSymbols.map((s, i) => (
          <span key={i} className="shaker-item">{s}</span>
        ))}
      </div>

      <Header activeTab={tab} onTabChange={setTab} />

      {tab === 'explore' && <Explore />}
      {tab === 'swap' && <SwapPanel />}
      {tab === 'chart' && <Chart />}
      {tab === 'leaderboard' && <Leaderboard />}

      <footer style={{
        marginTop: 80,
        padding: '20px 0',
        borderTop: '1px solid var(--border)',
        textAlign: 'center',
        fontSize: '0.7rem',
        fontFamily: 'var(--font-mono)',
        color: 'var(--text-muted)',
      }}>
        vialswap {new Date().getFullYear()}
        <br />
        <span style={{ fontSize: '0.6rem', opacity: 0.6 }}>
          vials are not securities.
        </span>
      </footer>
    </div>
  );
}
