"use client";

import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { CloseIcon, MinusIcon, PlusIcon } from "./icons";
import type { CartItem } from "@/types";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (index: number, quantity: number) => void;
  onRemove: (index: number) => void;
}

export function CartDrawer({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemove,
}: CartDrawerProps) {
  const subtotal = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const freeShippingThreshold = 299;
  const remaining = Math.max(0, freeShippingThreshold - subtotal);

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 bg-black/40 z-50 transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={cn(
          "fixed top-0 right-0 h-full w-full max-w-md bg-white z-50 flex flex-col transition-transform duration-300",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-4 border-b">
          <h2 className="text-nav">KOSZYK ({items.length})</h2>
          <button onClick={onClose} aria-label="Zamknij koszyk">
            <CloseIcon />
          </button>
        </div>

        {/* Shipping bar */}
        <div className="px-4 py-3 bg-cream-light text-center">
          {remaining > 0 ? (
            <p className="text-xs text-warm-gray">
              Dodaj jeszcze {remaining.toFixed(0)} zł, aby otrzymać darmową dostawę!
            </p>
          ) : (
            <p className="text-xs text-warm-gray">
              Masz darmową dostawę! 🎉
            </p>
          )}
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-4 py-4">
          {items.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-sm text-warm-gray mb-6">
                Twój koszyk jest pusty. Zacznij zakupy!
              </p>
              <div className="grid grid-cols-2 gap-2">
                <a
                  href="/collections/womens"
                  className="inline-flex items-center justify-center px-5 py-3 text-[11px] font-medium uppercase tracking-[0.5px] text-charcoal border border-charcoal rounded-full hover:bg-charcoal hover:text-white transition-all duration-200"
                >
                  Dla kobiet
                </a>
                <a
                  href="/collections/mens"
                  className="inline-flex items-center justify-center px-5 py-3 text-[11px] font-medium uppercase tracking-[0.5px] text-charcoal border border-charcoal rounded-full hover:bg-charcoal hover:text-white transition-all duration-200"
                >
                  Dla mężczyzn
                </a>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item, index) => {
                const thumbSrc = item.color.image;
                const showThumb = thumbSrc.startsWith("/images/");
                return (
                  <div key={index} className="flex gap-3 pb-4 border-b border-cream-dark relative group">
                    {/* Thumbnail */}
                    <div
                      className="w-20 h-20 rounded flex-shrink-0 overflow-hidden"
                      style={{
                        background: `radial-gradient(ellipse at 50% 55%, ${item.color.hex}44 0%, ${item.color.hex}22 35%, #ece9e2 65%)`,
                      }}
                    >
                      {showThumb && (
                        <Image
                          src={thumbSrc}
                          alt={`${item.product.name} - ${item.color.name}`}
                          width={80}
                          height={80}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-xs font-medium uppercase tracking-wide truncate">
                            {item.product.name}
                          </h3>
                          <p className="text-xs text-warm-gray">
                            {item.color.name} / Rozmiar {item.size}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => onRemove(index)}
                          aria-label={`Usuń ${item.product.name} z koszyka`}
                          title="Usuń z koszyka"
                          className="p-1 -m-1 text-warm-gray hover:text-charcoal transition-colors shrink-0"
                        >
                          <CloseIcon className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center border border-cream-dark">
                          <button
                            className="p-1 hover:bg-cream-light"
                            aria-label="Zmniejsz ilość"
                            onClick={() =>
                              item.quantity <= 1
                                ? onRemove(index)
                                : onUpdateQuantity(index, item.quantity - 1)
                            }
                          >
                            <MinusIcon />
                          </button>
                          <span className="px-3 text-xs">{item.quantity}</span>
                          <button
                            className="p-1 hover:bg-cream-light"
                            aria-label="Zwiększ ilość"
                            onClick={() => onUpdateQuantity(index, item.quantity + 1)}
                          >
                            <PlusIcon />
                          </button>
                        </div>
                        <span className="text-sm font-medium">
                          {(item.product.price * item.quantity).toFixed(0)} zł
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="px-4 py-4 border-t">
            <div className="flex justify-between mb-3">
              <span className="text-sm font-medium">Suma częściowa</span>
              <span className="text-sm font-medium">{subtotal.toFixed(0)} zł</span>
            </div>
            <p className="text-xs text-warm-gray mb-3">
              Koszty dostawy i podatki zostaną naliczone w kasie.
            </p>
            <Link
              href="/checkout"
              className="btn-cta w-full block text-center"
              onClick={onClose}
            >
              PRZEJDŹ DO KASY
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
