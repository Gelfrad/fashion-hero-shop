"use client";

/**
 * Marketplace client-side store.
 *
 * Seeds from src/data/{campaigns, wallet}.ts on first load, then persists to
 * localStorage so changes survive page reloads. Replaces the previous pattern of
 * reading hardcoded data files directly from server components.
 *
 * Production swap: replace seeding + actions with API calls.
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Campaign, CampaignFormat, CampaignStatus } from "@/types";
import type { Invoice, Transaction, WalletState } from "@/types/billing";
import { campaigns as seedCampaigns } from "@/data/campaigns";
import {
  wallet as seedWallet,
  transactions as seedTransactions,
  invoices as seedInvoices,
} from "@/data/wallet";

const STORAGE_KEY = "fashionhero.marketplace.v1";
const CURRENT_SELLER_ID = "s2";

interface PersistedState {
  campaigns: Campaign[];
  wallet: WalletState;
  transactions: Transaction[];
  invoices: Invoice[];
}

interface MarketplaceContextValue extends PersistedState {
  hydrated: boolean;
  // campaign actions
  addCampaign: (campaign: Omit<Campaign, "id" | "spentToday" | "clicks" | "impressions" | "attributedSales" | "roas" | "ctr" | "cpc">) => Campaign;
  updateCampaign: (id: string, patch: Partial<Campaign>) => void;
  pauseCampaign: (id: string) => void;
  resumeCampaign: (id: string) => void;
  deleteCampaign: (id: string) => void;
  // wallet actions
  applyTopup: (args: { transaction: Transaction; invoice: Invoice; newBalance: number }) => void;
  updateInvoiceKsef: (invoiceId: string, patch: Partial<Pick<Invoice, "ksefStatus" | "ksefRefNumber" | "ksefSentAt" | "ksefError">>) => void;
  // utilities
  resetToSeed: () => void;
}

const seed: PersistedState = {
  campaigns: seedCampaigns,
  wallet: seedWallet,
  transactions: seedTransactions,
  invoices: seedInvoices,
};

const MarketplaceContext = createContext<MarketplaceContextValue | null>(null);

function loadFromStorage(): PersistedState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as PersistedState;
    // Basic shape check
    if (!parsed.campaigns || !parsed.wallet || !parsed.transactions || !parsed.invoices) return null;
    return parsed;
  } catch {
    return null;
  }
}

function saveToStorage(state: PersistedState) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // quota or privacy mode — fail silently
  }
}

function genId(prefix: string): string {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;
}

export function MarketplaceProvider({ children }: { children: ReactNode }) {
  // Start with seed; hydrate from localStorage on mount (avoid hydration mismatch)
  const [state, setState] = useState<PersistedState>(seed);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const stored = loadFromStorage();
    if (stored) {
      setState(stored);
    }
    setHydrated(true);
  }, []);

  // Persist on every change, but only after first hydration
  useEffect(() => {
    if (!hydrated) return;
    saveToStorage(state);
  }, [state, hydrated]);

  const addCampaign = useCallback<MarketplaceContextValue["addCampaign"]>((input) => {
    const newCampaign: Campaign = {
      ...input,
      id: genId("c"),
      spentToday: 0,
      clicks: 0,
      impressions: 0,
      attributedSales: 0,
      roas: 0,
      ctr: 0,
      cpc: input.maxCpc, // initial = max bid
    };
    setState((s) => ({ ...s, campaigns: [newCampaign, ...s.campaigns] }));
    return newCampaign;
  }, []);

  const updateCampaign = useCallback<MarketplaceContextValue["updateCampaign"]>((id, patch) => {
    setState((s) => ({
      ...s,
      campaigns: s.campaigns.map((c) => (c.id === id ? { ...c, ...patch } : c)),
    }));
  }, []);

  const pauseCampaign = useCallback((id: string) => {
    setState((s) => ({
      ...s,
      campaigns: s.campaigns.map((c) =>
        c.id === id ? { ...c, status: "paused" as CampaignStatus, spentToday: 0 } : c,
      ),
    }));
  }, []);

  const resumeCampaign = useCallback((id: string) => {
    setState((s) => ({
      ...s,
      campaigns: s.campaigns.map((c) =>
        c.id === id ? { ...c, status: "active" as CampaignStatus } : c,
      ),
    }));
  }, []);

  const deleteCampaign = useCallback((id: string) => {
    setState((s) => ({ ...s, campaigns: s.campaigns.filter((c) => c.id !== id) }));
  }, []);

  const applyTopup = useCallback<MarketplaceContextValue["applyTopup"]>(({ transaction, invoice, newBalance }) => {
    setState((s) => ({
      ...s,
      wallet: { ...s.wallet, balance: newBalance },
      transactions: [transaction, ...s.transactions],
      invoices: [invoice, ...s.invoices],
    }));
  }, []);

  const updateInvoiceKsef = useCallback<MarketplaceContextValue["updateInvoiceKsef"]>((invoiceId, patch) => {
    setState((s) => ({
      ...s,
      invoices: s.invoices.map((i) => (i.id === invoiceId ? { ...i, ...patch } : i)),
    }));
  }, []);

  const resetToSeed = useCallback(() => {
    setState(seed);
  }, []);

  const value = useMemo<MarketplaceContextValue>(
    () => ({
      ...state,
      hydrated,
      addCampaign,
      updateCampaign,
      pauseCampaign,
      resumeCampaign,
      deleteCampaign,
      applyTopup,
      updateInvoiceKsef,
      resetToSeed,
    }),
    [state, hydrated, addCampaign, updateCampaign, pauseCampaign, resumeCampaign, deleteCampaign, applyTopup, updateInvoiceKsef, resetToSeed],
  );

  return <MarketplaceContext.Provider value={value}>{children}</MarketplaceContext.Provider>;
}

export function useMarketplace(): MarketplaceContextValue {
  const ctx = useContext(MarketplaceContext);
  if (!ctx) throw new Error("useMarketplace must be used inside <MarketplaceProvider>");
  return ctx;
}

// Convenience selectors

export function useCampaignsForCurrentSeller(): Campaign[] {
  const { campaigns } = useMarketplace();
  return useMemo(
    () => campaigns.filter((c) => c.sellerId === CURRENT_SELLER_ID),
    [campaigns],
  );
}

export function useCampaign(id: string): Campaign | undefined {
  const { campaigns } = useMarketplace();
  return useMemo(() => campaigns.find((c) => c.id === id), [campaigns, id]);
}

export function useWalletForCurrentSeller(): WalletState | undefined {
  const { wallet } = useMarketplace();
  if (wallet.sellerId !== CURRENT_SELLER_ID) return undefined;
  return wallet;
}

export function useTransactionsForCurrentSeller(): Transaction[] {
  const { transactions } = useMarketplace();
  return useMemo(
    () => transactions.filter((t) => t.sellerId === CURRENT_SELLER_ID).sort((a, b) => b.date.localeCompare(a.date)),
    [transactions],
  );
}

export function useInvoicesForCurrentSeller(): Invoice[] {
  const { invoices } = useMarketplace();
  return useMemo(
    () => invoices.filter((i) => i.sellerId === CURRENT_SELLER_ID).sort((a, b) => b.date.localeCompare(a.date)),
    [invoices],
  );
}

export function usePromotedProductIds(): { ids: Set<string>; bidByProduct: Map<string, number> } {
  const { campaigns } = useMarketplace();
  return useMemo(() => {
    const ids = new Set<string>();
    const bidByProduct = new Map<string, number>();
    for (const c of campaigns) {
      if (c.status !== "active") continue;
      if (c.format !== "top_search" && c.format !== "similar_products") continue;
      for (const pid of c.productIds) {
        ids.add(pid);
        const prev = bidByProduct.get(pid) ?? 0;
        if (c.maxCpc > prev) bidByProduct.set(pid, c.maxCpc);
      }
    }
    return { ids, bidByProduct };
  }, [campaigns]);
}

export function useActiveBannerForCategory(category: string): Campaign | undefined {
  const { campaigns } = useMarketplace();
  return useMemo(
    () =>
      campaigns.find(
        (c) => c.status === "active" && c.format === "category_banner" && c.bannerCategory === category,
      ),
    [campaigns, category],
  );
}

export function useFormatForCurrentSeller(format: CampaignFormat): Campaign[] {
  const { campaigns } = useMarketplace();
  return useMemo(
    () => campaigns.filter((c) => c.sellerId === CURRENT_SELLER_ID && c.format === format),
    [campaigns, format],
  );
}

export const MARKETPLACE_STORAGE_KEY = STORAGE_KEY;
export const MARKETPLACE_CURRENT_SELLER_ID = CURRENT_SELLER_ID;
