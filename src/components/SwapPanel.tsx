import { useState, useMemo } from 'react';
import { compounds } from '../data';

const priceMap = Object.fromEntries(compounds.map((c) => [c.symbol, c.price]));

function calcRate(from: string, to: string): number {
  const pFrom = priceMap[from];
  const pTo = priceMap[to];
  if (!pFrom || !pTo) return 0;
  return pFrom / pTo;
}

export default function SwapPanel() {
  const [fromAmount, setFromAmount] = useState('');
  const [toAmount, setToAmount] = useState('');
  const [fromToken, setFromToken] = useState(compounds[0].symbol);
  const [toToken, setToToken] = useState(compounds[1].symbol);
  const [slippage] = useState(0.5);

  const rate = useMemo(() => calcRate(fromToken, toToken), [fromToken, toToken]);

  const handleFromChange = (val: string) => {
    setFromAmount(val);
    if (val) {
      const num = parseFloat(val);
      if (!isNaN(num)) setToAmount((num * rate).toFixed(4));
      else setToAmount('');
    } else setToAmount('');
  };

  const handleFromTokenChange = (token: string) => {
    setFromToken(token);
    setFromAmount('');
    setToAmount('');
  };

  const handleToTokenChange = (token: string) => {
    setToToken(token);
    if (fromAmount) {
      const num = parseFloat(fromAmount);
      if (!isNaN(num)) {
        const newRate = calcRate(fromToken, token);
        setToAmount((num * newRate).toFixed(4));
      }
    }
  };

  const handleSwap = () => {
    alert('Swap submitted! Vials will appear in your wallet shortly (just kidding)');
  };

  return (
    <div className="tab-content">
      <div className="section-header" style={{ marginBottom: 0 }}>
        <h2>
          <span className="accent-green">⟳</span> Swap Vials
        </h2>
      </div>

      <div className="swap-panel">
        <h3>Swap any vial, any chain</h3>

        <div className="swap-input-group">
          <label>You Pay</label>
          <div className="swap-input-row">
            <input
              className="swap-input"
              type="text"
              placeholder="0.0"
              value={fromAmount}
              onChange={(e) => handleFromChange(e.target.value)}
            />
            <select
              className="swap-select"
              value={fromToken}
              onChange={(e) => handleFromTokenChange(e.target.value)}
            >
              {compounds.map((c) => (
                <option key={c.id} value={c.symbol}>{c.symbol}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="swap-arrow">⬇️</div>

        <div className="swap-input-group">
          <label>You Receive</label>
          <div className="swap-input-row">
            <input
              className="swap-input"
              type="text"
              placeholder="0.0"
              value={toAmount}
              readOnly
            />
            <select
              className="swap-select"
              value={toToken}
              onChange={(e) => handleToTokenChange(e.target.value)}
            >
              {compounds.map((c) => (
                <option key={c.id} value={c.symbol}>{c.symbol}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="swap-details">
          <span>Rate: 1 {fromToken} ≈ {rate.toFixed(4)} {toToken}</span>
          <span>Slippage: {slippage}%</span>
        </div>

        <button className="swap-btn" onClick={handleSwap}>
          ✦ Swap Vials ✦
        </button>

        <div style={{ textAlign: 'center', marginTop: 12, fontSize: '0.65rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
          multichain · low slippage · no rug pulls (probably)
        </div>
      </div>
    </div>
  );
}
