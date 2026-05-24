"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { formatLabels, formatDescriptions, keywordSuggestions } from "@/data/campaigns";
import { getProductsBySeller } from "@/data/products";
import { calculateBalanceRunway, fmtPLNAmount } from "@/lib/billing";
import type { CampaignFormat, Product } from "@/types";
import { cn } from "@/lib/utils";
import { useMarketplace, useWalletForCurrentSeller, MARKETPLACE_CURRENT_SELLER_ID } from "@/store/marketplace-store";

const CURRENT_SELLER_SLUG = "bella-donna";

const STEPS = ["Format", "Konfiguracja", "Podsumowanie"] as const;

export default function NewCampaignPage() {
  const router = useRouter();
  const sellerProducts = getProductsBySeller(CURRENT_SELLER_SLUG);
  const { addCampaign } = useMarketplace();
  const wallet = useWalletForCurrentSeller();

  const [step, setStep] = useState(0);
  const [format, setFormat] = useState<CampaignFormat | null>(null);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [keywords, setKeywords] = useState<string[]>(["sweter", "wełniany sweter"]);
  const [keywordInput, setKeywordInput] = useState("");
  const [campaignName, setCampaignName] = useState("");
  const [dailyBudget, setDailyBudget] = useState(80);
  const [totalBudget, setTotalBudget] = useState(560);
  const [cpc, setCpc] = useState(1.2);
  const [duration, setDuration] = useState(7);
  const [estimating, setEstimating] = useState(false);
  const [estimated, setEstimated] = useState(false);

  function launchCampaign() {
    if (!format || selectedProducts.length === 0) return;
    const autoName = generateCampaignName(format, selectedProducts, sellerProducts);
    const finalName = campaignName.trim() || autoName;
    const newCampaign = addCampaign({
      sellerId: MARKETPLACE_CURRENT_SELLER_ID,
      name: finalName,
      format,
      status: "active",
      productIds: selectedProducts,
      keywords: format === "category_banner" ? [] : keywords,
      dailyBudget,
      totalBudget,
      maxCpc: format === "category_banner" ? 0 : cpc,
      durationDays: duration,
      // banner-specific fields filled when format === "category_banner"
      bannerImage: format === "category_banner" ? "/images/hero/hero-2.jpg" : undefined,
      bannerHeadline: format === "category_banner" ? finalName : undefined,
      bannerCta: format === "category_banner" ? "Zobacz kolekcję" : undefined,
      bannerCategory: format === "category_banner" ? "womens" : undefined,
    });
    router.push(`/seller/promotions/${newCampaign.id}`);
  }

  const goNext = () => {
    if (step === 1) {
      setEstimating(true);
      setEstimated(false);
      setTimeout(() => {
        setEstimating(false);
        setEstimated(true);
      }, 1100);
    }
    setStep((s) => Math.min(STEPS.length - 1, s + 1));
  };

  const goBack = () => {
    if (step === 0) {
      router.push("/seller/promotions");
      return;
    }
    setStep((s) => Math.max(0, s - 1));
  };

  const canContinue =
    step === 0 ? !!format
    : step === 1 ? selectedProducts.length > 0
    : true;

  return (
    <div className="mx-auto max-w-4xl px-4 md:px-8 py-8 md:py-12">
      <button
        onClick={goBack}
        className="inline-flex items-center gap-1 text-xs text-warm-gray hover:text-charcoal mb-6 transition-colors"
      >
        ← {step === 0 ? "Wróć do kampanii" : "Poprzedni krok"}
      </button>

      <div className="mb-8">
        <p className="text-[11px] uppercase tracking-[1px] text-warm-gray mb-2">Nowa kampania</p>
        <h1 className="text-3xl font-light tracking-tight text-charcoal">Promocja produktu</h1>
      </div>

      {/* Stepper */}
      <div className="flex items-center gap-2 mb-10">
        {STEPS.map((label, i) => (
          <div key={label} className="flex items-center gap-2 flex-1">
            <div
              className={cn(
                "w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium border transition-colors shrink-0",
                i < step
                  ? "bg-charcoal text-white border-charcoal"
                  : i === step
                  ? "bg-white text-charcoal border-charcoal"
                  : "bg-white text-warm-gray border-black/15",
              )}
            >
              {i < step ? "✓" : i + 1}
            </div>
            <span className={cn(
              "text-[11px] uppercase tracking-[1px] whitespace-nowrap",
              // Hide labels on mobile, show only on sm+. Active step's label still shows for context.
              i === step ? "text-charcoal font-medium" : "text-warm-gray hidden sm:inline",
            )}>
              {label}
            </span>
            {i < STEPS.length - 1 && <div className="flex-1 h-px bg-black/10 sm:ml-2" />}
          </div>
        ))}
      </div>

      {/* Step content */}
      <div className="bg-white border border-black/10 rounded-xl p-6 md:p-8">
        {step === 0 && <FormatStep format={format} onChange={setFormat} />}
        {step === 1 && format && (
          <ConfigStep
            format={format}
            sellerProducts={sellerProducts}
            selectedProducts={selectedProducts}
            setSelectedProducts={setSelectedProducts}
            keywords={keywords}
            setKeywords={setKeywords}
            keywordInput={keywordInput}
            setKeywordInput={setKeywordInput}
            dailyBudget={dailyBudget}
            setDailyBudget={setDailyBudget}
            totalBudget={totalBudget}
            setTotalBudget={setTotalBudget}
            cpc={cpc}
            setCpc={setCpc}
            duration={duration}
            setDuration={setDuration}
          />
        )}
        {step === 2 && format && (
          <ReviewStep
            format={format}
            dailyBudget={dailyBudget}
            cpc={cpc}
            duration={duration}
            keywords={keywords}
            selectedProductCount={selectedProducts.length}
            estimating={estimating}
            estimated={estimated}
          />
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between mt-6">
        <button
          onClick={goBack}
          className="text-[12px] font-medium uppercase tracking-[0.5px] px-5 py-3 rounded border border-charcoal text-charcoal hover:bg-charcoal hover:text-white transition-all duration-200"
        >
          Wstecz
        </button>
        {step < STEPS.length - 1 ? (
          <button
            onClick={goNext}
            disabled={!canContinue}
            className="text-[12px] font-medium uppercase tracking-[0.5px] px-5 py-3 rounded bg-charcoal text-white hover:bg-charcoal-light transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Dalej →
          </button>
        ) : (
          <button
            onClick={launchCampaign}
            disabled={!format || selectedProducts.length === 0}
            className="text-[12px] font-medium uppercase tracking-[0.5px] px-5 py-3 rounded bg-charcoal text-white hover:bg-charcoal-light transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Uruchom kampanię
          </button>
        )}
      </div>
    </div>
  );
}

function FormatStep({
  format,
  onChange,
}: {
  format: CampaignFormat | null;
  onChange: (f: CampaignFormat) => void;
}) {
  const formats: { id: CampaignFormat; icon: string; pricing: string; bestFor: string }[] = [
    {
      id: "top_search",
      icon: "🎯",
      pricing: "CPC · płać za kliknięcie",
      bestFor: "Najlepsze dla: bestsellerów, nowości, sezonowych pushów.",
    },
    {
      id: "category_banner",
      icon: "🖼",
      pricing: "Opłata stała · 7 dni",
      bestFor: "Najlepsze dla: brand awareness, premier kolekcji.",
    },
    {
      id: "similar_products",
      icon: "▦",
      pricing: "CPC · płać za kliknięcie",
      bestFor: "Najlepsze dla: cross-sellingu i odbierania ruchu konkurencji.",
    },
  ];

  return (
    <div>
      <h2 className="text-lg font-medium mb-1 text-charcoal">Wybierz format</h2>
      <p className="text-sm text-warm-gray mb-6">Trzy sposoby na zwiększenie widoczności. Możesz uruchomić kilka jednocześnie.</p>

      <div className="grid md:grid-cols-3 gap-3 items-stretch">
        {formats.map((f) => {
          const active = format === f.id;
          return (
            <button
              key={f.id}
              type="button"
              onClick={() => onChange(f.id)}
              className={cn(
                "text-left p-5 rounded-xl border transition-all relative h-full flex flex-col",
                active
                  ? "border-charcoal bg-cream-light shadow-sm"
                  : "border-black/15 hover:border-charcoal/40",
              )}
            >
              {active && (
                <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-charcoal text-white flex items-center justify-center text-[11px]">
                  ✓
                </div>
              )}
              <div className="text-2xl mb-3">{f.icon}</div>
              <p className="text-[11px] uppercase tracking-[1px] text-warm-gray mb-1">{f.pricing}</p>
              <h3 className="text-sm font-semibold mb-2 text-charcoal">{formatLabels[f.id]}</h3>
              <p className="text-xs text-warm-gray leading-relaxed mb-4">{formatDescriptions[f.id]}</p>
              <p className="text-[11px] text-charcoal/70 mt-auto pt-2 border-t border-black/5">{f.bestFor}</p>
            </button>
          );
        })}
      </div>

      <div className="mt-6 flex items-start gap-2 text-xs text-warm-gray leading-relaxed">
        <span aria-hidden className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-black/10 text-[10px] text-warm-gray shrink-0 mt-0.5">
          i
        </span>
        <p>
          <strong>Uczciwe oczekiwania:</strong> promowane oferty wzmacniają produkty, które już konwertują.
          Nie zmienią słabych ofert w bestsellery — zacznij od najmocniejszych produktów.
        </p>
      </div>
    </div>
  );
}

function ConfigStep(props: {
  format: CampaignFormat;
  sellerProducts: Product[];
  selectedProducts: string[];
  setSelectedProducts: (v: string[]) => void;
  keywords: string[];
  setKeywords: (v: string[]) => void;
  keywordInput: string;
  setKeywordInput: (v: string) => void;
  dailyBudget: number;
  setDailyBudget: (v: number) => void;
  totalBudget: number;
  setTotalBudget: (v: number) => void;
  cpc: number;
  setCpc: (v: number) => void;
  duration: number;
  setDuration: (v: number) => void;
}) {
  const {
    format, sellerProducts, selectedProducts, setSelectedProducts,
    keywords, setKeywords, keywordInput, setKeywordInput,
    dailyBudget, setDailyBudget, totalBudget, setTotalBudget,
    cpc, setCpc, duration, setDuration,
  } = props;

  const toggleProduct = (id: string) => {
    setSelectedProducts(
      selectedProducts.includes(id)
        ? selectedProducts.filter((p) => p !== id)
        : selectedProducts.length >= 4
        ? selectedProducts
        : [...selectedProducts, id],
    );
  };

  const addKeyword = (kw: string) => {
    const v = kw.trim().toLowerCase();
    if (v && !keywords.includes(v)) setKeywords([...keywords, v]);
    setKeywordInput("");
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-lg font-medium mb-1 text-charcoal">Skonfiguruj kampanię</h2>
        <p className="text-sm text-warm-gray">
          Format: <strong className="text-charcoal">{formatLabels[format]}</strong>
        </p>
      </div>

      <Section title="Produkty do promocji" subtitle="Wybierz 1–4 swoje produkty. Zacznij od bestsellerów.">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {sellerProducts.slice(0, 8).map((p) => {
            const sel = selectedProducts.includes(p.id);
            const img = p.colors[0]?.image ?? p.images[0];
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => toggleProduct(p.id)}
                className={cn(
                  "text-left rounded-lg border overflow-hidden transition-all",
                  sel ? "border-charcoal ring-2 ring-charcoal/10" : "border-black/15 hover:border-charcoal/40",
                )}
              >
                <div className="relative bg-cream-light" style={{ aspectRatio: "3/4" }}>
                  {img && (
                    <Image src={img} alt={p.name} fill sizes="200px" className="object-cover" />
                  )}
                  {sel && (
                    <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-charcoal text-white flex items-center justify-center text-[10px]">
                      ✓
                    </div>
                  )}
                </div>
                <div className="p-2">
                  <p className="text-xs font-medium truncate text-charcoal">{p.name}</p>
                  <p className="text-[11px] text-warm-gray">{p.price} PLN</p>
                </div>
              </button>
            );
          })}
        </div>
        <p className="text-[11px] text-warm-gray mt-2">
          Wybrano: <strong className="text-charcoal">{selectedProducts.length}</strong> z 4
        </p>
      </Section>

      {format !== "category_banner" && (
        <Section title="Słowa kluczowe" subtitle="Dodaj frazy wyszukiwania, w których chcesz wygrywać.">
          <div className="flex flex-wrap gap-2 mb-3">
            {keywords.map((kw) => (
              <span
                key={kw}
                className="inline-flex items-center gap-1.5 px-3 py-1 bg-cream-light text-charcoal text-xs rounded-full border border-black/15"
              >
                {kw}
                <button
                  type="button"
                  onClick={() => setKeywords(keywords.filter((k) => k !== kw))}
                  className="text-warm-gray hover:text-charcoal"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              value={keywordInput}
              onChange={(e) => setKeywordInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addKeyword(keywordInput);
                }
              }}
              placeholder="Wpisz słowo kluczowe i naciśnij Enter"
              className="flex-1 px-3 py-2 text-sm rounded-md border border-black/15 bg-white focus:outline-none focus:ring-2 focus:ring-charcoal/20"
            />
            <button
              type="button"
              onClick={() => addKeyword(keywordInput)}
              className="px-4 py-2 text-xs uppercase tracking-wide rounded-md border border-charcoal text-charcoal hover:bg-charcoal hover:text-white transition-all duration-200"
            >
              Dodaj
            </button>
          </div>
          <div className="mt-3">
            <p className="text-[11px] text-warm-gray mb-1.5">Sugestie dla Twojej kategorii:</p>
            <div className="flex flex-wrap gap-1.5">
              {keywordSuggestions.slice(0, 6).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => addKeyword(s)}
                  className="px-2.5 py-1 text-[11px] rounded-full border border-dashed border-charcoal/50 text-charcoal hover:bg-charcoal hover:text-white hover:border-charcoal transition-all duration-200"
                >
                  + {s}
                </button>
              ))}
            </div>
          </div>
        </Section>
      )}

      <Section title="Budżet" subtitle="Nigdy nie pobierzemy więcej niż dzienny limit.">
        <div className="grid md:grid-cols-2 gap-6">
          <SliderField
            label="Budżet dzienny"
            value={dailyBudget}
            min={20}
            max={500}
            step={5}
            unit="PLN"
            onChange={setDailyBudget}
            hint={dailyBudget < 50 ? "Wskazówka: minimum 50 PLN/dzień zapewnia sensowne dane." : undefined}
          />
          <SliderField
            label="Limit budżetu całkowitego"
            value={totalBudget}
            min={100}
            max={5000}
            step={50}
            unit="PLN"
            onChange={setTotalBudget}
          />
        </div>
      </Section>

      <Section title={format === "category_banner" ? "Czas trwania" : "Stawka i czas trwania"}>
        <div className="grid md:grid-cols-2 gap-6">
          {format !== "category_banner" && (
            <SliderField
              label="Maks. stawka CPC"
              value={cpc}
              min={0.3}
              max={3}
              step={0.05}
              unit="PLN"
              decimals={2}
              onChange={setCpc}
              hint="Rekomendacja: 1,20 PLN · Konkurencja: 0,80–1,80 PLN"
            />
          )}
          <SliderField
            label={format === "category_banner" ? "Czas trwania banera" : "Czas trwania kampanii"}
            value={duration}
            min={1}
            max={30}
            step={1}
            unit={duration === 1 ? "dzień" : "dni"}
            onChange={setDuration}
          />
        </div>
      </Section>

      <div className="p-4 rounded-lg bg-cream-light border border-black/10 flex items-center justify-between">
        <div>
          <p className="text-[11px] uppercase tracking-[1px] text-warm-gray">Maks. koszt całkowity</p>
          <p className="text-2xl font-semibold mt-1 text-charcoal">
            {Math.min(totalBudget, dailyBudget * duration).toLocaleString("pl-PL")} PLN
          </p>
        </div>
        <p className="text-xs text-warm-gray max-w-xs text-right leading-relaxed">
          Bez ukrytych opłat. Płacisz tylko za faktyczne kliknięcia (formaty CPC) lub stałą opłatę za baner.
        </p>
      </div>
    </div>
  );
}

function ReviewStep({
  format,
  dailyBudget,
  cpc,
  duration,
  keywords,
  selectedProductCount,
  estimating,
  estimated,
}: {
  format: CampaignFormat;
  dailyBudget: number;
  cpc: number;
  duration: number;
  keywords: string[];
  selectedProductCount: number;
  estimating: boolean;
  estimated: boolean;
}) {
  const dailyClicks = Math.round(dailyBudget / cpc);
  const dailyImpressionsLow = dailyClicks * 28;
  const dailyImpressionsHigh = dailyClicks * 45;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-medium mb-1 text-charcoal">Podsumowanie i uruchomienie</h2>
        <p className="text-sm text-warm-gray">Prognozy bazują na danych z ostatnich 90 dni w Twojej kategorii.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-3">
        <SummaryRow label="Format" value={formatLabels[format]} />
        <SummaryRow label="Budżet dzienny" value={`${dailyBudget} PLN`} />
        <SummaryRow label="Produkty" value={`${selectedProductCount}`} />
        <SummaryRow label="Czas trwania" value={`${duration} ${duration === 1 ? "dzień" : "dni"}`} />
        {format !== "category_banner" && <SummaryRow label="Maks. CPC" value={`${cpc.toFixed(2)} PLN`} />}
        {format !== "category_banner" && <SummaryRow label="Słowa kluczowe" value={`${keywords.length} aktywnych`} />}
        <SummaryRow label="Maks. koszt całkowity" value={`${(dailyBudget * duration).toLocaleString("pl-PL")} PLN`} />
      </div>

      <div className="p-5 rounded-xl border border-black/10 bg-cream-light">
        <p className="text-[11px] uppercase tracking-[1px] text-warm-gray mb-3">Prognoza zasięgu</p>

        {estimating && (
          <div className="flex items-center gap-2 text-sm text-warm-gray py-6">
            <span className="inline-block w-4 h-4 border-2 border-charcoal/30 border-t-charcoal rounded-full animate-spin" />
            Analizuję dane z ostatnich 90 dni…
          </div>
        )}

        {!estimating && estimated && (
          <div className="grid md:grid-cols-3 gap-4">
            <Forecast
              label="Dzienne wyświetlenia"
              value={`${dailyImpressionsLow.toLocaleString("pl-PL")}–${dailyImpressionsHigh.toLocaleString("pl-PL")}`}
            />
            <Forecast
              label="Dzienne kliknięcia"
              value={`${Math.round(dailyClicks * 0.8)}–${Math.round(dailyClicks * 1.2)}`}
            />
            <Forecast
              label="Prognozowany zwrot z inwestycji"
              value={`${(2.4 + cpc * 0.3).toFixed(1)}–${(3.6 + cpc * 0.4).toFixed(1)}×`}
              tooltip={`Stosunek przewidywanej sprzedaży do kosztu kampanii. Np. 3,0× = z każdej 1 PLN reklamy oczekuj ok. 3 PLN sprzedaży. (W branży: ROAS)`}
            />
          </div>
        )}

        {!estimating && !estimated && (
          <p className="text-sm text-warm-gray">Przejdź dalej z konfiguracji, aby zobaczyć prognozę.</p>
        )}

        <p className="text-[11px] text-warm-gray mt-4 leading-relaxed">
          To są <strong>rzeczywiste zakresy</strong> z porównywalnych kampanii w Twojej kategorii — nie obietnice.
          Twoje wyniki zależą od jakości oferty, zdjęć i konkurencyjności ceny.
        </p>
      </div>

      <WalletHint dailyBudget={dailyBudget} duration={duration} />
    </div>
  );
}

function WalletHint({ dailyBudget, duration }: { dailyBudget: number; duration: number }) {
  const wallet = useWalletForCurrentSeller();
  const balance = wallet?.balance ?? 0;
  const runwayDays = calculateBalanceRunway(balance, dailyBudget);
  const campaignTotal = dailyBudget * duration;
  const insufficient = balance < dailyBudget;
  const needsTopup = balance < campaignTotal;

  return (
    <div
      className={cn(
        "p-4 rounded-xl border flex items-start gap-3",
        insufficient
          ? "border-amber-300 bg-amber-50/60"
          : needsTopup
          ? "border-amber-200 bg-amber-50/30"
          : "border-emerald-200 bg-emerald-50/40",
      )}
    >
      <span
        className={cn(
          "w-7 h-7 rounded-full flex items-center justify-center text-xs shrink-0 mt-0.5",
          insufficient || needsTopup ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700",
        )}
      >
        {insufficient ? "⚠" : needsTopup ? "ⓘ" : "✓"}
      </span>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-charcoal">
          Twoje saldo: <span className="tabular-nums">{fmtPLNAmount(balance)}</span>
        </p>
        <p className="text-xs text-warm-gray mt-1 leading-relaxed">
          {insufficient ? (
            <>
              Saldo jest <strong>za niskie</strong>, by uruchomić kampanię z budżetem {dailyBudget} PLN/dzień.
              Doładuj minimum {fmtPLNAmount(dailyBudget - balance)} przed startem.
            </>
          ) : needsTopup ? (
            <>
              Wystarczy na <strong>~{runwayDays} {runwayDays === 1 ? "dzień" : "dni"}</strong> z {duration} planowanych.
              Doładuj saldo, żeby kampania nie wstrzymała się przed czasem (brakuje ~{fmtPLNAmount(campaignTotal - balance)}).
            </>
          ) : (
            <>
              Wystarczy na całą kampanię ({duration} {duration === 1 ? "dzień" : "dni"} × {dailyBudget} PLN).
              Po uruchomieniu otrzymasz fakturę za doładowanie, wysłaną automatycznie do KSeF.
            </>
          )}
        </p>
        {(insufficient || needsTopup) && (
          <Link
            href="/seller/promotions/wallet"
            className="inline-flex items-center gap-1 text-[11px] uppercase tracking-[0.5px] text-amber-700 hover:text-amber-800 underline mt-2"
          >
            Doładuj saldo →
          </Link>
        )}
      </div>
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between p-3 rounded-md border border-black/10 bg-white">
      <span className="text-xs text-warm-gray uppercase tracking-wide">{label}</span>
      <span className="text-sm font-medium text-charcoal">{value}</span>
    </div>
  );
}

function Forecast({ label, value, tooltip }: { label: string; value: string; tooltip?: string }) {
  return (
    <div title={tooltip}>
      <p className="text-[11px] uppercase tracking-wide text-warm-gray mb-1 flex items-center gap-1">
        {label}
        {tooltip && (
          <span aria-hidden className="inline-flex items-center justify-center w-3 h-3 rounded-full bg-black/10 text-[8px] text-warm-gray cursor-help leading-none">
            i
          </span>
        )}
      </p>
      <p className="text-lg font-semibold text-charcoal">{value}</p>
    </div>
  );
}

function Section({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h3 className="text-sm font-semibold mb-1 text-charcoal">{title}</h3>
      {subtitle && <p className="text-xs text-warm-gray mb-3">{subtitle}</p>}
      {children}
    </div>
  );
}

function SliderField({
  label,
  value,
  min,
  max,
  step,
  unit,
  decimals = 0,
  onChange,
  hint,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit: string;
  decimals?: number;
  onChange: (v: number) => void;
  hint?: string;
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between mb-2">
        <label className="text-xs uppercase tracking-wide text-warm-gray">{label}</label>
        <span className="text-base font-semibold text-charcoal">
          {value.toFixed(decimals).replace(".", ",")} {unit}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full accent-charcoal"
      />
      <div className="flex justify-between text-[10px] text-warm-gray mt-1">
        <span>{min} {unit}</span>
        <span>{max} {unit}</span>
      </div>
      {hint && <p className="text-[11px] text-warm-gray mt-2">{hint}</p>}
    </div>
  );
}

function generateCampaignName(format: CampaignFormat, productIds: string[], allProducts: Product[]): string {
  const firstProduct = allProducts.find((p) => p.id === productIds[0]);
  const baseName = firstProduct?.name ?? "Kampania";
  const suffix =
    format === "top_search" ? "Top wyszukiwań" :
    format === "category_banner" ? "Baner kategorii" :
    "Podobne produkty";
  const more = productIds.length > 1 ? ` +${productIds.length - 1}` : "";
  return `${baseName}${more} — ${suffix}`;
}
