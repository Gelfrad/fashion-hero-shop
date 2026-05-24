"use client";

import { useMemo } from "react";
import Link from "next/link";
import { products } from "@/data/products";
import { ProductCard } from "@/components/product-card";
import { usePromotedProductIds } from "@/store/marketplace-store";

/**
 * Home-page section showing currently active promoted products.
 * Pulls product IDs from active top_search / similar_products campaigns and
 * renders up to 4 of them. Hidden entirely when no campaigns are active.
 */
export function PromotedProductsSection() {
  const { ids: promotedIds, bidByProduct } = usePromotedProductIds();

  const items = useMemo(() => {
    const matched = products
      .filter((p) => promotedIds.has(p.id))
      .sort((a, b) => (bidByProduct.get(b.id) ?? 0) - (bidByProduct.get(a.id) ?? 0));
    return matched.slice(0, 4);
  }, [promotedIds, bidByProduct]);

  if (items.length === 0) return null;

  return (
    <section className="bg-cream-light/40 py-12 md:py-16 border-y border-black/5">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="mb-6 md:mb-8">
          <p className="text-[11px] uppercase tracking-[1px] text-warm-gray mb-2">
            Polecane przez sprzedawców · Sponsorowane
          </p>
          <h2 className="text-2xl md:text-3xl font-light tracking-tight text-charcoal">
            Wyróżnione oferty
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {items.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>

        <div className="mt-6 text-center">
          <Link
            href="/collections/all"
            className="inline-flex items-center gap-1 text-xs text-warm-gray hover:text-charcoal transition-colors uppercase tracking-[0.5px]"
          >
            Zobacz wszystkie produkty →
          </Link>
        </div>
      </div>
    </section>
  );
}
