/**
 * Billing service layer — MOCK implementation.
 *
 * Designed so the swap to production (Fakturownia / KSeF / payment processor) is
 * just replacing function bodies; signatures stay the same.
 *
 * Production wiring touchpoints:
 *  - topupWallet → real payment intent (Stripe/Tpay/Przelewy24) + persist transaction
 *  - issueInvoice → call Fakturownia API or own FA(3) XML generator
 *  - sendInvoiceToKSeF → KSeF 2.0 API (POST /api/v2/invoices with FA(3) XML, await UPO)
 *  - getInvoicePdfUrl → /api/invoices/[id]/pdf endpoint that renders FA(3) visualization
 */

import type { Invoice, Transaction, WalletState, PaymentMethod } from "@/types/billing";

function delay(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

function generateId(prefix: string): string {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;
}

function generateInvoiceNumber(): string {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const seq = Math.floor(100 + Math.random() * 900);
  return `FA/${yyyy}/${mm}/${seq}`;
}

function generateKsefRef(): string {
  const ts = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const hex = Math.random().toString(16).slice(2, 12).toUpperCase();
  return `5246154618-${ts}-${hex}`;
}

export interface TopupResult {
  transaction: Transaction;
  invoice: Invoice;
  newBalance: number;
}

/**
 * Top up wallet. In production this would:
 *  1. Create a payment intent with provider (Stripe/Tpay)
 *  2. Wait for webhook confirmation
 *  3. Update wallet atomically
 *  4. Trigger invoice issuance
 *
 * Mock: just simulates a 1.5s payment processing delay.
 */
export async function topupWallet(
  sellerId: string,
  amount: number,
  currentBalance: number,
  method: PaymentMethod = "card",
): Promise<TopupResult> {
  await delay(1500);

  const methodLabels: Record<PaymentMethod, string> = {
    blik: "Doładowanie salda (BLIK)",
    card: "Doładowanie salda (karta)",
    p24: "Doładowanie salda (Przelewy24)",
    bank_transfer: "Doładowanie salda (przelew tradycyjny)",
  };

  const txId = generateId("tx");
  const transaction: Transaction = {
    id: txId,
    sellerId,
    type: "topup",
    amount,
    date: new Date().toISOString(),
    description: methodLabels[method],
  };

  const invoice = await issueInvoice({
    sellerId,
    topupTransactionId: txId,
    amountGross: amount,
    vatRate: 23,
  });
  transaction.invoiceId = invoice.id;

  return {
    transaction,
    invoice,
    newBalance: currentBalance + amount,
  };
}

interface IssueInvoiceInput {
  sellerId: string;
  topupTransactionId: string;
  amountGross: number;
  vatRate: number;
}

/**
 * Issue invoice. In production: call Fakturownia API or generate FA(3) XML locally.
 * Mock: builds invoice object in-memory.
 */
export async function issueInvoice(input: IssueInvoiceInput): Promise<Invoice> {
  await delay(200);

  const amountNet = Math.round((input.amountGross / (1 + input.vatRate / 100)) * 100) / 100;
  const vat = Math.round((input.amountGross - amountNet) * 100) / 100;

  const invoice: Invoice = {
    id: generateId("inv"),
    number: generateInvoiceNumber(),
    sellerId: input.sellerId,
    date: new Date().toISOString(),
    amountGross: input.amountGross,
    amountNet,
    vat,
    vatRate: input.vatRate,
    topupTransactionId: input.topupTransactionId,
    ksefStatus: "pending",
    buyerName: "Bella Donna",
    buyerNip: "5252384754",
  };

  // Trigger async KSeF send (fire and forget — would be a queue in production)
  void sendInvoiceToKSeF(invoice.id);

  return invoice;
}

/**
 * Send invoice to KSeF. In production: POST FA(3) XML to KSeF 2.0 API,
 * await UPO (Urzędowe Poświadczenie Odbioru), update invoice with reference.
 *
 * Mock: 1.5s delay then assigns mock reference number.
 */
export async function sendInvoiceToKSeF(invoiceId: string): Promise<{
  invoiceId: string;
  ksefStatus: "sent" | "error";
  ksefRefNumber?: string;
  ksefSentAt?: string;
  ksefError?: string;
}> {
  await delay(1500);

  // 95% success rate in mock
  if (Math.random() > 0.05) {
    return {
      invoiceId,
      ksefStatus: "sent",
      ksefRefNumber: generateKsefRef(),
      ksefSentAt: new Date().toISOString(),
    };
  }

  return {
    invoiceId,
    ksefStatus: "error",
    ksefError: "Błąd komunikacji z KSeF. Ponowimy próbę za 15 minut.",
  };
}

/**
 * Get PDF download URL for invoice visualization.
 * Production: returns /api/invoices/[id]/pdf which renders FA(3) → PDF.
 * Mock: returns the in-app visualization route.
 */
export function getInvoicePdfUrl(invoiceId: string): string {
  return `/seller/promotions/wallet/invoice/${invoiceId}`;
}

/**
 * Calculate how many days the current balance lasts given total daily spend.
 */
export function calculateBalanceRunway(balance: number, dailySpend: number): number {
  if (dailySpend <= 0) return Infinity;
  return Math.floor(balance / dailySpend);
}

/**
 * Format PLN amount with Polish locale.
 */
export function fmtPLNAmount(n: number): string {
  return new Intl.NumberFormat("pl-PL", {
    style: "currency",
    currency: "PLN",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(n);
}

/**
 * Format date as "23.05.2026" or "23.05.2026 14:18" if includeTime.
 */
export function fmtDate(iso: string, includeTime = false): string {
  const d = new Date(iso);
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  if (!includeTime) return `${dd}.${mm}.${yyyy}`;
  const hh = String(d.getHours()).padStart(2, "0");
  const mi = String(d.getMinutes()).padStart(2, "0");
  return `${dd}.${mm}.${yyyy} ${hh}:${mi}`;
}
