import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Promocje — Panel sprzedawcy · FashionHero",
  description: "Zarządzaj promowanymi ofertami.",
};

export default function SellerPromotionsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
