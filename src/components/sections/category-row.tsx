import Link from "next/link";
import Image from "next/image";

const categories = [
  {
    title: "Nowości",
    slug: "new-arrivals",
    gradient: "linear-gradient(145deg, #a8c0a0 0%, #6b8a5e 40%, #4a6b3d 100%)",
    image: "/images/hero/collection-hero-1.jpg",
    links: [{ label: "ZOBACZ", href: "/collections/new-arrivals" }],
  },
  {
    title: "Męska",
    slug: "mens",
    gradient: "linear-gradient(145deg, #4a5568 0%, #2d3748 50%, #1a202c 100%)",
    image: "/images/hero/collection-hero-2.jpg",
    links: [{ label: "ODKRYJ", href: "/collections/mens" }],
  },
  {
    title: "Damska",
    slug: "womens",
    gradient: "linear-gradient(145deg, #d4a5a5 0%, #c08080 50%, #9a5e5e 100%)",
    image: "/images/hero/collection-hero-1.jpg",
    links: [{ label: "ODKRYJ", href: "/collections/womens" }],
  },
  {
    title: "Bestsellery",
    slug: "best-sellers",
    gradient: "linear-gradient(145deg, #c4b59a 0%, #a89279 50%, #8a7d6b 100%)",
    image: "/images/hero/collection-hero-2.jpg",
    links: [{ label: "ZOBACZ", href: "/collections/best-sellers" }],
  },
];

export function CategoryRow() {
  return (
    <section className="px-4 md:px-8 lg:px-12 py-10">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {categories.map((cat) => (
          <div
            key={cat.slug}
            className="relative flex flex-col items-center justify-end overflow-hidden group"
            style={{
              background: cat.gradient,
              aspectRatio: "3 / 4",
            }}
          >
            {/* Background image */}
            <Image
              src={cat.image}
              alt={cat.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />

            {/* Decorative overlay */}
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors duration-300" />

            {/* Content at bottom */}
            <div className="relative z-10 text-center pb-8 px-4">
              <h3 className="text-xl font-normal text-white mb-4 tracking-wide">
                {cat.title}
              </h3>
              <div className="flex gap-3 justify-center">
                {cat.links.map((link) => (
                  <Link
                    key={link.href}
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
