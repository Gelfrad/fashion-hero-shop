export type KsefStatus = "pending" | "sent" | "error";

export type TransactionType = "topup" | "ad_spend";

export type PaymentMethod = "blik" | "card" | "p24" | "bank_transfer";

export const MPP_THRESHOLD_PLN = 15000;

export interface Transaction {
  id: string;
  sellerId: string;
  type: TransactionType;
  amount: number; // signed: +200 for topup, -12.40 for spend
  date: string; // ISO
  description: string;
  campaignId?: string; // when type === "ad_spend"
  invoiceId?: string; // when type === "topup" (link to issued invoice)
}

export interface Invoice {
  id: string;
  number: string; // FA/2026/05/142
  sellerId: string;
  date: string; // ISO
  amountGross: number;
  amountNet: number;
  vat: number;
  vatRate: number; // 23
  topupTransactionId: string;
  ksefStatus: KsefStatus;
  ksefRefNumber?: string;
  ksefSentAt?: string;
  ksefError?: string;
  buyerName: string;
  buyerNip: string;
}

export interface WalletState {
  sellerId: string;
  balance: number; // PLN
  currency: "PLN";
  autoTopupEnabled: boolean;
  autoTopupThreshold?: number;
  autoTopupAmount?: number;
}
