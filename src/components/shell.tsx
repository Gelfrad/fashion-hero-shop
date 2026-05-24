"use client";

import { AnnouncementBar } from "./announcement-bar";
import { Header } from "./header";
import { Footer } from "./footer";
import { CartProvider, useCart } from "./cart-provider";
import { WishlistProvider, useWishlist } from "./wishlist-provider";
import { QuickViewProvider } from "./quick-view-provider";
import { AuthProvider } from "./auth-provider";
import { MarketplaceProvider } from "@/store/marketplace-store";

function ShellInner({ children }: { children: React.ReactNode }) {
  const { openCart, itemCount } = useCart();
  const { wishlistItems } = useWishlist();

  return (
    <>
      <AnnouncementBar />
      <Header onCartOpen={openCart} cartCount={itemCount} wishlistCount={wishlistItems.length} />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}

export function Shell({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <MarketplaceProvider>
        <CartProvider>
          <WishlistProvider>
            <QuickViewProvider>
              <ShellInner>{children}</ShellInner>
            </QuickViewProvider>
          </WishlistProvider>
        </CartProvider>
      </MarketplaceProvider>
    </AuthProvider>
  );
}
