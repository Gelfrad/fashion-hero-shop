"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { CloseIcon, SearchIcon } from "./icons";
import { products } from "@/data/products";
import { usePromotedProductIds } from "@/store/marketplace-store";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function productGradient(hex: string): string {
  return `radial-gradient(ellipse at 50% 60%, ${hex}33 0%, ${hex}11 40%, #ece9e2 70%)`;
}

function hasRealImage(src: string | undefined): boolean {
  return !!src && src.startsWith("/images/");
}

const PROMOTED_CAP = 0.3;

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const { ids: promotedIds, bidByProduct } = usePromotedProductIds();

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    const matches = products.filter((p) => {
      return (
        p.name.toLowerCase().includes(q) ||
        p.type.toLowerCase().includes(q) ||
        p.tags.some((tag) => tag.toLowerCase().includes(q))
      );
    });

    // Promoted boost with 30% cap (same algorithm as collection-view)
    const promoted = matches
      .filter((p) => promotedIds.has(p.id))
      .sort((a, b) => (bidByProduct.get(b.id) ?? 0) - (bidByProduct.get(a.id) ?? 0));
    const organic = matches.filter((p) => !promotedIds.has(p.id));
    const maxSlots = Math.max(1, Math.floor(matches.length * PROMOTED_CAP));
    const promotedTop = promoted.slice(0, maxSlots);
    const promotedRest = promoted.slice(maxSlots);
    return [...promotedTop, ...organic, ...promotedRest].slice(0, 7);
  }, [query, promotedIds, bidByProduct]);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
      document.body.style.overflow = "hidden";
    } else {
      setQuery("");
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }
  }, [isOpen, onClose]);

  function submitSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    onClose();
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      {/* Drop-down panel */}
      <div className="relative bg-white shadow-lg w-full">
        <div className="max-w-3xl mx-auto px-4 py-6">
          {/* Search input */}
          <form onSubmit={submitSearch} className="flex items-center gap-3 border-b border-black/10 pb-3">
            <SearchIcon className="h-5 w-5 text-warm-gray flex-shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Szukaj produktów, marek, kategorii..."
              className="flex-1 text-base text-charcoal placeholder:text-warm-gray outline-none bg-transparent"
            />
            <button onClick={onClose} type="button" className="p-1 hover:opacity-60 transition-opacity" aria-label="Zamknij wyszukiwarkę">
              <CloseIcon />
            </button>
          </form>

          {/* Results */}
          {query.trim() && (
            <div className="mt-4">
              {results.length === 0 ? (
                <p className="text-sm text-warm-gray py-4">Brak wyników dla &ldquo;{query}&rdquo;</p>
              ) : (
                <>
                  <div className="space-y-2">
                    {results.map((product) => {
                      const color = product.colors[0];
                      const isPromoted = promotedIds.has(product.id);
                      const imgSrc = color?.image;
                      const showImg = hasRealImage(imgSrc);
                      return (
                        <Link
                          key={product.id}
                          href={`/products/${product.slug}`}
                          onClick={onClose}
                          className="flex items-center gap-4 p-2 rounded hover:bg-cream transition-colors"
                        >
                          <div
                            className="w-14 h-14 flex-shrink-0 rounded overflow-hidden flex items-center justify-center"
                            style={{ background: productGradient(color.hex) }}
                          >
                            {showImg ? (
                              <Image
                                src={imgSrc!}
                                alt={`${product.name} - ${color.name}`}
                                width={112}
                                height={112}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="relative w-3/5 h-2/5">
                                <div
                                  className="absolute inset-0 rounded-[50%]"
                                  style={{
                                    background: `${color.hex}66`,
                                    transform: "rotate(-8deg) scaleX(1.4)",
                                  }}
                                />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-[12px] font-medium uppercase tracking-[0.5px] truncate">
                              {product.name}
                            </h4>
                            <p className="text-[12px] text-warm-gray">{color.name}</p>
                            {isPromoted && (
                              <p
                                className="text-[10px] text-warm-gray/80"
                                title="Płatne miejsce. Sprzedawca zapłacił za promocję tej oferty."
                              >
                                Sponsorowane
                              </p>
                            )}
                          </div>
                          <span className="text-[14px] font-medium">{product.price} zł</span>
                        </Link>
                      );
                    })}
                  </div>

                  <Link
                    href={`/search?q=${encodeURIComponent(query.trim())}`}
                    onClick={onClose}
                    className="block mt-3 pt-3 border-t border-black/10 text-[12px] uppercase tracking-[0.5px] text-charcoal hover:underline text-center"
                  >
                    Zobacz wszystkie wyniki →
                  </Link>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
