import Link from "next/link";
import { getCampaignsBySeller, formatLabels, summary, fmtPLN, fmtNumber } from "@/data/campaigns";
import { getSellerById } from "@/data/sellers";
import { getWalletForSeller } from "@/data/wallet";
import { calculateBalanceRunway, fmtPLNAmount } from "@/lib/billing";
import type { Campaign } from "@/types";
import { cn } from "@/lib/utils";

const CURRENT_SELLER_ID = "s2";

export const metadata = {
  title: "Promocje — Panel sprzedawcy · FashionHero",
  description: "Zarządzaj promowanymi ofertami.",
};

export default function SellerPromotionsPage() {
  const seller = getSellerById(CURRENT_SELLER_ID);
  const campaigns = getCampaignsBySeller(CURRENT_SELLER_ID);
  const wallet = getWalletForSeller(CURRENT_SELLER_ID);
  const activeDailyBudget = campaigns
    .filter((c) => c.status === "active")
    .reduce((sum, c) => sum + c.dailyBudget, 0);
  const runwayDays = wallet ? calculateBalanceRunway(wallet.balance, activeDailyBudget) : Infinity;
  const isLowBalance = wallet && activeDailyBudget > 0 && runwayDays < 3;

  return (
    <div className="mx-auto max-w-7xl px-4 lg:px-8 py-8 md:py-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
        <div>
          <p className="text-[11px] uppercase tracking-[1px] text-warm-gray mb-2">
            {seller?.name ?? "Sprzedawca"} · Panel sprzedawcy
          </p>
          <h1 className="text-3xl md:text-4xl font-light tracking-tight text-charcoal">
            Promocje
          </h1>
          <p className="text-sm text-warm-gray mt-3 max-w-xl leading-relaxed">
            Zwiększ widoczność swoich produktów w wynikach wyszukiwania, banerach kategorii
            i sekcjach polecanych. Płacisz tylko za kliknięcia — nigdy za samą ekspozycję.
          </p>
        </div>
        <Link
          href="/seller/promotions/new"
          className="inline-flex items-center justify-center gap-2 bg-charcoal text-white text-[12px] font-medium uppercase tracking-[0.5px] px-5 py-3 rounded hover:bg-charcoal-light transition-colors"
        >
          <span aria-hidden>＋</span> Nowa kampania
        </Link>
      </div>

      {/* Wallet widget */}
      {wallet && (
        <div className={cn(
          "mb-6 p-5 rounded-xl border bg-white flex flex-col md:flex-row md:items-center justify-between gap-4",
          isLowBalance ? "border-amber-300 bg-amber-50/40" : "border-black/10",
        )}>
          <div className="flex items-start gap-4">
            <div className={cn(
              "w-10 h-10 rounded-lg flex items-center justify-center text-lg",
              isLowBalance ? "bg-amber-100 text-amber-700" : "bg-cream-light text-charcoal",
            )}>
              {isLowBalance ? "⚠" : "◐"}
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-[1px] text-warm-gray mb-1">Saldo promocji</p>
              <p className="text-2xl font-semibold text-charcoal">{fmtPLNAmount(wallet.balance)}</p>
              {activeDailyBudget > 0 && (
                <p className={cn(
                  "text-xs mt-1",
                  isLowBalance ? "text-amber-700" : "text-warm-gray",
                )}>
                  {isLowBalance
                    ? `Niskie saldo — przy obecnych kampaniach wystarczy na ${runwayDays === 0 ? "mniej niż 1 dzień" : `~${runwayDays} ${runwayDays === 1 ? "dzień" : "dni"}`}.`
                    : `Wystarczy na ~${runwayDays} dni przy obecnym tempie wydatków (${activeDailyBudget} PLN/dzień).`}
                </p>
              )}
            </div>
          </div>
          <Link
            href="/seller/promotions/wallet"
            className={cn(
              "inline-flex items-center justify-center gap-2 text-[12px] font-medium uppercase tracking-[0.5px] px-5 py-3 rounded transition-colors shrink-0",
              isLowBalance
                ? "bg-amber-600 text-white hover:bg-amber-700"
                : "border border-black/15 hover:border-charcoal hover:bg-cream-light",
            )}
          >
            <span aria-hidden>＋</span> Doładuj saldo
          </Link>
        </div>
      )}

      {/* Onboarding tip */}
      <div className="mb-8 p-4 rounded-lg border border-amber-200 bg-amber-50/60 flex items-start gap-3">
        <span className="text-amber-600 text-lg leading-none">✦</span>
        <div className="flex-1">
          <p className="text-sm font-medium text-charcoal">Pierwszy raz promujesz oferty?</p>
          <p className="text-xs text-warm-gray mt-1 leading-relaxed">
            Sprzedawcy korzystający z promocji widzą średnio <strong>2,8× więcej wyświetleń produktów</strong> w pierwszym miesiącu.
            Zacznij od małego budżetu dziennego (50 PLN wystarczy) i obserwuj dane.
          </p>
        </div>
      </div>

      {/* Summary metrics */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4 mb-10">
        <Metric label="Wydatki (ten miesiąc)" value={fmtPLN(summary.monthlySpend)} delta={`+${summary.monthlySpendDelta}%`} />
        <Metric label="Kliknięcia" value={fmtNumber(summary.monthlyClicks)} delta={`+${summary.monthlyClicksDelta}%`} />
        <Metric label="Przychód z reklam" value={fmtPLN(summary.adRevenue)} delta={`+${summary.adRevenueDelta}%`} />
        <Metric
          label="Zwrot z inwestycji"
          value={`${summary.roas.toFixed(2)}×`}
          delta={`+${summary.roasDelta.toFixed(1)}×`}
          tooltip={`Stosunek sprzedaży do kosztu reklam. ${summary.roas.toFixed(2)}× oznacza, że z każdej 1 PLN reklamy uzyskałeś ${summary.roas.toFixed(2)} PLN sprzedaży. (W branży: ROAS)`}
        />
        <Metric
          label="Średni CPC"
          value={`${summary.avgCpc.toFixed(2)} PLN`}
          delta={`${summary.avgCpcDelta.toFixed(2)}`}
          deltaPositive={false}
          tooltip="CPC = średnia kwota, którą płacisz za jedno kliknięcie w Twoją reklamę."
        />
      </div>

      {/* Campaigns list */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-medium text-charcoal">Twoje kampanie</h2>
        <span className="text-xs text-warm-gray">{campaigns.length} {campaigns.length === 1 ? "kampania" : "kampanii"}</span>
      </div>

      <div className="grid gap-3 md:gap-4">
        {campaigns.map((c) => (
          <CampaignCard key={c.id} campaign={c} />
        ))}
      </div>

      {/* Fairness panel */}
      <div className="mt-12 p-5 md:p-6 rounded-xl border border-black/10 bg-cream-light/40">
        <p className="text-[11px] uppercase tracking-[1px] text-warm-gray mb-2">
          Uczciwość marketplace
        </p>
        <h3 className="text-base font-medium mb-2 text-charcoal">Przejrzysty system reklam z limitem</h3>
        <p className="text-sm text-warm-gray max-w-2xl mb-4 leading-relaxed">
          Aby chronić jakość wyszukiwania dla 2,4 mln kupujących, ograniczamy promowane miejsca do{" "}
          <strong className="text-charcoal">30% widocznej oferty</strong>. Pozostałe 70% jest czysto organiczne — ranking po
          trafności, ocenach i nowości.
        </p>
        <div className="flex h-2 rounded-full overflow-hidden bg-black/5">
          <div className="h-full bg-amber-400" style={{ width: "30%" }} />
          <div className="h-full bg-charcoal/80" style={{ width: "70%" }} />
        </div>
        <div className="flex justify-between text-xs text-warm-gray mt-2">
          <span>30% sponsorowane</span>
          <span>70% organiczne</span>
        </div>
      </div>
    </div>
  );
}

function Metric({
  label,
  value,
  delta,
  deltaPositive = true,
  tooltip,
}: {
  label: string;
  value: string;
  delta: string;
  deltaPositive?: boolean;
  tooltip?: string;
}) {
  return (
    <div className="p-4 rounded-lg border border-black/10 bg-white" title={tooltip}>
      <p className="text-[10px] uppercase tracking-[0.5px] text-warm-gray mb-2 flex items-center gap-1">
        {label}
        {tooltip && (
          <span aria-hidden className="inline-flex items-center justify-center w-3 h-3 rounded-full bg-black/10 text-[8px] text-warm-gray cursor-help leading-none">
            i
          </span>
        )}
      </p>
      <p className="text-xl font-semibold text-charcoal">{value}</p>
      <p className={cn("text-xs mt-1", deltaPositive ? "text-emerald-600" : "text-warm-gray")}>
        {delta} vs poprzedni miesiąc
      </p>
    </div>
  );
}

function CampaignCard({ campaign }: { campaign: Campaign }) {
  const budgetPct = Math.min(100, Math.round((campaign.spentToday / campaign.dailyBudget) * 100));
  const isPaused = campaign.status === "paused";

  return (
    <Link
      href={`/seller/promotions/${campaign.id}`}
      className="block p-4 md:p-5 rounded-xl border border-black/10 bg-white hover:border-charcoal/30 transition-colors group"
    >
      <div className="flex flex-col md:flex-row md:items-center gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className="text-[11px] uppercase tracking-[1px] text-warm-gray">{formatLabels[campaign.format]}</span>
            <StatusPill status={campaign.status} />
          </div>
          <h3 className="text-base font-medium truncate flex items-center gap-2 text-charcoal">
            {campaign.name}
            <span className="opacity-0 group-hover:opacity-60 transition-opacity text-warm-gray">→</span>
          </h3>

          {/* Budget bar */}
          <div className="mt-3 max-w-md">
            <div className="flex justify-between text-xs text-warm-gray mb-1">
              <span>{campaign.spentToday} / {campaign.dailyBudget} PLN dziś</span>
              <span>{budgetPct}%</span>
            </div>
            <div className="h-1.5 rounded-full bg-black/5 overflow-hidden">
              <div
                className={cn(
                  "h-full transition-all",
                  budgetPct >= 80 ? "bg-amber-500" : "bg-charcoal"
                )}
                style={{ width: `${budgetPct}%` }}
              />
            </div>
            {budgetPct >= 80 && !isPaused && (
              <p className="text-[11px] text-amber-700 mt-1">⚠ Wykorzystano {budgetPct}% budżetu dziennego</p>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 md:gap-6 md:min-w-[300px]">
          <Stat label="Kliknięcia" value={fmtNumber(campaign.clicks)} />
          <Stat label="Sprzedaż" value={`${fmtNumber(campaign.attributedSales)} PLN`} />
          <Stat
            label="Zwrot"
            value={isPaused ? "—" : `${campaign.roas.toFixed(1)}×`}
            highlight={!isPaused}
            tooltip={isPaused ? undefined : `Z każdej 1 PLN reklamy: ${campaign.roas.toFixed(1)} PLN sprzedaży. (W branży: ROAS)`}
          />
        </div>
      </div>
    </Link>
  );
}

function Stat({ label, value, highlight = false, tooltip }: { label: string; value: string; highlight?: boolean; tooltip?: string }) {
  return (
    <div title={tooltip}>
      <p className="text-[10px] uppercase tracking-wide text-warm-gray flex items-center gap-1">
        {label}
        {tooltip && (
          <span aria-hidden className="inline-flex items-center justify-center w-3 h-3 rounded-full bg-black/10 text-[8px] text-warm-gray cursor-help leading-none">
            i
          </span>
        )}
      </p>
      <p className={cn("text-sm font-semibold mt-0.5", highlight ? "text-charcoal" : "text-warm-gray")}>{value}</p>
    </div>
  );
}

function StatusPill({ status }: { status: "active" | "paused" }) {
  if (status === "active") {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] uppercase tracking-wide rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" /> Aktywna
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] uppercase tracking-wide rounded-full bg-black/5 text-warm-gray border border-black/10">
      <span className="w-1.5 h-1.5 rounded-full bg-warm-gray inline-block" /> Wstrzymana
    </span>
  );
}
