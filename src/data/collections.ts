import type { Collection } from "@/types";

export const collections: Collection[] = [
  {
    id: "mens",
    name: "Moda męska",
    slug: "mens",
    description:
      "Odkryj buty, ubrania i akcesoria od setek sprzedawców.",
    heroImage: "/images/hero/collection-hero-1.jpg",
  },
  {
    id: "womens",
    name: "Moda damska",
    slug: "womens",
    description:
      "Odkryj buty, ubrania i akcesoria od najlepszych sprzedawców i niezależnych projektantów.",
    heroImage: "/images/hero/collection-hero-2.jpg",
  },
  {
    id: "new-arrivals",
    name: "Nowości",
    slug: "new-arrivals",
    description: "Świeże dropy od sprzedawców z całej platformy. Bądź pierwszy, który je odkryje.",
    heroImage: "/images/hero/collection-hero-1.jpg",
  },
  {
    id: "best-sellers",
    name: "Bestsellery",
    slug: "best-sellers",
    description:
      "Najpopularniejsze produkty na FashionHero. Pokochane przez tysiące kupujących.",
    heroImage: "/images/hero/collection-hero-2.jpg",
  },
  {
    id: "sale",
    name: "Wyprzedaż",
    slug: "sale",
    description: "Przecenione produkty od sprzedawców z całej platformy. Świetne okazje, ograniczony czas.",
    heroImage: "/images/hero/collection-hero-1.jpg",
  },
  {
    id: "socks",
    name: "Skarpety",
    slug: "socks",
    description: "Skarpety od niezależnych twórców i znanych marek. Każdy styl, każdy przedział cenowy.",
    heroImage: "/images/hero/collection-hero-1.jpg",
  },
  {
    id: "apparel",
    name: "Odzież",
    slug: "apparel",
    description: "Odzież od setek sprzedawców. Streetwear, basics, moda ekologiczna i nie tylko.",
    heroImage: "/images/hero/collection-hero-2.jpg",
  },
  {
    id: "accessories",
    name: "Akcesoria",
    slug: "accessories",
    description: "Torby, czapki, biżuteria i więcej — od sprzedawców, których nie znajdziesz nigdzie indziej.",
    heroImage: "/images/hero/collection-hero-1.jpg",
  },
  {
    id: "all",
    name: "Wszystkie produkty",
    slug: "all",
    description: "Przeglądaj wszystko na FashionHero — buty, odzież i akcesoria od tysięcy sprzedawców.",
    heroImage: "/images/hero/collection-hero-2.jpg",
  },
];

export function getCollection(slug: string): Collection | undefined {
  return collections.find((c) => c.slug === slug);
}
