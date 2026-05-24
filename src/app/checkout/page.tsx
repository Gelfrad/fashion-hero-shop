"use client";

import Link from "next/link";
import { useCart } from "@/components/cart-provider";

export default function CheckoutPage() {
  const { items } = useCart();

  const subtotal = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const shipping = subtotal >= 299 ? 0 : 19.9;
  const total = subtotal + shipping;

  return (
    <main className="max-w-6xl mx-auto px-4 md:px-8 py-8 md:py-12">
      {/* Breadcrumb */}
      <nav className="mb-8">
        <ol className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-[0.6px] text-warm-gray">
          <li>
            <Link href="/" className="hover:text-charcoal transition-colors">
              Strona główna
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li className="text-charcoal">Kasa</li>
        </ol>
      </nav>

      <h1 className="text-[32px] font-normal text-charcoal mb-8">Kasa</h1>

      {items.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-sm text-warm-gray mb-6">Twój koszyk jest pusty.</p>
          <Link href="/" className="btn-cta">
            KONTYNUUJ ZAKUPY
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-10 lg:gap-16">
          {/* Left: Form */}
          <div>
            {/* Shipping Information */}
            <section className="mb-10">
              <h2 className="text-[12px] font-medium uppercase tracking-[0.8px] text-charcoal mb-5 pb-2 border-b border-border">
                DANE DO WYSYŁKI
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-warm-gray mb-1.5">Imię</label>
                  <input
                    type="text"
                    className="w-full border border-border px-3 py-2.5 text-sm bg-white focus:outline-none focus:border-charcoal transition-colors"
                    placeholder="Imię"
                  />
                </div>
                <div>
                  <label className="block text-xs text-warm-gray mb-1.5">Nazwisko</label>
                  <input
                    type="text"
                    className="w-full border border-border px-3 py-2.5 text-sm bg-white focus:outline-none focus:border-charcoal transition-colors"
                    placeholder="Nazwisko"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs text-warm-gray mb-1.5">E-mail</label>
                  <input
                    type="email"
                    className="w-full border border-border px-3 py-2.5 text-sm bg-white focus:outline-none focus:border-charcoal transition-colors"
                    placeholder="ty@przyklad.pl"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs text-warm-gray mb-1.5">Adres</label>
                  <input
                    type="text"
                    className="w-full border border-border px-3 py-2.5 text-sm bg-white focus:outline-none focus:border-charcoal transition-colors"
                    placeholder="Ulica i numer"
                  />
                </div>
                <div>
                  <label className="block text-xs text-warm-gray mb-1.5">Miasto</label>
                  <input
                    type="text"
                    className="w-full border border-border px-3 py-2.5 text-sm bg-white focus:outline-none focus:border-charcoal transition-colors"
                    placeholder="Miasto"
                  />
                </div>
                <div>
                  <label className="block text-xs text-warm-gray mb-1.5">Województwo</label>
                  <input
                    type="text"
                    className="w-full border border-border px-3 py-2.5 text-sm bg-white focus:outline-none focus:border-charcoal transition-colors"
                    placeholder="Województwo"
                  />
                </div>
                <div>
                  <label className="block text-xs text-warm-gray mb-1.5">Kod pocztowy</label>
                  <input
                    type="text"
                    className="w-full border border-border px-3 py-2.5 text-sm bg-white focus:outline-none focus:border-charcoal transition-colors"
                    placeholder="00-000"
                  />
                </div>
                <div>
                  <label className="block text-xs text-warm-gray mb-1.5">Kraj</label>
                  <input
                    type="text"
                    className="w-full border border-border px-3 py-2.5 text-sm bg-white focus:outline-none focus:border-charcoal transition-colors"
                    defaultValue="Polska"
                    readOnly
                  />
                </div>
              </div>
            </section>

            {/* Payment */}
            <section className="mb-10">
              <h2 className="text-[12px] font-medium uppercase tracking-[0.8px] text-charcoal mb-5 pb-2 border-b border-border">
                PŁATNOŚĆ
              </h2>
              <div className="bg-cream-light px-6 py-8 text-center">
                <p className="text-sm text-warm-gray mb-1">Integracja płatności wkrótce.</p>
                <p className="text-xs text-warm-gray/60">To jest demonstracyjna strona kasy.</p>
              </div>
            </section>

            {/* Place Order */}
            <button className="btn-cta w-full sm:w-auto sm:min-w-[280px]">
              ZŁÓŻ ZAMÓWIENIE
            </button>
          </div>

          {/* Right: Order Summary */}
          <div>
            <div className="bg-cream-light p-6 sticky top-20">
              <h2 className="text-[12px] font-medium uppercase tracking-[0.8px] text-charcoal mb-5 pb-2 border-b border-cream-dark">
                PODSUMOWANIE ZAMÓWIENIA
              </h2>

              <div className="space-y-4 mb-6">
                {items.map((item, index) => (
                  <div key={index} className="flex gap-3">
                    {/* Thumbnail */}
                    <div
                      className="w-16 h-16 rounded flex-shrink-0"
                      style={{
                        background: `radial-gradient(ellipse at 50% 55%, ${item.color.hex}44 0%, ${item.color.hex}22 35%, #ece9e2 65%)`,
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xs font-medium uppercase tracking-wide truncate">
                        {item.product.name}
                      </h3>
                      <p className="text-xs text-warm-gray">
                        {item.color.name} / Rozmiar {item.size}
                      </p>
                      <p className="text-xs text-warm-gray">Ilość: {item.quantity}</p>
                    </div>
                    <span className="text-sm font-medium text-charcoal">
                      {(item.product.price * item.quantity).toFixed(0)} zł
                    </span>
                  </div>
                ))}
              </div>

              <div className="space-y-2 pt-4 border-t border-cream-dark">
                <div className="flex justify-between text-sm">
                  <span className="text-warm-gray">Suma częściowa</span>
                  <span className="font-medium">{subtotal.toFixed(0)} zł</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-warm-gray">Dostawa</span>
                  <span className="font-medium">
                    {shipping === 0 ? "Darmowa" : `${shipping.toFixed(2)} zł`}
                  </span>
                </div>
                <div className="flex justify-between text-sm pt-3 border-t border-cream-dark mt-3">
                  <span className="font-medium text-charcoal">Łącznie</span>
                  <span className="font-medium text-charcoal text-lg">{total.toFixed(2)} zł</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
