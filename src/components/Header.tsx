import { useState, useEffect, useRef } from 'react';
import { detectWallets, connectMetaMask, connectPhantom, shortenAddress, saveWallet, loadWallet, clearWallet, tryReconnect } from '../lib/wallet';
import type { WalletState, WalletType } from '../lib/wallet';

interface HeaderProps {
  activeTab: 'swap' | 'explore' | 'leaderboard' | 'chart';
  onTabChange: (tab: 'swap' | 'explore' | 'leaderboard' | 'chart') => void;
}

export default function Header({ activeTab, onTabChange }: HeaderProps) {
  const [wallet, setWallet] = useState<WalletState | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [available, setAvailable] = useState<WalletType[]>([]);
  const [error, setError] = useState('');
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setAvailable(detectWallets());
    const saved = loadWallet();
    if (saved) {
      tryReconnect(saved).then((state) => {
        if (state) setWallet(state);
        else clearWallet();
      });
    }
  }, []);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        setShowModal(false);
      }
    };
    if (showModal) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [showModal]);

  const handleConnect = async (type: WalletType) => {
    setError('');
    try {
      const state = type === 'metamask' ? await connectMetaMask() : await connectPhantom();
      saveWallet(state);
      setWallet(state);
      setShowModal(false);
    } catch (err: any) {
      setError(err.message || 'Connection failed');
    }
  };

  const handleDisconnect = () => {
    clearWallet();
    setWallet(null);
    setShowModal(false);
  };

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

        <div style={{ position: 'relative' }}>
          <button
            className="connect-btn"
            onClick={() => wallet ? null : setShowModal(!showModal)}
          >
            {wallet ? shortenAddress(wallet.address) : 'Connect Wallet'}
          </button>

          {showModal && (
            <div className="wallet-modal" ref={modalRef}>
              <div className="wallet-modal-header">
                {wallet ? 'Connected' : 'Select Wallet'}
                {wallet && (
                  <span className="wallet-connected-info">
                    {wallet.type === 'metamask' ? '🦊 MetaMask' : '💎 Phantom'}
                  </span>
                )}
              </div>

              {error && <div className="wallet-error">{error}</div>}

              {wallet ? (
                <button className="wallet-option disconnect" onClick={handleDisconnect}>
                  Disconnect
                </button>
              ) : available.length === 0 ? (
                <div className="wallet-empty">
                  No wallet detected.
                  <br />
                  <a href="https://metamask.io" target="_blank" rel="noopener noreferrer">Install MetaMask</a>
                  {' or '}
                  <a href="https://phantom.app" target="_blank" rel="noopener noreferrer">Install Phantom</a>
                </div>
              ) : (
                available.map((w) => (
                  <button
                    key={w}
                    className="wallet-option"
                    onClick={() => handleConnect(w)}
                  >
                    <span className="wallet-option-icon">
                      {w === 'metamask' ? '🦊' : '💎'}
                    </span>
                    <span>{w === 'metamask' ? 'MetaMask' : 'Phantom'}</span>
                  </button>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
