import { leaderboard } from '../data';

function formatUSD(n: number): string {
  if (n >= 1_000_000) return '$' + (n / 1_000_000).toFixed(1) + 'M';
  if (n >= 1_000) return '$' + (n / 1_000).toFixed(1) + 'K';
  return '$' + n.toFixed(2);
}

function formatCompact(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M';
  if (n >= 1_000) return (n / 1_000).toFixed(1) + 'K';
  return n.toFixed(0);
}

export default function Leaderboard() {
  return (
    <div className="tab-content">
      <div className="section-header">
        <h2>
          <span className="accent">🏆</span> Leaderboard
        </h2>
        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
          Top traders by PnL · Updated realtime
        </div>
      </div>

      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
        <table className="leaderboard-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Trader</th>
              <th>Label</th>
              <th>PnL</th>
              <th>Trades</th>
              <th>+Elation</th>
              <th>Fave Vial</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.map((entry) => (
              <tr key={entry.rank}>
                <td className={`rank ${entry.rank <= 3 ? `rank-${entry.rank}` : ''}`}>
                  {entry.rank <= 3 ? ['🥇', '🥈', '🥉'][entry.rank - 1] : entry.rank}
                </td>
                <td className="wallet">{entry.wallet}</td>
                <td className="label">@{entry.label}</td>
                <td className={`pnl positive`}>{formatUSD(entry.pnl)}</td>
                <td>{entry.trades}</td>
                <td className="elation">{formatCompact(entry.elationPoints)}</td>
                <td className="fave-vial">{entry.favoriteVial}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
