import Link from "next/link";
import Image from "next/image";

const spotlights = [
  {
    gradient: "linear-gradient(160deg, #8a7d6b 0%, #c4b59a 40%, #e8dfd0 100%)",
    image: "/images/products/product-9.jpg",
    label: "NATURALNIE LEKKIE",
    name: "Cloud Runner",
    tagline: "Najlżejsze buty w naszej ofercie. Z dzianiny z materiałów z recyklingu — wygodne przez cały dzień.",
    href: "/products/cloud-runner",
  },
  {
    gradient: "linear-gradient(160deg, #5c6b4f 0%, #8a9a7a 40%, #c5cfbb 100%)",
    image: "/images/products/product-15.jpg",
    label: "LEKKIE JAK PIÓRKO",
    name: "Breeze Slip-On",
    tagline: "Wsuwasz i ruszasz. Włókno eukaliptusowe utrzymuje chłód — naturalnie.",
    href: "/products/breeze-slip-on",
  },
];

export function FeatureStory() {
  return (
    <section className="px-4 md:px-8 lg:px-12 py-10">
      <h2 className="text-[40px] font-normal text-charcoal text-center mb-10 leading-tight">
        Lekkie, oddychające. Twoje.
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {spotlights.map((item) => (
          <div
            key={item.name}
            className="relative overflow-hidden group"
            style={{
              background: item.gradient,
              minHeight: "520px",
            }}
          >
            {/* Background image */}
            <Image
              src={item.image}
              alt={item.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />

            {/* Dark overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

            {/* Content overlay at bottom */}
            <div className="absolute bottom-0 left-0 right-0 p-8 z-10">
              <p className="text-[11px] font-medium uppercase tracking-[0.8px] text-white/70 mb-2">
                {item.label}
              </p>
              <h3 className="text-2xl font-normal text-white mb-2">{item.name}</h3>
              <p className="text-sm text-white/80 mb-6 max-w-xs leading-relaxed">{item.tagline}</p>
              <Link
                href={item.href}
                className="inline-flex items-center justify-center px-5 py-2 text-[11px] font-medium uppercase tracking-[0.6px] text-white border border-white rounded-full hover:bg-white hover:text-charcoal transition-all duration-200"
              >
                ZOBACZ WIĘCEJ
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
