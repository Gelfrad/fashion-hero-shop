"use client";

import { useMemo, use } from "react";
import Link from "next/link";
import { products } from "@/data/products";
import { ProductCard } from "@/components/product-card";
import { usePromotedProductIds } from "@/store/marketplace-store";

interface PageProps {
  searchParams: Promise<{ q?: string }>;
}

const PROMOTED_CAP = 0.3;

export default function SearchPage({ searchParams }: PageProps) {
  const { q } = use(searchParams);
  const { ids: promotedIds, bidByProduct } = usePromotedProductIds();

  const query = (q ?? "").trim();
  const lowerQ = query.toLowerCase();

  const results = useMemo(() => {
    if (!lowerQ) return [];
    const matches = products.filter((p) =>
      p.name.toLowerCase().includes(lowerQ)
      || p.type.toLowerCase().includes(lowerQ)
      || p.tags.some((t) => t.toLowerCase().includes(lowerQ))
      || p.description.toLowerCase().includes(lowerQ),
    );

    const promoted = matches
      .filter((p) => promotedIds.has(p.id))
      .sort((a, b) => (bidByProduct.get(b.id) ?? 0) - (bidByProduct.get(a.id) ?? 0));
    const organic = matches.filter((p) => !promotedIds.has(p.id));
    const maxSlots = Math.max(1, Math.floor(matches.length * PROMOTED_CAP));
    const promotedTop = promoted.slice(0, maxSlots);
    const promotedRest = promoted.slice(maxSlots);
    return [...promotedTop, ...organic, ...promotedRest];
  }, [lowerQ, promotedIds, bidByProduct]);

  const promotedShownCount = useMemo(() => {
    if (results.length === 0) return 0;
    const maxSlots = Math.max(1, Math.floor(results.length * PROMOTED_CAP));
    const promotedInList = results.filter((p) => promotedIds.has(p.id)).length;
    return Math.min(maxSlots, promotedInList);
  }, [results, promotedIds]);

  return (
    <div className="mx-auto max-w-7xl px-4 lg:px-8 py-8 md:py-12">
      <Link href="/" className="inline-flex items-center gap-1 text-xs text-warm-gray hover:text-charcoal mb-6 transition-colors">
        ← Strona główna
      </Link>

      <div className="mb-8">
        <p className="text-[11px] uppercase tracking-[1px] text-warm-gray mb-2">Wyniki wyszukiwania</p>
        <h1 className="text-3xl md:text-4xl font-light tracking-tight text-charcoal">
          {query ? <>„{query}"</> : "Wpisz frazę"}
        </h1>
        <p className="text-sm text-warm-gray mt-3">
          {query ? (
            <>
              Znaleziono <strong className="text-charcoal">{results.length}</strong>{" "}
              {results.length === 1 ? "produkt" : results.length < 5 ? "produkty" : "produktów"}
            </>
          ) : (
            "Otwórz wyszukiwarkę z górnego paska, aby zacząć."
          )}
        </p>
      </div>

      {/* Transparency strip */}
      {promotedShownCount > 0 && (
        <div className="mb-6 px-4 py-2.5 rounded-md bg-cream-light/60 border border-black/5 flex items-center gap-2 text-xs text-warm-gray">
          <span className="text-warm-gray">ⓘ</span>
          <span>
            {promotedShownCount} z {results.length} {results.length === 1 ? "wyniku jest sponsorowany" : "wyników jest sponsorowanych"}.
            Sprzedawcy płacą za promocję tych ofert. Limit: 30% wyników na stronie.
          </span>
        </div>
      )}

      {/* Grid */}
      {results.length === 0 && query && (
        <div className="text-center py-16 border border-dashed border-black/15 rounded-xl bg-white">
          <p className="text-sm text-warm-gray mb-2">Brak wyników dla &ldquo;{query}&rdquo;</p>
          <p className="text-xs text-warm-gray">Spróbuj innej frazy lub przejrzyj kolekcje.</p>
          <div className="mt-4 flex justify-center gap-2 flex-wrap">
            <Link href="/collections/womens" className="text-[11px] uppercase tracking-wide px-3 py-1.5 rounded-full border border-black/15 hover:bg-cream-light">
              Damska
            </Link>
            <Link href="/collections/mens" className="text-[11px] uppercase tracking-wide px-3 py-1.5 rounded-full border border-black/15 hover:bg-cream-light">
              Męska
            </Link>
            <Link href="/collections/new-arrivals" className="text-[11px] uppercase tracking-wide px-3 py-1.5 rounded-full border border-black/15 hover:bg-cream-light">
              Nowości
            </Link>
          </div>
        </div>
      )}

      {results.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {results.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
