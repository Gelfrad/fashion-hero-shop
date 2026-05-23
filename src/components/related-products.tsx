"use client";

import { useRef } from "react";
import type { Product } from "@/types";
import { ProductCard } from "@/components/product-card";
import { ChevronLeftIcon, ChevronRightIcon } from "@/components/icons";

interface RelatedProductsProps {
  products: Product[];
}

export function RelatedProducts({ products }: RelatedProductsProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  function scroll(direction: "left" | "right") {
    if (!scrollRef.current) return;
    const amount = 300;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });
  }

  if (products.length === 0) return null;

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
        {products.map((product) => (
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
