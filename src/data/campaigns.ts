import type { Campaign, CampaignFormat } from "@/types";

export const campaigns: Campaign[] = [
  {
    id: "c1",
    sellerId: "s2",
    name: "Sweter & Dzianiny — Top Search",
    format: "top_search",
    status: "active",
    productIds: ["30", "50"],
    keywords: ["sweter", "kardigan", "wełniany sweter", "oversized"],
    dailyBudget: 120,
    totalBudget: 840,
    spentToday: 96,
    maxCpc: 1.18,
    durationDays: 7,
    clicks: 412,
    impressions: 18420,
    attributedSales: 2840,
    roas: 4.2,
    ctr: 2.24,
    cpc: 1.18,
  },
  {
    id: "c2",
    sellerId: "s2",
    name: "Bella Donna — Banner AW (buty)",
    format: "category_banner",
    status: "active",
    productIds: ["48", "112"],
    keywords: [],
    dailyBudget: 85,
    totalBudget: 595,
    spentToday: 85,
    maxCpc: 0,
    durationDays: 7,
    clicks: 287,
    impressions: 42100,
    attributedSales: 1640,
    roas: 3.1,
    ctr: 0.68,
    cpc: 0.65,
    bannerImage: "/images/hero/hero-2.jpg",
    bannerHeadline: "Buty na chłodne dni",
    bannerCta: "Zobacz kolekcję",
    bannerCategory: "womens",
  },
  {
    id: "c3",
    sellerId: "s2",
    name: "Loafer Boost — Similar Products",
    format: "similar_products",
    status: "active",
    productIds: ["111"],
    keywords: ["loafer", "mokasyny", "buty wsuwane"],
    dailyBudget: 60,
    totalBudget: 420,
    spentToday: 38,
    maxCpc: 0.72,
    durationDays: 7,
    clicks: 198,
    impressions: 9840,
    attributedSales: 980,
    roas: 2.6,
    ctr: 2.01,
    cpc: 0.72,
  },
  {
    id: "c4",
    sellerId: "s2",
    name: "Botki — Top Search (wstrzymana)",
    format: "top_search",
    status: "paused",
    productIds: ["110"],
    keywords: ["botki", "skórzane botki"],
    dailyBudget: 200,
    totalBudget: 1400,
    spentToday: 0,
    maxCpc: 1.50,
    durationDays: 7,
    clicks: 0,
    impressions: 0,
    attributedSales: 0,
    roas: 0,
    ctr: 0,
    cpc: 0,
  },
];

export const formatLabels: Record<CampaignFormat, string> = {
  top_search: "Top wyszukiwań",
  category_banner: "Baner kategorii",
  similar_products: "Podobne produkty",
};

export const formatDescriptions: Record<CampaignFormat, string> = {
  top_search: "Płatność za kliknięcie (CPC). Produkt wyświetla się wyżej w wynikach wyszukiwania i listingach kategorii.",
  category_banner: "Opłata stała. Pełnoekranowy baner na górze strony kategorii przez 7 dni.",
  similar_products: "Płatność za kliknięcie (CPC). Twój produkt pojawia się w sekcji 'Podobne produkty' na stronach konkurencji.",
};

export function getCampaign(id: string): Campaign | undefined {
  return campaigns.find((c) => c.id === id);
}

export function getCampaignsBySeller(sellerId: string): Campaign[] {
  return campaigns.filter((c) => c.sellerId === sellerId);
}

export function getActiveCampaignsByFormat(format: CampaignFormat): Campaign[] {
  return campaigns.filter((c) => c.format === format && c.status === "active");
}

export function getPromotedProductIds(): Set<string> {
  const ids = new Set<string>();
  for (const c of campaigns) {
    if (c.status !== "active") continue;
    if (c.format === "top_search" || c.format === "similar_products") {
      for (const pid of c.productIds) ids.add(pid);
    }
  }
  return ids;
}

export function getSimilarProductsBoostIds(currentProductId: string): string[] {
  const ids: string[] = [];
  for (const c of campaigns) {
    if (c.status !== "active") continue;
    if (c.format !== "similar_products") continue;
    for (const pid of c.productIds) {
      if (pid !== currentProductId && !ids.includes(pid)) ids.push(pid);
    }
  }
  return ids;
}

export function getCampaignBidForProduct(productId: string): number {
  let maxBid = 0;
  for (const c of campaigns) {
    if (c.status !== "active") continue;
    if (c.format !== "top_search" && c.format !== "similar_products") continue;
    if (c.productIds.includes(productId)) {
      if (c.maxCpc > maxBid) maxBid = c.maxCpc;
    }
  }
  return maxBid;
}

export function getActiveBannerForCategory(category: string): Campaign | undefined {
  return campaigns.find(
    (c) =>
      c.status === "active" &&
      c.format === "category_banner" &&
      c.bannerCategory === category,
  );
}

export const performanceSeries = Array.from({ length: 30 }, (_, i) => {
  const base = 8 + Math.sin(i / 3) * 3 + i * 0.4;
  const noise = Math.sin(i * 1.7) * 2;
  return {
    day: `${i + 1}`,
    clicks: Math.round(base * 4 + noise * 3),
    sales: Math.round(base * 14 + noise * 10),
  };
});

export const topKeywords = [
  { keyword: "sweter", impressions: 4820, ctr: 2.8, cpc: 1.32, conversion: 3.6 },
  { keyword: "wełniany sweter", impressions: 3140, ctr: 2.4, cpc: 1.18, conversion: 3.1 },
  { keyword: "oversized blazer", impressions: 2110, ctr: 3.1, cpc: 1.45, conversion: 4.2 },
  { keyword: "sukienka kopertowa", impressions: 1890, ctr: 1.9, cpc: 0.96, conversion: 2.4 },
  { keyword: "skórzane botki", impressions: 1620, ctr: 1.6, cpc: 0.84, conversion: 1.9 },
];

export const optimizations = [
  {
    id: "o1",
    title: "Podnieś CPC dla 'sweter' o 0,30 PLN",
    reason: "Twoja średnia pozycja to 6,2 — pierwsze 3 sloty konwertują 2,4× lepiej.",
    severity: "high" as const,
  },
  {
    id: "o2",
    title: "Dodaj 'wełniany sweter' jako słowo kluczowe",
    reason: "Wysoki wolumen wyszukiwań w Twojej kategorii, niska konkurencja.",
    severity: "medium" as const,
  },
  {
    id: "o3",
    title: "Wstrzymaj 'skórzane botki'",
    reason: "CTR 1,6% przy słabej konwersji — tracisz budżet.",
    severity: "low" as const,
  },
];

export const keywordSuggestions = [
  "sweter", "wełniany sweter", "sukienka kopertowa", "oversized blazer",
  "krótka kurtka", "jedwabny top", "lniany t-shirt", "loafer dziany",
  "skórzane botki", "joggery", "spodnie szerokie",
];

export const summary = {
  monthlySpend: 4280,
  monthlyClicks: 12480,
  adRevenue: 18920,
  roas: 4.42,
  avgCpc: 1.04,
  monthlySpendDelta: 12,
  monthlyClicksDelta: 8,
  adRevenueDelta: 18,
  roasDelta: 0.3,
  avgCpcDelta: -0.05,
};

export function fmtPLN(n: number): string {
  return new Intl.NumberFormat("pl-PL", { maximumFractionDigits: 0 }).format(n) + " PLN";
}

export function fmtNumber(n: number): string {
  return new Intl.NumberFormat("pl-PL").format(n);
}
