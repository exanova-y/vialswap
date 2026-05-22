export type WalletType = 'metamask' | 'phantom' | null;

export interface WalletState {
  type: WalletType;
  address: string;
  chainId: string | null;
}

export function detectWallets(): WalletType[] {
  const available: WalletType[] = [];
  if (typeof window !== 'undefined') {
    if ((window as any).ethereum?.isMetaMask) available.push('metamask');
    if ((window as any).phantom?.solana?.isConnected !== undefined || (window as any).solana?.isPhantom) available.push('phantom');
  }
  return available;
}

export async function connectMetaMask(): Promise<WalletState> {
  const eth = (window as any).ethereum;
  if (!eth) throw new Error('MetaMask not installed');

  const accounts: string[] = await eth.request({ method: 'eth_requestAccounts' });
  const chainId: string = await eth.request({ method: 'eth_chainId' });

  return { type: 'metamask', address: accounts[0], chainId };
}

export async function connectPhantom(): Promise<WalletState> {
  const provider = (window as any).phantom?.solana || (window as any).solana;
  if (!provider) throw new Error('Phantom not installed');

  const resp = await provider.connect();
  const address = resp.publicKey.toString();

  return { type: 'phantom', address, chainId: null };
}

export function shortenAddress(addr: string): string {
  return addr.slice(0, 6) + '...' + addr.slice(-4);
}

const STORAGE_KEY = 'vialswap_wallet';

export function saveWallet(state: WalletState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {}
}

export function loadWallet(): WalletState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function clearWallet(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {}
}

export async function tryReconnect(saved: WalletState): Promise<WalletState | null> {
  if (saved.type === 'metamask') {
    const eth = (window as any).ethereum;
    if (!eth?.isMetaMask) return null;
    try {
      const accounts: string[] = await eth.request({ method: 'eth_accounts' });
      if (accounts.length > 0 && accounts[0].toLowerCase() === saved.address.toLowerCase()) {
        const chainId: string = await eth.request({ method: 'eth_chainId' });
        return { ...saved, chainId };
      }
    } catch {}
    return null;
  }

  if (saved.type === 'phantom') {
    const provider = (window as any).phantom?.solana || (window as any).solana;
    if (!provider) return null;
    try {
      const resp = await provider.connect({ onlyIfTrusted: true });
      const address = resp.publicKey.toString();
      if (address === saved.address) return { ...saved };
    } catch {}
    return null;
  }

  return null;
}
