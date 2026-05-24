"use client";

import { useMemo, useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  formatLabels,
  performanceSeries,
  optimizations,
  fmtNumber,
} from "@/data/campaigns";
import { CampaignChart } from "@/components/campaign-chart";
import { cn } from "@/lib/utils";
import { useCampaign, useMarketplace } from "@/store/marketplace-store";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function CampaignDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const campaign = useCampaign(id);
  const { hydrated, pauseCampaign, resumeCampaign, updateCampaign, deleteCampaign } = useMarketplace();
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [draftBudget, setDraftBudget] = useState(0);
  const [draftCpc, setDraftCpc] = useState(0);
  const [appliedSuggestionIds, setAppliedSuggestionIds] = useState<Set<string>>(new Set());
  const [toast, setToast] = useState<string | null>(null);

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  }

  function openEdit() {
    if (!campaign) return;
    setDraftBudget(campaign.dailyBudget);
    setDraftCpc(campaign.maxCpc);
    setEditing(true);
  }

  function saveEdit() {
    if (!campaign) return;
    updateCampaign(campaign.id, {
      dailyBudget: Math.max(20, draftBudget),
      maxCpc: Math.max(0.1, draftCpc),
    });
    setEditing(false);
    showToast(`Budżet zaktualizowany: ${draftBudget} PLN/dzień, CPC ${draftCpc.toFixed(2)} PLN`);
  }

  function applySuggestion(suggestionId: string) {
    if (!campaign) return;
    const suggestion = optimizations.find((o) => o.id === suggestionId);
    if (!suggestion) return;
    // Mock: just record as applied + show toast. Some suggestions tweak the campaign.
    if (suggestionId === "o1") {
      // "Podnieś CPC dla 'sweter' o 0,30 PLN"
      updateCampaign(campaign.id, { maxCpc: Math.round((campaign.maxCpc + 0.3) * 100) / 100 });
    }
    if (suggestionId === "o2") {
      // "Dodaj 'wełniany sweter' jako słowo kluczowe"
      if (!campaign.keywords.includes("wełniany sweter")) {
        updateCampaign(campaign.id, { keywords: [...campaign.keywords, "wełniany sweter"] });
      }
    }
    if (suggestionId === "o3") {
      // "Wstrzymaj 'skórzane botki'" — purely informational in mock
    }
    setAppliedSuggestionIds(new Set([...appliedSuggestionIds, suggestionId]));
    showToast(`Zastosowano: ${suggestion.title}`);
  }

  function togglePause() {
    if (!campaign) return;
    if (campaign.status === "active") {
      pauseCampaign(campaign.id);
      showToast("Kampania wstrzymana");
    } else {
      resumeCampaign(campaign.id);
      showToast("Kampania wznowiona");
    }
  }

  function handleDelete() {
    if (!campaign) return;
    const ok = typeof window !== "undefined" && window.confirm(
      `Na pewno chcesz usunąć kampanię "${campaign.name}"? Tej akcji nie da się cofnąć.`,
    );
    if (!ok) return;
    deleteCampaign(campaign.id);
    router.push("/seller/promotions");
  }

  const visibleOptimizations = useMemo(
    () => optimizations.filter((o) => !appliedSuggestionIds.has(o.id)),
    [appliedSuggestionIds],
  );

  if (!hydrated) {
    return (
      <div className="mx-auto max-w-7xl px-4 md:px-8 py-12">
        <p className="text-sm text-warm-gray">Ładowanie kampanii…</p>
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="mx-auto max-w-3xl px-4 md:px-8 py-12 text-center">
        <p className="text-sm text-warm-gray mb-4">Nie znaleziono kampanii o tym ID.</p>
        <Link
          href="/seller/promotions"
          className="inline-flex items-center gap-1 text-xs text-charcoal hover:underline"
        >
          ← Wróć do panelu promocji
        </Link>
      </div>
    );
  }

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
        <div className="flex gap-2 flex-wrap">
          <button
            type="button"
            onClick={openEdit}
            className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.5px] px-4 py-2 rounded border border-charcoal text-charcoal hover:bg-charcoal hover:text-white transition-all duration-200"
          >
            ✎ Edytuj budżet
          </button>
          <button
            type="button"
            onClick={togglePause}
            className={cn(
              "inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.5px] px-4 py-2 rounded border transition-all duration-200",
              campaign.status === "active"
                ? "border-charcoal text-charcoal hover:bg-charcoal hover:text-white"
                : "border-emerald-600 text-emerald-700 hover:bg-emerald-600 hover:text-white",
            )}
          >
            {campaign.status === "active" ? "⏸ Wstrzymaj" : "▶ Wznów"}
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.5px] px-4 py-2 rounded border border-red-600 text-red-600 hover:bg-red-600 hover:text-white transition-all duration-200"
          >
            🗑 Usuń
          </button>
        </div>
      </div>

      {/* Inline budget editor */}
      {editing && (
        <div className="mb-6 p-5 rounded-xl border border-charcoal/30 bg-cream-light/40">
          <p className="text-sm font-medium text-charcoal mb-4">Edytuj budżet i stawkę</p>
          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            <label className="block">
              <span className="text-xs text-warm-gray">Budżet dzienny (PLN)</span>
              <input
                type="number"
                min={20}
                step={10}
                value={draftBudget}
                onChange={(e) => setDraftBudget(parseFloat(e.target.value) || 0)}
                className="mt-1.5 w-full px-3 py-2 text-sm rounded-md border border-black/15 bg-white focus:outline-none focus:ring-2 focus:ring-charcoal/20"
              />
            </label>
            <label className="block">
              <span className="text-xs text-warm-gray">Maks. CPC (PLN)</span>
              <input
                type="number"
                min={0.1}
                step={0.1}
                value={draftCpc}
                onChange={(e) => setDraftCpc(parseFloat(e.target.value) || 0)}
                className="mt-1.5 w-full px-3 py-2 text-sm rounded-md border border-black/15 bg-white focus:outline-none focus:ring-2 focus:ring-charcoal/20"
              />
            </label>
          </div>
          <div className="flex gap-2 justify-end">
            <button
              type="button"
              onClick={() => setEditing(false)}
              className="text-[11px] uppercase tracking-[0.5px] px-4 py-2 rounded border border-charcoal text-charcoal hover:bg-charcoal hover:text-white transition-all duration-200"
            >
              Anuluj
            </button>
            <button
              type="button"
              onClick={saveEdit}
              className="text-[11px] uppercase tracking-[0.5px] px-4 py-2 rounded bg-charcoal text-white hover:bg-charcoal-light transition-colors"
            >
              Zapisz zmiany
            </button>
          </div>
        </div>
      )}

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
      {visibleOptimizations.length > 0 && (
        <div className="bg-white border border-black/10 rounded-xl p-5 md:p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-medium text-charcoal">
              Sugestie optymalizacji
            </h2>
            <span className="text-[11px] uppercase tracking-[1px] text-warm-gray">
              {visibleOptimizations.length} sugestii
            </span>
          </div>
          <div className="space-y-3">
            {visibleOptimizations.map((o) => (
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
                <button
                  type="button"
                  onClick={() => applySuggestion(o.id)}
                  className="text-[11px] uppercase tracking-wide px-3 py-1.5 rounded-full border border-charcoal text-charcoal hover:bg-charcoal hover:text-white shrink-0 transition-all duration-200"
                >
                  Zastosuj
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
      {visibleOptimizations.length === 0 && (
        <div className="bg-emerald-50/50 border border-emerald-200 rounded-xl p-5 mb-8 flex items-center gap-3">
          <span className="text-emerald-600 text-lg">✓</span>
          <p className="text-sm text-emerald-900">Wszystkie sugestie zostały zastosowane. Sprawdź wyniki za kilka dni.</p>
        </div>
      )}

      {/* Top keywords — only for CPC formats (banners don't use keywords) */}
      {campaign.format !== "category_banner" && (
      <div className="bg-white border border-black/10 rounded-xl p-5 md:p-6">
        <div className="flex items-end justify-between mb-4 gap-3">
          <h2 className="text-base font-medium text-charcoal">Twoje słowa kluczowe</h2>
          <p className="text-[11px] text-warm-gray">
            {campaign.keywords.length} {campaign.keywords.length === 1 ? "fraza" : campaign.keywords.length < 5 ? "frazy" : "fraz"}
          </p>
        </div>
        {campaign.keywords.length === 0 ? (
          <p className="text-sm text-warm-gray py-6 text-center">
            Ta kampania nie ma jeszcze słów kluczowych. Edytuj kampanię, aby je dodać.
          </p>
        ) : (
        <div className="overflow-x-auto -mx-2">
          <table className="w-full min-w-[520px] text-sm">
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
              {campaign.keywords.map((keyword, idx) => {
                // Mock per-keyword stats — deterministic so it doesn't reshuffle each render.
                // In production these would come from real ad-server attribution.
                const seed = keyword.length + idx;
                const impressions = Math.round(500 + (seed * 137) % 4500);
                const ctr = Math.round((1.2 + (seed * 0.31) % 2.2) * 10) / 10;
                const cpcVal = Math.round((campaign.maxCpc * 0.6 + (seed * 0.07) % 0.5) * 100) / 100;
                const conversion = Math.round((1.5 + (seed * 0.27) % 2.8) * 10) / 10;
                return (
                <tr key={keyword} className="border-b border-black/10 last:border-0">
                  <td className="px-2 py-3 font-medium text-charcoal">{keyword}</td>
                  <td className="px-2 py-3 text-right text-warm-gray">{fmtNumber(impressions)}</td>
                  <td className="px-2 py-3 text-right">{ctr}%</td>
                  <td className="px-2 py-3 text-right">{cpcVal.toFixed(2)} PLN</td>
                  <td className="px-2 py-3 text-right">{conversion}%</td>
                </tr>
              );
              })}
            </tbody>
          </table>
        </div>
        )}
      </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-lg bg-charcoal text-white text-sm shadow-lg">
          {toast}
        </div>
      )}
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
