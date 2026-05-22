import { useState } from 'react';
import { compounds } from '../data';
import CompoundCard from './CompoundCard';
import type { Stage } from '../types';

const stages: (Stage | 'all')[] = ['all', 'pre-bonding', 'bonding', 'launched', 'graduated'];

export default function Explore() {
  const [filter, setFilter] = useState<Stage | 'all'>('all');

  const filtered = filter === 'all'
    ? compounds
    : compounds.filter((c) => c.stage === filter);

  return (
    <div className="tab-content">
      <div className="hero">
        <h1>vialswap</h1>
        <p>
          Trade, earn, and own vials on the all-in-one multichain DEX.
        </p>
        <span className="hero-tag">
          ✦ 420+ compounds ✦ 69 chains ✦ full degen
        </span>
      </div>

      <div className="stats-bar">
        <div className="stat-item">
          <span className="stat-label">Total Compounds</span>
          <span className="stat-value purple">{compounds.length}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Total Holders</span>
          <span className="stat-value">{compounds.reduce((s, c) => s + c.holders, 0).toLocaleString()}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">24h Volume</span>
          <span className="stat-value green">${compounds.reduce((s, c) => s + c.volume24h, 0).toLocaleString()}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Total +Elation</span>
          <span className="stat-value purple">{compounds.reduce((s, c) => s + c.elationPoints, 0).toLocaleString()}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Bonding</span>
          <span className="stat-value green">{compounds.filter((c) => c.stage === 'bonding').length} active</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Pre-bonding</span>
          <span className="stat-value purple">{compounds.filter((c) => c.stage === 'pre-bonding').length} gems</span>
        </div>
      </div>

      <div className="section-header">
        <h2>
          <span className="accent">⚗️</span> All Compounds
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 400, marginLeft: 8 }}>
            ({filtered.length})
          </span>
        </h2>
        <div className="filter-group">
          {stages.map((s) => (
            <button
              key={s}
              className={`filter-btn ${filter === s ? 'active' : ''}`}
              onClick={() => setFilter(s)}
            >
              {s === 'all' ? 'All' : s.replace('-', ' ')}
            </button>
          ))}
        </div>
      </div>

      <div className="compound-grid">
        {filtered.map((compound) => (
          <CompoundCard key={compound.id} compound={compound} />
        ))}
      </div>
    </div>
  );
}
