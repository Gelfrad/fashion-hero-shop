"use client";

import { useState } from "react";
import Link from "next/link";
import {
  topupWallet,
  sendInvoiceToKSeF,
  fmtPLNAmount,
  fmtDate,
} from "@/lib/billing";
import type { KsefStatus, PaymentMethod } from "@/types/billing";
import { MPP_THRESHOLD_PLN } from "@/types/billing";
import { cn } from "@/lib/utils";
import {
  useWalletForCurrentSeller,
  useTransactionsForCurrentSeller,
  useInvoicesForCurrentSeller,
  useMarketplace,
} from "@/store/marketplace-store";

const PRESET_AMOUNTS = [50, 100, 250, 500];

export default function WalletPage() {
  const walletState = useWalletForCurrentSeller();
  const transactions = useTransactionsForCurrentSeller();
  const invoices = useInvoicesForCurrentSeller();
  const { applyTopup, updateInvoiceKsef, hydrated } = useMarketplace();
  const [selectedAmount, setSelectedAmount] = useState<number>(100);
  const [customAmount, setCustomAmount] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("blik");
  const [blikCode, setBlikCode] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [saveCard, setSaveCard] = useState(false);
  const [p24Bank, setP24Bank] = useState<string>("");
  const [autoRecharge, setAutoRecharge] = useState(false);
  const [autoThreshold, setAutoThreshold] = useState(50);
  const [autoAmount, setAutoAmount] = useState(200);
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastTopupAmount, setLastTopupAmount] = useState<number | null>(null);

  const amount = customAmount ? parseFloat(customAmount) || 0 : selectedAmount;
  const exceedsMpp = amount >= MPP_THRESHOLD_PLN;

  const methodValid = (() => {
    if (paymentMethod === "blik") return /^\d{6}$/.test(blikCode);
    if (paymentMethod === "card") {
      return cardNumber.replace(/\s/g, "").length >= 13 && /^\d{2}\/\d{2}$/.test(cardExpiry) && /^\d{3,4}$/.test(cardCvv);
    }
    if (paymentMethod === "p24") return !!p24Bank;
    if (paymentMethod === "bank_transfer") return true;
    return false;
  })();

  const canTopup = !!walletState && amount >= 20 && !isProcessing && methodValid && paymentMethod !== "bank_transfer";

  async function handleTopup() {
    if (!canTopup || !walletState) return;
    setIsProcessing(true);
    setLastTopupAmount(null);

    try {
      const result = await topupWallet(walletState.sellerId, amount, walletState.balance, paymentMethod);
      applyTopup({
        transaction: result.transaction,
        invoice: result.invoice,
        newBalance: result.newBalance,
      });
      setLastTopupAmount(amount);
      setCustomAmount("");
      setSelectedAmount(100);
      setBlikCode("");

      // Watch KSeF status update (mock async)
      const ksefResult = await sendInvoiceToKSeF(result.invoice.id);
      updateInvoiceKsef(result.invoice.id, {
        ksefStatus: ksefResult.ksefStatus,
        ksefRefNumber: ksefResult.ksefRefNumber,
        ksefSentAt: ksefResult.ksefSentAt,
        ksefError: ksefResult.ksefError,
      });
    } finally {
      setIsProcessing(false);
    }
  }

  if (!hydrated || !walletState) {
    return (
      <div className="mx-auto max-w-5xl px-4 lg:px-8 py-12">
        <p className="text-sm text-warm-gray">Ładowanie salda…</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 lg:px-8 py-8 md:py-12">
      <Link
        href="/seller/promotions"
        className="inline-flex items-center gap-1 text-xs text-warm-gray hover:text-charcoal mb-6 transition-colors"
      >
        ← Wróć do kampanii
      </Link>

      <div className="mb-8">
        <p className="text-[11px] uppercase tracking-[1px] text-warm-gray mb-2">Saldo i rozliczenia</p>
        <h1 className="text-3xl md:text-4xl font-light tracking-tight text-charcoal">Doładuj saldo</h1>
        <p className="text-sm text-warm-gray mt-3 max-w-xl leading-relaxed">
          Z salda pokrywane są kliknięcia w Twoje promowane oferty oraz opłaty za banery.
          Po doładowaniu otrzymasz fakturę — automatycznie wysłaną do KSeF.
        </p>
      </div>

      {/* Current balance + top-up */}
      <div className="grid md:grid-cols-3 gap-6 mb-12">
        <div className="md:col-span-1">
          <div className="p-6 rounded-xl border border-black/10 bg-white">
            <p className="text-[11px] uppercase tracking-[1px] text-warm-gray mb-2">Aktualne saldo</p>
            <p className="text-4xl font-semibold text-charcoal mb-4">{fmtPLNAmount(walletState.balance)}</p>
            <p className="text-xs text-warm-gray leading-relaxed">
              Środki są blokowane na bieżąco w miarę kliknięć w Twoje reklamy.
              Możesz w każdej chwili wstrzymać kampanie.
            </p>
          </div>
        </div>

        <div className="md:col-span-2 space-y-4">
          {/* Amount picker */}
          <div className="p-6 rounded-xl border border-black/10 bg-white">
            <p className="text-sm font-medium text-charcoal mb-1">1. Wybierz kwotę doładowania</p>
            <p className="text-xs text-warm-gray mb-4">Minimum: 20 PLN. VAT 23% wliczony w kwotę.</p>

            <div className="grid grid-cols-4 gap-2 mb-3">
              {PRESET_AMOUNTS.map((preset) => {
                const active = !customAmount && selectedAmount === preset;
                return (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => {
                      setSelectedAmount(preset);
                      setCustomAmount("");
                    }}
                    disabled={isProcessing}
                    className={cn(
                      "py-3 rounded-lg border text-sm font-medium transition-colors",
                      active
                        ? "border-charcoal bg-charcoal text-white"
                        : "border-black/15 text-charcoal hover:border-charcoal/40",
                    )}
                  >
                    {preset} PLN
                  </button>
                );
              })}
            </div>

            <div className="flex gap-2 items-center">
              <span className="text-xs text-warm-gray">albo własna kwota:</span>
              <input
                type="number"
                min={20}
                step={10}
                value={customAmount}
                onChange={(e) => setCustomAmount(e.target.value)}
                placeholder="np. 350"
                disabled={isProcessing}
                className="flex-1 max-w-[140px] px-3 py-2 text-sm rounded-md border border-black/15 bg-white focus:outline-none focus:ring-2 focus:ring-charcoal/20"
              />
              <span className="text-sm text-warm-gray">PLN</span>
            </div>

            {exceedsMpp && (
              <div className="mt-4 p-3 rounded-lg bg-blue-50 border border-blue-200 text-xs text-blue-900 leading-relaxed">
                <strong>Mechanizm podzielonej płatności (MPP).</strong> Dla kwot ≥ 15 000 PLN obowiązuje split payment.
                Płatność zostanie rozdzielona na kwotę netto i VAT zgodnie z art. 108a ustawy o VAT.
              </div>
            )}
          </div>

          {/* Payment method picker */}
          <div className="p-6 rounded-xl border border-black/10 bg-white">
            <p className="text-sm font-medium text-charcoal mb-1">2. Wybierz metodę płatności</p>
            <p className="text-xs text-warm-gray mb-4">Płatność jest zabezpieczona i obsługiwana przez Przelewy24.</p>

            <div className="grid sm:grid-cols-2 gap-2 mb-4">
              <MethodCard
                value="blik"
                current={paymentMethod}
                icon={<span className="text-pink-600 font-bold text-sm tracking-tight">BLIK</span>}
                label="BLIK"
                hint="Najszybsza opcja"
                onSelect={setPaymentMethod}
              />
              <MethodCard
                value="card"
                current={paymentMethod}
                icon={<span className="text-xs">💳</span>}
                label="Karta"
                hint="Visa / Mastercard"
                onSelect={setPaymentMethod}
              />
              <MethodCard
                value="p24"
                current={paymentMethod}
                icon={<span className="text-xs">⚡</span>}
                label="Szybki przelew"
                hint="Przelewy24 · 25 banków"
                onSelect={setPaymentMethod}
              />
              <MethodCard
                value="bank_transfer"
                current={paymentMethod}
                icon={<span className="text-xs">🏦</span>}
                label="Przelew tradycyjny"
                hint="Zaksięgowanie 1-2 dni"
                onSelect={setPaymentMethod}
              />
            </div>

            {/* Method-specific inputs */}
            {paymentMethod === "blik" && (
              <BlikForm code={blikCode} onChange={setBlikCode} disabled={isProcessing} />
            )}
            {paymentMethod === "card" && (
              <CardForm
                number={cardNumber} setNumber={setCardNumber}
                expiry={cardExpiry} setExpiry={setCardExpiry}
                cvv={cardCvv} setCvv={setCardCvv}
                saveCard={saveCard} setSaveCard={setSaveCard}
                disabled={isProcessing}
              />
            )}
            {paymentMethod === "p24" && (
              <P24Form selected={p24Bank} onSelect={setP24Bank} disabled={isProcessing} />
            )}
            {paymentMethod === "bank_transfer" && <BankTransferDetails amount={amount} />}
          </div>

          {/* Auto-recharge */}
          {(paymentMethod === "card" || paymentMethod === "p24") && (
            <div className="p-4 rounded-xl border border-black/10 bg-white">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoRecharge}
                  onChange={(e) => setAutoRecharge(e.target.checked)}
                  disabled={isProcessing}
                  className="mt-1 accent-charcoal"
                />
                <div className="flex-1">
                  <p className="text-sm font-medium text-charcoal">Automatyczne doładowanie</p>
                  <p className="text-xs text-warm-gray mt-0.5 leading-relaxed">
                    Kampanie nie wstrzymają się przez puste saldo. Doładowujemy automatycznie z zapisanej karty.
                  </p>
                  {autoRecharge && (
                    <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-charcoal">
                      <span>Doładuj</span>
                      <input
                        type="number"
                        min={50}
                        step={50}
                        value={autoAmount}
                        onChange={(e) => setAutoAmount(parseInt(e.target.value) || 0)}
                        className="w-20 px-2 py-1 rounded border border-black/15 bg-white"
                      />
                      <span>PLN, gdy saldo spadnie poniżej</span>
                      <input
                        type="number"
                        min={20}
                        step={10}
                        value={autoThreshold}
                        onChange={(e) => setAutoThreshold(parseInt(e.target.value) || 0)}
                        className="w-20 px-2 py-1 rounded border border-black/15 bg-white"
                      />
                      <span>PLN.</span>
                    </div>
                  )}
                </div>
              </label>
            </div>
          )}

          {/* Pay button */}
          {paymentMethod !== "bank_transfer" && (
            <div className="p-6 rounded-xl border border-black/10 bg-white flex items-center justify-between">
              <div>
                <p className="text-[11px] uppercase tracking-[1px] text-warm-gray">Do zapłaty</p>
                <p className="text-2xl font-semibold text-charcoal mt-1">
                  {amount > 0 ? fmtPLNAmount(amount) : "—"}
                </p>
              </div>
              <button
                onClick={handleTopup}
                disabled={!canTopup}
                className="inline-flex items-center justify-center gap-2 bg-charcoal text-white text-[12px] font-medium uppercase tracking-[0.5px] px-6 py-3 rounded hover:bg-charcoal-light transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {isProcessing ? (
                  <>
                    <span className="inline-block w-3 h-3 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    Przetwarzanie…
                  </>
                ) : (
                  paymentMethod === "blik" ? "Potwierdź BLIK" :
                  paymentMethod === "card" ? "Zapłać kartą" :
                  "Przejdź do płatności"
                )}
              </button>
            </div>
          )}

          {lastTopupAmount !== null && !isProcessing && (
            <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-sm text-emerald-800">
              ✓ Doładowano <strong>{fmtPLNAmount(lastTopupAmount)}</strong>. Faktura wystawiona i wysłana do KSeF.
            </div>
          )}
        </div>
      </div>

      {/* Invoices */}
      <section className="mb-12">
        <h2 className="text-lg font-medium text-charcoal mb-1">Faktury</h2>
        <p className="text-xs text-warm-gray mb-4">
          Faktury wystawiamy automatycznie po każdym doładowaniu i wysyłamy do KSeF.
          Dokumenty pobierzesz tutaj lub w aplikacji <strong>Mój KSeF</strong>.
        </p>

        <div className="rounded-xl border border-black/10 bg-white overflow-x-auto">
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="text-left text-[10px] uppercase tracking-wide text-warm-gray border-b border-black/10 bg-cream-light/40">
                <th className="px-4 py-3 font-medium">Numer</th>
                <th className="px-4 py-3 font-medium">Data</th>
                <th className="px-4 py-3 font-medium text-right">Kwota brutto</th>
                <th className="px-4 py-3 font-medium">Status KSeF</th>
                <th className="px-4 py-3 font-medium text-right">Akcje</th>
              </tr>
            </thead>
            <tbody>
              {invoices.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-warm-gray text-xs">
                    Brak faktur. Doładuj saldo, aby otrzymać pierwszą.
                  </td>
                </tr>
              ) : (
                invoices.map((inv) => (
                  <tr key={inv.id} className="border-b border-black/10 last:border-0">
                    <td className="px-4 py-3 font-medium text-charcoal">{inv.number}</td>
                    <td className="px-4 py-3 text-warm-gray">{fmtDate(inv.date)}</td>
                    <td className="px-4 py-3 text-right font-medium text-charcoal">
                      {fmtPLNAmount(inv.amountGross)}
                    </td>
                    <td className="px-4 py-3">
                      <KsefPill status={inv.ksefStatus} refNumber={inv.ksefRefNumber} />
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        href={`/seller/promotions/wallet/invoice/${inv.id}`}
                        className="text-[11px] uppercase tracking-wide px-3 py-1.5 rounded-full border border-charcoal text-charcoal hover:bg-charcoal hover:text-white transition-all duration-200"
                      >
                        Pobierz PDF
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Transactions */}
      <section>
        <h2 className="text-lg font-medium text-charcoal mb-1">Historia transakcji</h2>
        <p className="text-xs text-warm-gray mb-4">
          Doładowania i kliknięcia w kolejności od najnowszych.
        </p>

        <div className="rounded-xl border border-black/10 bg-white overflow-x-auto">
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="text-left text-[10px] uppercase tracking-wide text-warm-gray border-b border-black/10 bg-cream-light/40">
                <th className="px-4 py-3 font-medium">Data</th>
                <th className="px-4 py-3 font-medium">Opis</th>
                <th className="px-4 py-3 font-medium text-right">Kwota</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((t) => (
                <tr key={t.id} className="border-b border-black/10 last:border-0">
                  <td className="px-4 py-3 text-warm-gray whitespace-nowrap">{fmtDate(t.date, true)}</td>
                  <td className="px-4 py-3 text-charcoal">
                    {t.description}
                  </td>
                  <td
                    className={cn(
                      "px-4 py-3 text-right font-medium tabular-nums",
                      t.amount > 0 ? "text-emerald-700" : "text-charcoal",
                    )}
                  >
                    {t.amount > 0 ? "+" : ""}
                    {fmtPLNAmount(t.amount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function KsefPill({ status, refNumber }: { status: KsefStatus; refNumber?: string }) {
  if (status === "sent") {
    return (
      <span
        className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] uppercase tracking-wide rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 cursor-help"
        title={refNumber ? `Wysłana do KSeF. Numer referencyjny: ${refNumber}` : "Wysłana do KSeF."}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
        Wysłana
      </span>
    );
  }
  if (status === "pending") {
    return (
      <span
        className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] uppercase tracking-wide rounded-full bg-amber-50 text-amber-700 border border-amber-200"
        title="Faktura jest wysyłana do KSeF. Zwykle trwa to kilka sekund."
      >
        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 inline-block animate-pulse" />
        Wysyłanie…
      </span>
    );
  }
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] uppercase tracking-wide rounded-full bg-red-50 text-red-700 border border-red-200 cursor-help"
      title="Wysyłka do KSeF nie powiodła się. Ponowimy automatycznie."
    >
      <span className="w-1.5 h-1.5 rounded-full bg-red-500 inline-block" />
      Błąd
    </span>
  );
}

function MethodCard({
  value,
  current,
  icon,
  label,
  hint,
  onSelect,
}: {
  value: PaymentMethod;
  current: PaymentMethod;
  icon: React.ReactNode;
  label: string;
  hint: string;
  onSelect: (m: PaymentMethod) => void;
}) {
  const active = current === value;
  return (
    <button
      type="button"
      onClick={() => onSelect(value)}
      className={cn(
        "text-left p-3 rounded-lg border transition-colors flex items-center gap-3",
        active ? "border-charcoal bg-cream-light" : "border-black/15 hover:border-charcoal/40",
      )}
    >
      <div className={cn(
        "w-10 h-10 rounded flex items-center justify-center shrink-0",
        active ? "bg-white" : "bg-cream-light",
      )}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-charcoal">{label}</p>
        <p className="text-[11px] text-warm-gray">{hint}</p>
      </div>
      <div className={cn(
        "w-4 h-4 rounded-full border-2 shrink-0",
        active ? "border-charcoal bg-charcoal" : "border-black/30",
      )}>
        {active && <div className="w-1.5 h-1.5 bg-white rounded-full m-auto mt-[3px]" />}
      </div>
    </button>
  );
}

function BlikForm({ code, onChange, disabled }: { code: string; onChange: (v: string) => void; disabled: boolean }) {
  return (
    <div className="p-4 rounded-lg bg-pink-50/40 border border-pink-100">
      <label className="block">
        <span className="text-xs text-charcoal font-medium">Kod BLIK z aplikacji bankowej</span>
        <input
          type="text"
          inputMode="numeric"
          pattern="\d{6}"
          maxLength={6}
          value={code}
          onChange={(e) => onChange(e.target.value.replace(/\D/g, "").slice(0, 6))}
          placeholder="• • •  • • •"
          disabled={disabled}
          className="mt-1.5 w-full px-3 py-3 text-center text-xl tracking-[0.4em] font-mono rounded-md border border-black/15 bg-white focus:outline-none focus:ring-2 focus:ring-charcoal/20"
        />
      </label>
      <p className="text-[11px] text-warm-gray mt-2 leading-relaxed">
        Otwórz aplikację swojego banku, wybierz <strong>BLIK</strong> i przepisz 6-cyfrowy kod.
        Następnie potwierdź transakcję w aplikacji.
      </p>
    </div>
  );
}

function CardForm({
  number, setNumber, expiry, setExpiry, cvv, setCvv, saveCard, setSaveCard, disabled,
}: {
  number: string; setNumber: (v: string) => void;
  expiry: string; setExpiry: (v: string) => void;
  cvv: string; setCvv: (v: string) => void;
  saveCard: boolean; setSaveCard: (v: boolean) => void;
  disabled: boolean;
}) {
  function formatNumber(v: string) {
    return v.replace(/\D/g, "").slice(0, 19).replace(/(.{4})/g, "$1 ").trim();
  }
  function formatExpiry(v: string) {
    const digits = v.replace(/\D/g, "").slice(0, 4);
    if (digits.length < 3) return digits;
    return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  }
  return (
    <div className="p-4 rounded-lg bg-cream-light/40 border border-black/10 space-y-3">
      <label className="block">
        <span className="text-xs text-charcoal font-medium">Numer karty</span>
        <input
          type="text"
          inputMode="numeric"
          value={number}
          onChange={(e) => setNumber(formatNumber(e.target.value))}
          placeholder="1234 5678 9012 3456"
          disabled={disabled}
          className="mt-1.5 w-full px-3 py-2 text-sm rounded-md border border-black/15 bg-white focus:outline-none focus:ring-2 focus:ring-charcoal/20 font-mono"
        />
      </label>
      <div className="grid grid-cols-2 gap-3">
        <label className="block">
          <span className="text-xs text-charcoal font-medium">Data ważności</span>
          <input
            type="text"
            inputMode="numeric"
            value={expiry}
            onChange={(e) => setExpiry(formatExpiry(e.target.value))}
            placeholder="MM/RR"
            disabled={disabled}
            className="mt-1.5 w-full px-3 py-2 text-sm rounded-md border border-black/15 bg-white focus:outline-none focus:ring-2 focus:ring-charcoal/20 font-mono"
          />
        </label>
        <label className="block">
          <span className="text-xs text-charcoal font-medium">CVV</span>
          <input
            type="text"
            inputMode="numeric"
            maxLength={4}
            value={cvv}
            onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").slice(0, 4))}
            placeholder="•••"
            disabled={disabled}
            className="mt-1.5 w-full px-3 py-2 text-sm rounded-md border border-black/15 bg-white focus:outline-none focus:ring-2 focus:ring-charcoal/20 font-mono"
          />
        </label>
      </div>
      <label className="flex items-start gap-2 cursor-pointer pt-1">
        <input
          type="checkbox"
          checked={saveCard}
          onChange={(e) => setSaveCard(e.target.checked)}
          disabled={disabled}
          className="mt-0.5 accent-charcoal"
        />
        <span className="text-xs text-charcoal leading-relaxed">
          Zapisz kartę do przyszłych doładowań (wymagane do automatycznego doładowywania).
        </span>
      </label>
    </div>
  );
}

const P24_BANKS = [
  { id: "mbank", name: "mBank" },
  { id: "pko", name: "PKO BP / iPKO" },
  { id: "ing", name: "ING Bank Śląski" },
  { id: "pekao", name: "Pekao S.A." },
  { id: "santander", name: "Santander" },
  { id: "millennium", name: "Millennium" },
  { id: "alior", name: "Alior Bank" },
  { id: "bnp", name: "BNP Paribas" },
];

function P24Form({ selected, onSelect, disabled }: { selected: string; onSelect: (v: string) => void; disabled: boolean }) {
  return (
    <div className="p-4 rounded-lg bg-cream-light/40 border border-black/10">
      <p className="text-xs text-charcoal font-medium mb-3">Wybierz swój bank</p>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {P24_BANKS.map((b) => {
          const active = selected === b.id;
          return (
            <button
              key={b.id}
              type="button"
              onClick={() => onSelect(b.id)}
              disabled={disabled}
              className={cn(
                "p-2.5 rounded-md border text-xs text-center transition-colors",
                active
                  ? "border-charcoal bg-white shadow-sm font-medium"
                  : "border-black/10 bg-white/60 hover:border-charcoal/40",
              )}
            >
              {b.name}
            </button>
          );
        })}
      </div>
      <p className="text-[11px] text-warm-gray mt-3 leading-relaxed">
        Po kliknięciu przekierujemy Cię do logowania w Twoim banku.
        Środki zaksięgujemy w ciągu kilku minut od potwierdzenia.
      </p>
    </div>
  );
}

function BankTransferDetails({ amount }: { amount: number }) {
  const reference = `FH-AD-${Date.now().toString().slice(-8)}`;
  return (
    <div className="p-4 rounded-lg bg-cream-light/40 border border-black/10 space-y-3">
      <p className="text-xs text-charcoal leading-relaxed">
        Wykonaj przelew na poniższe dane. Środki pojawią się na saldzie po zaksięgowaniu przez bank
        (zwykle <strong>1-2 dni robocze</strong>). Numer referencyjny w tytule jest <strong>kluczowy</strong> —
        bez niego nie znajdziemy Twojej wpłaty.
      </p>

      <div className="grid grid-cols-[140px_1fr] gap-x-3 gap-y-2 text-xs">
        <span className="text-warm-gray">Odbiorca:</span>
        <span className="text-charcoal font-medium">FashionHero sp. z o.o.</span>

        <span className="text-warm-gray">Numer konta:</span>
        <span className="text-charcoal font-mono">PL 12 1140 1010 0000 1234 5678 9012</span>

        <span className="text-warm-gray">SWIFT/BIC:</span>
        <span className="text-charcoal font-mono">BREXPLPWMBK</span>

        <span className="text-warm-gray">Kwota:</span>
        <span className="text-charcoal font-medium">{amount > 0 ? fmtPLNAmount(amount) : "—"}</span>

        <span className="text-warm-gray">Tytuł przelewu:</span>
        <span className="text-charcoal font-mono">Doładowanie {reference}</span>
      </div>

      <p className="text-[11px] text-warm-gray leading-relaxed pt-2 border-t border-black/10">
        Tych danych nie zatwierdzasz przyciskiem — wykonaj przelew z bankowości elektronicznej.
        Numer referencyjny <strong>{reference}</strong> wygasa za 7 dni.
      </p>
    </div>
  );
}
