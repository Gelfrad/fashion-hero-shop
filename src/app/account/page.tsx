"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/components/auth-provider";

const mockOrders = [
  { id: "SF-10042", date: "15 marca 2026", status: "Dostarczone", total: 592 },
  { id: "SF-10038", date: "22 lutego 2026", status: "Dostarczone", total: 940 },
  { id: "SF-10031", date: "8 stycznia 2026", status: "Dostarczone", total: 480 },
];

export default function AccountPage() {
  const { user, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/account/login");
    }
  }, [user, router]);

  if (!user) return null;

  return (
    <div className="max-w-2xl mx-auto px-4 py-16">
      {/* Breadcrumb */}
      <nav className="text-[11px] text-warm-gray mb-8 tracking-wide">
        <Link href="/" className="hover:text-charcoal transition-colors">Strona główna</Link>
        <span className="mx-1.5">/</span>
        <span className="text-charcoal">Konto</span>
      </nav>

      <h1 className="text-2xl font-light text-charcoal mb-2">
        Cześć, {user.firstName}
      </h1>
      <p className="text-[13px] text-warm-gray mb-10">
        Witaj ponownie w swoim koncie FashionHero.
      </p>

      {/* Order History */}
      <section className="mb-10">
        <h2 className="text-[12px] font-medium uppercase tracking-[0.8px] text-charcoal mb-4 pb-2 border-b border-black/10">
          Historia zamówień
        </h2>
        <div className="space-y-3">
          {mockOrders.map((order) => (
            <div key={order.id} className="flex items-center justify-between py-3 border-b border-black/5">
              <div>
                <p className="text-[13px] font-medium text-charcoal">{order.id}</p>
                <p className="text-[12px] text-warm-gray">{order.date}</p>
              </div>
              <div className="text-right">
                <p className="text-[13px] font-medium text-charcoal">{order.total.toFixed(0)} zł</p>
                <p className="text-[11px] text-green-700 font-medium">{order.status}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Account Details */}
      <section className="mb-10">
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-black/10">
          <h2 className="text-[12px] font-medium uppercase tracking-[0.8px] text-charcoal">
            Dane konta
          </h2>
          <button className="text-[11px] text-warm-gray underline hover:text-charcoal transition-colors">
            Edytuj
          </button>
        </div>
        <div className="space-y-1.5 text-[13px] text-charcoal/80">
          <p>{user.firstName} {user.lastName}</p>
          <p>{user.email}</p>
        </div>
      </section>

      {/* Saved Addresses */}
      <section className="mb-10">
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-black/10">
          <h2 className="text-[12px] font-medium uppercase tracking-[0.8px] text-charcoal">
            Zapisane adresy
          </h2>
          <button className="text-[11px] text-warm-gray underline hover:text-charcoal transition-colors">
            Dodaj adres
          </button>
        </div>
        <div className="text-[13px] text-charcoal/80 space-y-0.5">
          <p className="font-medium text-charcoal">{user.firstName} {user.lastName}</p>
          <p>ul. Modna 12/4</p>
          <p>00-001 Warszawa</p>
          <p>Polska</p>
        </div>
      </section>

      <button
        onClick={() => {
          logout();
          router.push("/");
        }}
        className="btn-cta-outline text-[12px] w-full"
      >
        WYLOGUJ SIĘ
      </button>
    </div>
  );
}
