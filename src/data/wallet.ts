import type { Transaction, Invoice, WalletState } from "@/types/billing";

const CURRENT_SELLER_ID = "s2";

export const wallet: WalletState = {
  sellerId: CURRENT_SELLER_ID,
  balance: 285.40,
  currency: "PLN",
  autoTopupEnabled: false,
};

export const transactions: Transaction[] = [
  {
    id: "t1",
    sellerId: CURRENT_SELLER_ID,
    type: "topup",
    amount: 200,
    date: "2026-05-21T09:14:00Z",
    description: "Doładowanie salda",
    invoiceId: "i1",
  },
  {
    id: "t2",
    sellerId: CURRENT_SELLER_ID,
    type: "ad_spend",
    amount: -38,
    date: "2026-05-21T18:02:00Z",
    description: "Kampania: Loafer Boost — Similar Products",
    campaignId: "c3",
  },
  {
    id: "t3",
    sellerId: CURRENT_SELLER_ID,
    type: "ad_spend",
    amount: -85,
    date: "2026-05-22T23:59:00Z",
    description: "Kampania: Bella Donna — Banner AW (buty)",
    campaignId: "c2",
  },
  {
    id: "t4",
    sellerId: CURRENT_SELLER_ID,
    type: "topup",
    amount: 100,
    date: "2026-05-15T11:30:00Z",
    description: "Doładowanie salda",
    invoiceId: "i2",
  },
  {
    id: "t5",
    sellerId: CURRENT_SELLER_ID,
    type: "ad_spend",
    amount: -96,
    date: "2026-05-23T14:18:00Z",
    description: "Kampania: Sweter & Dzianiny — Top Search",
    campaignId: "c1",
  },
];

export const invoices: Invoice[] = [
  {
    id: "i1",
    number: "FA/2026/05/142",
    sellerId: CURRENT_SELLER_ID,
    date: "2026-05-21T09:14:00Z",
    amountGross: 200,
    amountNet: 162.60,
    vat: 37.40,
    vatRate: 23,
    topupTransactionId: "t1",
    ksefStatus: "sent",
    ksefRefNumber: "5246154618-20260521-A1B2C3D4E5",
    ksefSentAt: "2026-05-21T09:14:22Z",
    buyerName: "Bella Donna",
    buyerNip: "5252384754",
  },
  {
    id: "i2",
    number: "FA/2026/05/098",
    sellerId: CURRENT_SELLER_ID,
    date: "2026-05-15T11:30:00Z",
    amountGross: 100,
    amountNet: 81.30,
    vat: 18.70,
    vatRate: 23,
    topupTransactionId: "t4",
    ksefStatus: "sent",
    ksefRefNumber: "5246154618-20260515-F6E7D8C9B0",
    ksefSentAt: "2026-05-15T11:30:18Z",
    buyerName: "Bella Donna",
    buyerNip: "5252384754",
  },
];

export function getWalletForSeller(sellerId: string): WalletState | undefined {
  if (sellerId !== CURRENT_SELLER_ID) return undefined;
  return wallet;
}

export function getTransactionsBySeller(sellerId: string): Transaction[] {
  return transactions
    .filter((t) => t.sellerId === sellerId)
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function getInvoicesBySeller(sellerId: string): Invoice[] {
  return invoices
    .filter((i) => i.sellerId === sellerId)
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function getInvoice(id: string): Invoice | undefined {
  return invoices.find((i) => i.id === id);
}
