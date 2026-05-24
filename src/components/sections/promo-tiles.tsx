import Link from "next/link";
import Image from "next/image";

const promos = [
  {
    title: "Kolekcja w teren",
    gradient: "linear-gradient(170deg, #3d5a3d 0%, #5c7a5c 40%, #8a9a7a 100%)",
    image: "/images/products/product-3.jpg",
    links: [
      { label: "MĘSKA", href: "/collections/mens" },
      { label: "DAMSKA", href: "/collections/womens" },
    ],
  },
  {
    title: "Codzienne podstawy",
    gradient: "linear-gradient(170deg, #6b5b4a 0%, #a89279 40%, #c4b59a 100%)",
    image: "/images/products/product-4.jpg",
    links: [
      { label: "MĘSKA", href: "/collections/mens" },
      { label: "DAMSKA", href: "/collections/womens" },
    ],
  },
  {
    title: "Wyprzedaż",
    gradient: "linear-gradient(170deg, #9e4040 0%, #c06060 40%, #d48a8a 100%)",
    image: "/images/products/product-7.jpg",
    links: [
      { label: "MĘSKA", href: "/collections/sale" },
      { label: "DAMSKA", href: "/collections/sale" },
    ],
  },
];

export function PromoTiles() {
  return (
    <section className="px-4 md:px-8 lg:px-12 py-10">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {promos.map((promo) => (
          <div
            key={promo.title}
            className="relative overflow-hidden group"
            style={{
              background: promo.gradient,
              aspectRatio: "3 / 4",
            }}
          >
            {/* Background image */}
            <Image
              src={promo.image}
              alt={promo.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors duration-300" />

            {/* Content at bottom */}
            <div className="absolute bottom-0 left-0 right-0 p-6 z-10 text-center">
              <h3 className="text-xl font-normal text-white mb-4 tracking-wide">
                {promo.title}
              </h3>
              <div className="flex gap-3 justify-center">
                {promo.links.map((link, i) => (
                  <Link
                    key={i}
                    href={link.href}
                    className="inline-flex items-center justify-center px-5 py-2 text-[11px] font-medium uppercase tracking-[0.6px] text-white border border-white rounded-full hover:bg-white hover:text-charcoal transition-all duration-200"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
