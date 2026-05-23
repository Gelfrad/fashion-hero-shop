import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getCampaign,
  formatLabels,
  performanceSeries,
  topKeywords,
  optimizations,
  fmtNumber,
} from "@/data/campaigns";
import { CampaignChart } from "@/components/campaign-chart";
import { cn } from "@/lib/utils";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  const campaign = getCampaign(id);
  return {
    title: campaign ? `${campaign.name} — Promocje · FashionHero` : "Kampania · FashionHero",
  };
}

export default async function CampaignDetailPage({ params }: PageProps) {
  const { id } = await params;
  const campaign = getCampaign(id);
  if (!campaign) notFound();

  return (
    <div className="mx-auto max-w-7xl px-4 md:px-8 py-8 md:py-12">
      <Link
        href="/seller/promotions"
        className="inline-flex items-center gap-1 text-xs text-warm-gray hover:text-charcoal mb-6 transition-colors"
      >
        ← Wróć do kampanii
      </Link>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
        <div>
          <p className="text-[11px] uppercase tracking-[1px] text-warm-gray mb-2">
            {formatLabels[campaign.format]}
          </p>
          <h1 className="text-2xl md:text-3xl font-light tracking-tight text-charcoal">
            {campaign.name}
          </h1>
          <p className="text-xs text-warm-gray mt-2">
            Ostatnie 30 dni · {fmtNumber(campaign.impressions)} wyświetleń ·{" "}
            <span title="CTR (klikalność) = procent osób, które kliknęły reklamę po jej zobaczeniu." className="cursor-help underline decoration-dotted">
              CTR {campaign.ctr}%
            </span>
          </p>
        </div>
        <div className="flex gap-2">
          <button className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.5px] px-4 py-2 rounded border border-black/15 hover:border-charcoal transition-colors">
            ✎ Edytuj budżet
          </button>
          <button
            className={cn(
              "inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.5px] px-4 py-2 rounded border transition-colors",
              campaign.status === "active"
                ? "border-black/15 hover:border-charcoal"
                : "border-emerald-300 text-emerald-700 hover:bg-emerald-50",
            )}
          >
            {campaign.status === "active" ? "⏸ Wstrzymaj" : "▶ Wznów"}
          </button>
        </div>
      </div>

      {/* Key metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-8">
        <KPI label="Wydano dziś" value={`${campaign.spentToday} / ${campaign.dailyBudget} PLN`} />
        <KPI label="Kliknięcia (30 dni)" value={fmtNumber(campaign.clicks)} />
        <KPI label="Sprzedaż przypisana" value={`${fmtNumber(campaign.attributedSales)} PLN`} />
        <KPI
          label="Zwrot z inwestycji"
          value={`${campaign.roas.toFixed(1)}×`}
          highlight
          tooltip={`Stosunek sprzedaży do kosztu reklam. ${campaign.roas.toFixed(1)}× = z każdej 1 PLN reklamy uzyskałeś ${campaign.roas.toFixed(1)} PLN sprzedaży. (W branży: ROAS)`}
        />
      </div>

      {/* Chart */}
      <div className="bg-white border border-black/10 rounded-xl p-5 md:p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-medium text-charcoal">
            Wyniki — ostatnie 30 dni
          </h2>
          <div className="flex gap-3 text-xs text-warm-gray">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-charcoal" /> Kliknięcia
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Sprzedaż (PLN)
            </span>
          </div>
        </div>
        <div className="h-64">
          <CampaignChart data={performanceSeries} />
        </div>
      </div>

      {/* Optimizations */}
      <div className="bg-white border border-black/10 rounded-xl p-5 md:p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-medium text-charcoal">
            Sugestie optymalizacji
          </h2>
          <span className="text-[11px] uppercase tracking-[1px] text-warm-gray">
            {optimizations.length} sugestii
          </span>
        </div>
        <div className="space-y-3">
          {optimizations.map((o) => (
            <div key={o.id} className="flex items-start gap-3 p-3 rounded-lg border border-black/10">
              <div
                className={cn(
                  "w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs",
                  o.severity === "high"
                    ? "bg-amber-100 text-amber-700"
                    : o.severity === "medium"
                    ? "bg-cream text-charcoal"
                    : "bg-black/5 text-warm-gray",
                )}
              >
                !
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-charcoal">{o.title}</p>
                <p className="text-xs text-warm-gray mt-0.5">{o.reason}</p>
              </div>
              <button className="text-[11px] uppercase tracking-wide px-3 py-1.5 rounded-full border border-black/15 hover:bg-cream-light shrink-0 transition-colors">
                Zastosuj
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Top keywords */}
      <div className="bg-white border border-black/10 rounded-xl p-5 md:p-6">
        <h2 className="text-base font-medium mb-4 text-charcoal">Top słowa kluczowe</h2>
        <div className="overflow-x-auto -mx-2">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[10px] uppercase tracking-wide text-warm-gray border-b border-black/10">
                <th className="px-2 py-2 font-medium">Słowo kluczowe</th>
                <th className="px-2 py-2 font-medium text-right">Wyświetlenia</th>
                <th className="px-2 py-2 font-medium text-right cursor-help" title="CTR (klikalność) = procent osób, które kliknęły reklamę po jej zobaczeniu.">
                  CTR
                </th>
                <th className="px-2 py-2 font-medium text-right cursor-help" title="CPC = średni koszt za jedno kliknięcie w reklamę.">
                  CPC
                </th>
                <th className="px-2 py-2 font-medium text-right">Konwersja</th>
              </tr>
            </thead>
            <tbody>
              {topKeywords.map((k) => (
                <tr key={k.keyword} className="border-b border-black/10 last:border-0">
                  <td className="px-2 py-3 font-medium text-charcoal">{k.keyword}</td>
                  <td className="px-2 py-3 text-right text-warm-gray">{fmtNumber(k.impressions)}</td>
                  <td className="px-2 py-3 text-right">{k.ctr}%</td>
                  <td className="px-2 py-3 text-right">{k.cpc.toFixed(2)} PLN</td>
                  <td className="px-2 py-3 text-right">{k.conversion}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function KPI({ label, value, highlight = false, tooltip }: { label: string; value: string; highlight?: boolean; tooltip?: string }) {
  return (
    <div className="p-4 rounded-lg border border-black/10 bg-white" title={tooltip}>
      <p className="text-[11px] uppercase tracking-wide text-warm-gray flex items-center gap-1">
        {label}
        {tooltip && (
          <span aria-hidden className="inline-flex items-center justify-center w-3 h-3 rounded-full bg-black/10 text-[8px] text-warm-gray cursor-help leading-none">
            i
          </span>
        )}
      </p>
      <p className={cn("text-xl font-semibold mt-1", highlight ? "text-charcoal" : "text-charcoal")}>
        {value}
      </p>
    </div>
  );
}
