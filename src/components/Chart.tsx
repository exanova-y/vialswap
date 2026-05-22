import { useState, useMemo } from 'react';
import { compounds } from '../data';
import { generateCandles } from '../lib/ohlc';
import type { Candle } from '../lib/ohlc';

const PAD_LEFT = 60;
const PAD_RIGHT = 60;
const PAD_TOP = 20;
const PAD_BOTTOM = 40;
const VOL_HEIGHT = 50;

function formatPrice(n: number): string {
  if (n < 0.01) return '$' + n.toFixed(4);
  if (n < 1) return '$' + n.toFixed(3);
  return '$' + n.toFixed(2);
}

function formatTime(ts: number, i: number, total: number): string {
  const d = new Date(ts);
  // show date every ~14 candles, and always first/last
  if (i === 0 || i === total - 1 || i % 14 === 0) {
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }
  return '';
}

function formatVolume(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M';
  if (n >= 1_000) return (n / 1_000).toFixed(1) + 'K';
  return n.toFixed(0);
}

export default function Chart() {
  const [selectedId, setSelectedId] = useState(compounds[0].id);
  const [timeframe, setTimeframe] = useState<'1H' | '4H' | '1D' | '1W'>('4H');
  const [tooltip, setTooltip] = useState<Candle | null>(null);
  const [tooltipX, setTooltipX] = useState(0);
  const [tooltipY, setTooltipY] = useState(0);

  const compound = compounds.find((c) => c.id === selectedId)!;

  const candles = useMemo(
    () => generateCandles(compound.id, compound.price, 84),
    [compound.id, compound.price],
  );

  const displayCandles = useMemo(() => {
    const factor = { '1H': 1, '4H': 4, '1D': 24, '1W': 168 }[timeframe];
    return candles.filter((_, i) => i % factor === 0);
  }, [candles, timeframe]);

  const width = 860;
  const chartH = 480;
  const candleAreaH = chartH - PAD_TOP - PAD_BOTTOM - VOL_HEIGHT;
  const candleW = Math.max(2, Math.min(8, (width - PAD_LEFT - PAD_RIGHT) / displayCandles.length - 2));

  const prices = displayCandles.flatMap((c) => [c.high, c.low]);
  const maxPrice = Math.max(...prices) * 1.05;
  const minPrice = Math.min(...prices) * 0.95;
  const priceRange = maxPrice - minPrice || 1;

  const volumes = displayCandles.map((c) => c.volume);
  const maxVol = Math.max(...volumes) * 1.2 || 1;

  const toX = (i: number) => PAD_LEFT + i * (candleW + 2) + candleW / 2;
  const toYPrice = (p: number) => PAD_TOP + (1 - (p - minPrice) / priceRange) * candleAreaH;
  const toYVol = (v: number) => chartH - PAD_BOTTOM + (1 - v / maxVol) * VOL_HEIGHT;

  const gridLines = useMemo(() => {
    const lines: number[] = [];
    const step = priceRange / 5;
    for (let i = 0; i <= 5; i++) lines.push(minPrice + step * i);
    return lines;
  }, [minPrice, priceRange]);

  return (
    <div className="tab-content">
      <div className="section-header">
        <h2>
          <span className="accent">📈</span> Charts
        </h2>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
          <select
            className="chart-select"
            value={selectedId}
            onChange={(e) => setSelectedId(e.target.value)}
          >
            {compounds.map((c) => (
              <option key={c.id} value={c.id}>
                {c.symbol} — {c.name}
              </option>
            ))}
          </select>
          {(['1H', '4H', '1D', '1W'] as const).map((tf) => (
            <button
              key={tf}
              className={`filter-btn ${timeframe === tf ? 'active' : ''}`}
              onClick={() => setTimeframe(tf)}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      <div
        className="chart-wrapper"
        onMouseLeave={() => setTooltip(null)}
      >
        <svg
          width="100%"
          viewBox={`0 0 ${width} ${chartH}`}
          style={{ display: 'block', background: 'var(--bg-card)' }}
        >
          {/* Grid */}
          {gridLines.map((p, i) => (
            <g key={i}>
              <line
                x1={PAD_LEFT} y1={toYPrice(p)}
                x2={width - PAD_RIGHT} y2={toYPrice(p)}
                stroke="var(--border)"
                strokeWidth={0.5}
              />
              <text
                x={width - PAD_RIGHT + 8} y={toYPrice(p) + 4}
                fill="var(--text-muted)" fontSize={10}
                fontFamily="var(--font-mono)"
                dominantBaseline="middle"
              >
                {formatPrice(p)}
              </text>
            </g>
          ))}

          {/* Candles */}
          {displayCandles.map((c, i) => {
            const x = toX(i);
            const isUp = c.close >= c.open;
            const color = isUp ? 'var(--green)' : 'var(--red)';
            const bodyTop = Math.max(toYPrice(c.open), toYPrice(c.close));
            const bodyH = Math.max(1, Math.abs(toYPrice(c.close) - toYPrice(c.open)));

            return (
              <g key={i}>
                {/* wick */}
                <line
                  x1={x} y1={toYPrice(c.high)}
                  x2={x} y2={toYPrice(c.low)}
                  stroke={color} strokeWidth={1}
                />
                {/* body */}
                <rect
                  x={x - candleW / 2} y={bodyTop}
                  width={candleW} height={bodyH}
                  fill={color} rx={0.5}
                />
                {/* volume */}
                <rect
                  x={x - candleW / 3} y={toYVol(c.volume)}
                  width={candleW * 0.66}
                  height={chartH - PAD_BOTTOM - toYVol(c.volume)}
                  fill={color} opacity={0.2} rx={0.5}
                />
                {/* hover target */}
                <rect
                  x={x - (candleW + 2) / 2} y={PAD_TOP}
                  width={candleW + 2} height={candleAreaH}
                  fill="transparent"
                  style={{ cursor: 'crosshair' }}
                  onMouseEnter={() => {
                    setTooltip(c);
                    setTooltipX(x);
                    setTooltipY(toYPrice(c.high));
                  }}
                />
              </g>
            );
          })}

          {/* Time labels */}
          {displayCandles.map((c, i) => {
            const label = formatTime(c.time, i, displayCandles.length);
            if (!label) return null;
            return (
              <text
                key={i}
                x={toX(i)} y={chartH - PAD_BOTTOM + VOL_HEIGHT + 16}
                fill="var(--text-muted)" fontSize={9}
                fontFamily="var(--font-mono)"
                textAnchor="middle"
              >
                {label}
              </text>
            );
          })}
        </svg>

        {/* Current price bar */}
        <div className="chart-current-price">
          <span className="chart-current-label">Price</span>
          <span className="chart-current-value">{formatPrice(compound.price)}</span>
          <span className={`chart-current-change ${compound.priceChange24h >= 0 ? 'green' : 'red'}`}>
            {compound.priceChange24h >= 0 ? '+' : ''}{compound.priceChange24h.toFixed(1)}%
          </span>
        </div>

        {/* Tooltip */}
        {tooltip && (
          <div
            className="chart-tooltip"
            style={{
              left: Math.min(tooltipX + 16, width - 200),
              top: Math.max(tooltipY - 80, 0),
            }}
          >
            <div className="chart-tooltip-time">
              {new Date(tooltip.time).toLocaleString('en-US', {
                month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
              })}
            </div>
            <div className="chart-tooltip-row">
              <span>O</span><span className="val">{formatPrice(tooltip.open)}</span>
            </div>
            <div className="chart-tooltip-row">
              <span>H</span><span className="val">{formatPrice(tooltip.high)}</span>
            </div>
            <div className="chart-tooltip-row">
              <span>L</span><span className="val">{formatPrice(tooltip.low)}</span>
            </div>
            <div className="chart-tooltip-row">
              <span>C</span><span className="val">{formatPrice(tooltip.close)}</span>
            </div>
            <div className="chart-tooltip-row">
              <span>Vol</span><span className="val">{formatVolume(tooltip.volume)}</span>
            </div>
          </div>
        )}

        {/* Stats below chart */}
        <div className="chart-stats">
          <div className="chart-stat">
            <span className="label">Open</span>
            <span className="value">{formatPrice(displayCandles[0]?.open ?? compound.price)}</span>
          </div>
          <div className="chart-stat">
            <span className="label">High</span>
            <span className="value">{formatPrice(maxPrice)}</span>
          </div>
          <div className="chart-stat">
            <span className="label">Low</span>
            <span className="value">{formatPrice(minPrice)}</span>
          </div>
          <div className="chart-stat">
            <span className="label">Close</span>
            <span className="value">{formatPrice(compound.price)}</span>
          </div>
          <div className="chart-stat">
            <span className="label">Volume</span>
            <span className="value">{formatVolume(compound.volume24h)}</span>
          </div>
          <div className="chart-stat">
            <span className="label">Holders</span>
            <span className="value">{compound.holders.toLocaleString()}</span>
          </div>
          <div className="chart-stat">
            <span className="label">+Elation</span>
            <span className="value purple">{compound.elationPoints.toLocaleString()}</span>
          </div>
          <div className="chart-stat">
            <span className="label">Bonding</span>
            <span className="value">{compound.bondingProgress}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
