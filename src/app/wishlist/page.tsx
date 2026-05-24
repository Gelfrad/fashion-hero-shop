"use client";

import Link from "next/link";
import { useWishlist } from "@/components/wishlist-provider";
import { ProductCard } from "@/components/product-card";
import { products } from "@/data/products";

export default function WishlistPage() {
  const { wishlistItems } = useWishlist();

  const wishlistedProducts = products.filter((p) =>
    wishlistItems.includes(p.id)
  );

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-12">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-[11px] text-warm-gray mb-6">
        <Link href="/" className="hover:text-charcoal transition-colors">
          Strona główna
        </Link>
        <span>/</span>
        <span className="uppercase tracking-[0.5px] text-charcoal">Lista życzeń</span>
      </div>

      <h1 className="text-3xl font-light text-charcoal mb-2">Lista życzeń</h1>
      <p className="text-sm text-warm-gray mb-10">
        {wishlistedProducts.length === 0
          ? "Nie zapisano jeszcze żadnych produktów."
          : `${wishlistedProducts.length} ${wishlistedProducts.length === 1 ? "zapisany produkt" : "zapisanych produktów"}`}
      </p>

      {wishlistedProducts.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-warm-gray mb-6">
            Kliknij ikonę serca przy dowolnym produkcie, aby zapisać go tutaj.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/collections/mens" className="btn-cta">
              KUP DLA NIEGO
            </Link>
            <Link href="/collections/womens" className="btn-cta-outline">
              KUP DLA NIEJ
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {wishlistedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
