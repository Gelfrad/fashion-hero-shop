import Link from "next/link";
import { notFound } from "next/navigation";
import { getInvoice } from "@/data/wallet";
import { getSellerById } from "@/data/sellers";
import { fmtPLNAmount, fmtDate } from "@/lib/billing";
import { PrintButton } from "@/components/print-button";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  const inv = getInvoice(id);
  return { title: inv ? `${inv.number} — Faktura · FashionHero` : "Faktura · FashionHero" };
}

export default async function InvoiceViewPage({ params }: PageProps) {
  const { id } = await params;
  const invoice = getInvoice(id);
  if (!invoice) notFound();

  const seller = getSellerById(invoice.sellerId);
  const sentDate = invoice.ksefSentAt ? fmtDate(invoice.ksefSentAt, true) : null;

  return (
    <div className="mx-auto max-w-3xl px-4 lg:px-8 py-8 md:py-12">
      <Link
        href="/seller/promotions/wallet"
        className="inline-flex items-center gap-1 text-xs text-warm-gray hover:text-charcoal mb-6 transition-colors print:hidden"
      >
        ← Wróć do salda
      </Link>

      <div className="flex items-center justify-between mb-6 print:hidden">
        <p className="text-sm text-warm-gray">
          To wizualizacja faktury (FA(3)). Oryginał XML znajdziesz w <strong>Mój KSeF</strong>.
        </p>
        <PrintButton />
      </div>

      {/* Invoice document */}
      <div className="bg-white border border-black/10 rounded-xl p-8 md:p-12 shadow-sm">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 pb-6 border-b border-black/10">
          <div>
            <p className="text-xs uppercase tracking-[1px] text-warm-gray mb-1">Faktura VAT</p>
            <h1 className="text-2xl font-semibold text-charcoal">{invoice.number}</h1>
            <p className="text-xs text-warm-gray mt-2">
              Data wystawienia: <strong className="text-charcoal">{fmtDate(invoice.date)}</strong><br />
              Data sprzedaży: <strong className="text-charcoal">{fmtDate(invoice.date)}</strong>
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs uppercase tracking-[1px] text-warm-gray mb-1">Status KSeF</p>
            {invoice.ksefStatus === "sent" && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] uppercase tracking-wide rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                Wysłana do KSeF
              </span>
            )}
            {invoice.ksefStatus === "pending" && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] uppercase tracking-wide rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                Wysyłanie…
              </span>
            )}
            {invoice.ksefStatus === "error" && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] uppercase tracking-wide rounded-full bg-red-50 text-red-700 border border-red-200">
                Błąd wysyłki
              </span>
            )}
            {invoice.ksefRefNumber && (
              <p className="text-[10px] text-warm-gray mt-2 font-mono">
                Nr KSeF:<br />
                <span className="text-charcoal">{invoice.ksefRefNumber}</span>
              </p>
            )}
            {sentDate && (
              <p className="text-[10px] text-warm-gray mt-1">Wysłano: {sentDate}</p>
            )}
          </div>
        </div>

        {/* Parties */}
        <div className="grid md:grid-cols-2 gap-8 py-6 border-b border-black/10">
          <div>
            <p className="text-[10px] uppercase tracking-[1px] text-warm-gray mb-2">Sprzedawca</p>
            <p className="text-sm font-medium text-charcoal">FashionHero sp. z o.o.</p>
            <p className="text-xs text-warm-gray mt-1 leading-relaxed">
              ul. Marszałkowska 142<br />
              00-061 Warszawa<br />
              NIP: 5252384754<br />
              KRS: 0000123456
            </p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-[1px] text-warm-gray mb-2">Nabywca</p>
            <p className="text-sm font-medium text-charcoal">{invoice.buyerName ?? seller?.name}</p>
            <p className="text-xs text-warm-gray mt-1 leading-relaxed">
              ul. Przykładowa 12/3<br />
              00-001 Warszawa<br />
              NIP: {invoice.buyerNip}
            </p>
          </div>
        </div>

        {/* Items table */}
        <div className="py-6 border-b border-black/10">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[10px] uppercase tracking-wide text-warm-gray border-b border-black/10">
                <th className="py-2 font-medium">Nazwa usługi</th>
                <th className="py-2 font-medium text-right">Netto</th>
                <th className="py-2 font-medium text-right">VAT {invoice.vatRate}%</th>
                <th className="py-2 font-medium text-right">Brutto</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="py-3">
                  <p className="text-sm text-charcoal">Doładowanie salda promocji FashionHero</p>
                  <p className="text-[11px] text-warm-gray mt-0.5">
                    Środki na pokrycie kosztów kampanii reklamowych (Promowane Oferty).
                  </p>
                </td>
                <td className="py-3 text-right text-charcoal tabular-nums">{fmtPLNAmount(invoice.amountNet)}</td>
                <td className="py-3 text-right text-warm-gray tabular-nums">{fmtPLNAmount(invoice.vat)}</td>
                <td className="py-3 text-right font-medium text-charcoal tabular-nums">{fmtPLNAmount(invoice.amountGross)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className="flex justify-end pt-6">
          <div className="w-full md:w-auto md:min-w-[260px]">
            <div className="flex justify-between text-sm py-1">
              <span className="text-warm-gray">Razem netto:</span>
              <span className="text-charcoal tabular-nums">{fmtPLNAmount(invoice.amountNet)}</span>
            </div>
            <div className="flex justify-between text-sm py-1">
              <span className="text-warm-gray">VAT {invoice.vatRate}%:</span>
              <span className="text-charcoal tabular-nums">{fmtPLNAmount(invoice.vat)}</span>
            </div>
            <div className="flex justify-between py-2 mt-1 border-t border-black/10">
              <span className="text-sm font-medium text-charcoal">Do zapłaty (brutto):</span>
              <span className="text-base font-semibold text-charcoal tabular-nums">
                {fmtPLNAmount(invoice.amountGross)}
              </span>
            </div>
            <p className="text-[10px] text-emerald-700 mt-2 text-right">
              ✓ Zapłacono {fmtDate(invoice.date)} — saldo doładowane
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-black/10">
          <p className="text-[10px] text-warm-gray leading-relaxed">
            Dokument wystawiony i przesłany do Krajowego Systemu e-Faktur (KSeF) zgodnie z art. 106nda ustawy o VAT.
            Oryginał faktury (XML w formacie FA(3)) jest dostępny w aplikacji <strong>Mój KSeF</strong>.
            Niniejszy dokument stanowi wizualizację faktury elektronicznej.
          </p>
        </div>
      </div>

      <style>{`
        @media print {
          body { background: white !important; }
          .print\\:hidden { display: none !important; }
        }
      `}</style>
    </div>
  );
}
