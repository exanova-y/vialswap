import { useState, useCallback } from 'react';
import type { Compound } from '../types';
import { stageColors } from '../data';

const compoundGradients: Record<string, string> = {
  'estradiol': 'linear-gradient(135deg, #a855f7, #d946ef)',
  'estradiol-valerate': 'linear-gradient(135deg, #a855f7, #c084fc)',
  'estradiol-cypionate': 'linear-gradient(135deg, #8b5cf6, #a855f7)',
  'estradiol-enanthate': 'linear-gradient(135deg, #7e22ce, #a855f7)',
  'testosterone-cypionate': 'linear-gradient(135deg, #22c55e, #16a34a)',
  'testosterone-enanthate': 'linear-gradient(135deg, #16a34a, #15803d)',
  'progesterone': 'linear-gradient(135deg, #f59e0b, #d97706)',
  'nad-plus': 'linear-gradient(135deg, #06b6d4, #0891b2)',
  'dsip': 'linear-gradient(135deg, #6366f1, #4f46e5)',
  'bpc-157': 'linear-gradient(135deg, #ec4899, #db2777)',
  'semaglutide': 'linear-gradient(135deg, #ef4444, #dc2626)',
  'tirzepatide': 'linear-gradient(135deg, #f97316, #ea580c)',
  // 'nanodrop-melatonin': 'linear-gradient(135deg, #8b5cf6, #6d28d9)',
  'ghk-cu': 'linear-gradient(135deg, #14b8a6, #0d9488)',
  'spironolactone': 'linear-gradient(135deg, #64748b, #475569)',
  'bicalutamide': 'linear-gradient(135deg, #a855f7, #7e22ce)',
  'wellbutrin': 'linear-gradient(135deg, #f43f5e, #be123c)',
  'concerta/methylphenidate': 'linear-gradient(135deg, #fbbf24, #f59e0b)',
  'nac': 'linear-gradient(135deg, #10b981, #047857)',
  'choline': 'linear-gradient(135deg, #38bdf8, #0284c7)',
  'nicotine': 'linear-gradient(135deg, #facc15, #a16207)',
};

function formatCompact(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M';
  if (n >= 1_000) return (n / 1_000).toFixed(1) + 'K';
  return n.toFixed(0);
}

function formatUSD(n: number): string {
  if (n >= 1_000_000) return '$' + (n / 1_000_000).toFixed(2) + 'M';
  if (n >= 1_000) return '$' + (n / 1_000).toFixed(1) + 'K';
  return '$' + n.toFixed(2);
}

function formatPrice(n: number): string {
  if (n < 0.01) return '$' + n.toFixed(4);
  return '$' + n.toFixed(4);
}

interface CompoundCardProps {
  compound: Compound;
}

export default function CompoundCard({ compound }: CompoundCardProps) {
  const [shaking, setShaking] = useState(false);
  const { id, name, symbol, description, stage, location, holders, volume24h, price, bondingProgress, funding, fundingTarget, elationPoints, priceChange24h, marketCap } = compound;

  const handleShake = useCallback(() => {
    setShaking(true);
    setTimeout(() => setShaking(false), 500);
  }, []);

  return (
    <div
      className={`compound-card ${shaking ? 'shake' : ''}`}
      onClick={handleShake}
    >
      <div className="compound-card-header">
        <div className="compound-name-group">
          <div
            className="compound-icon"
            style={{ background: compoundGradients[id] || 'linear-gradient(135deg, var(--purple), var(--green))' }}
          >
            {symbol.slice(0, 3)}
          </div>
          <div>
            <div className="compound-name">{name}</div>
            {/* <div className="compound-symbol">{symbol}</div> */}
            <div className="compound-formula">{description}</div>
          </div>
        </div>
        <span
          className="stage-badge"
          style={{
            background: stageColors[stage] + '20',
            color: stageColors[stage],
            border: `1px solid ${stageColors[stage]}40`,
          }}
        >
          {stage}
        </span>
      </div>

      <div className="compound-stats">
        <div className="compound-stat">
          <span className="label">Location</span>
          <span className="value">{location}</span>
        </div>
        <div className="compound-stat">
          <span className="label">Holders</span>
          <span className="value">{formatCompact(holders)}</span>
        </div>
        <div className="compound-stat">
          <span className="label">24h Volume</span>
          <span className="value">{formatUSD(volume24h)}</span>
        </div>
        <div className="compound-stat">
          <span className="label">Price</span>
          <span className="value">{formatPrice(price)}</span>
        </div>
        <div className="compound-stat">
          <span className="label">Price 24h</span>
          <span className={`value ${priceChange24h >= 0 ? 'green' : 'red'}`}>
            {priceChange24h >= 0 ? '+' : ''}{priceChange24h.toFixed(1)}%
          </span>
        </div>
        <div className="compound-stat">
          <span className="label">Market Cap</span>
          <span className="value">{formatUSD(marketCap)}</span>
        </div>
        <div className="compound-stat">
          <span className="label">Funding</span>
          <span className="value">{formatUSD(funding)} / {formatUSD(fundingTarget)}</span>
        </div>
        <div className="compound-stat">
          <span className="label">+Elation</span>
          <span className="value purple">{formatCompact(elationPoints)}</span>
        </div>
        <div className="bonding-bar">
          <div className="bonding-track">
            <div className="bonding-fill" style={{ width: bondingProgress + '%' }} />
          </div>
          <div className="bonding-label">
            <span>Bonding Curve</span>
            <span>{bondingProgress}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
