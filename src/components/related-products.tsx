"use client";

import { useMemo, useRef } from "react";
import type { Product } from "@/types";
import { ProductCard } from "@/components/product-card";
import { ChevronLeftIcon, ChevronRightIcon } from "@/components/icons";
import { useMarketplace } from "@/store/marketplace-store";

interface RelatedProductsProps {
  /** Organic recommendations to show. */
  products: Product[];
  /** ID of the current product on the detail page (so its own boost campaign isn't injected here). */
  currentProductId?: string;
  /** Optional pool of all products — required if you want similar_products boost injection. */
  allProducts?: Product[];
}

export function RelatedProducts({ products, currentProductId, allProducts }: RelatedProductsProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { campaigns } = useMarketplace();

  // Inject similar_products boost from any active campaign except the current product's own.
  const merged = useMemo(() => {
    if (!allProducts) return products;
    const boostIds = new Set<string>();
    for (const c of campaigns) {
      if (c.status !== "active") continue;
      if (c.format !== "similar_products") continue;
      for (const pid of c.productIds) {
        if (pid !== currentProductId) boostIds.add(pid);
      }
    }
    if (boostIds.size === 0) return products;
    const boostProducts = [...boostIds]
      .map((id) => allProducts.find((p) => p.id === id))
      .filter((p): p is Product => !!p);
    const seen = new Set(boostProducts.map((p) => p.id));
    const organic = products.filter((p) => !seen.has(p.id));
    return [...boostProducts, ...organic].slice(0, 8);
  }, [products, allProducts, currentProductId, campaigns]);

  function scroll(direction: "left" | "right") {
    if (!scrollRef.current) return;
    const amount = 300;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });
  }

  if (merged.length === 0) return null;

  return (
    <section className="py-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-medium text-charcoal">Może Cię też zainteresować</h2>
        <div className="flex gap-2">
          <button
            onClick={() => scroll("left")}
            className="w-9 h-9 flex items-center justify-center border border-border rounded-full hover:border-charcoal transition-colors"
            aria-label="Previous"
          >
            <ChevronLeftIcon className="h-4 w-4" />
          </button>
          <button
            onClick={() => scroll("right")}
            className="w-9 h-9 flex items-center justify-center border border-border rounded-full hover:border-charcoal transition-colors"
            aria-label="Next"
          >
            <ChevronRightIcon className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto scrollbar-hide -mx-4 px-4 snap-x snap-mandatory"
      >
        {merged.map((product) => (
          <div
            key={product.id}
            className="flex-shrink-0 w-[220px] md:w-[260px] snap-start"
          >
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </section>
  );
}
