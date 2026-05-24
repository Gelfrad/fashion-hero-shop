import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "O nas - FashionHero",
  description: "Polski marketplace modowy łączący sprzedawców i kupujących.",
};

const values = [
  {
    title: "Wspieramy sprzedawców",
    description:
      "Dajemy niezależnym sprzedawcom i znanym markom narzędzia, dzięki którym docierają do milionów osób zakochanych w modzie. Każdy sprzedawca jest dla nas ważny - od jednoosobowych pracowni po globalne marki.",
  },
  {
    title: "Wyselekcjonowane odkrycia",
    description:
      "Nasz marketplace łączy różnorodne style i przedziały cenowe. Pomagamy kupującym odkryć sprzedawców, na których nigdy by nie trafili samodzielnie - a sprzedawcom dotrzeć do ich odbiorców.",
  },
  {
    title: "Sprawiedliwie dla wszystkich",
    description:
      "Przejrzyste opłaty, brak ukrytych kosztów, równe szanse w widoczności. Wierzymy, że marketplace działa najlepiej, gdy każdy sprzedawca ma uczciwą szansę dotarcia do klientów.",
  },
];

const timeline = [
  { year: "2020", event: "Założeni z wizją: marketplace modowy, w którym każdy sprzedawca dostaje uczciwą szansę." },
  { year: "2021", event: "Pierwszych 200 sprzedawców na pokładzie. Start z obuwiem, odzieżą i akcesoriami." },
  { year: "2022", event: "Osiągamy 1 000 sprzedawców i 500 tys. aktywnych kupujących. Wprowadzamy analitykę dla sprzedawców." },
  { year: "2023", event: "Rozrastamy się do ponad 4 000 sprzedawców. Przychody rosną o 28% rok do roku." },
  { year: "2024", event: "Nowe wyzwania: kurczące się marże, rosnąca konkurencja. Czas na ewolucję." },
];

export default function AboutPage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative h-[50vh] min-h-[400px] overflow-hidden">
        <Image
          src="/images/hero/hero-3.jpg"
          alt="Marketplace modowy FashionHero"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-white text-center px-4">
          <p className="text-[11px] font-medium uppercase tracking-[1px] mb-4 text-white/70">
            NASZA HISTORIA
          </p>
          <h1 className="text-4xl md:text-5xl font-light leading-tight max-w-2xl">
            Tu sprzedawcy rosną,
            <br />
            a kupujący odkrywają.
          </h1>
        </div>
      </section>

      {/* Mission */}
      <section className="max-w-3xl mx-auto px-4 py-20 text-center">
        <p className="text-[11px] font-medium uppercase tracking-[1px] text-warm-gray mb-6">
          NASZA MISJA
        </p>
        <p className="text-xl md:text-2xl leading-relaxed text-charcoal">
          FashionHero powstał z prostego pomysłu: moda nie powinna być
          kontrolowana przez kilku największych graczy. Zbudowaliśmy marketplace,
          gdzie niezależni projektanci konkurują obok globalnych marek - a kupujący
          odkrywają style, których nie znajdą nigdzie indziej.
        </p>
      </section>

      {/* Values */}
      <section className="bg-cream-light py-20">
        <div className="max-w-6xl mx-auto px-4">
          <p className="text-[11px] font-medium uppercase tracking-[1px] text-warm-gray mb-10 text-center">
            NASZE WARTOŚCI
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {values.map((value) => (
              <div key={value.title}>
                <h3 className="text-lg font-medium mb-3 text-charcoal">{value.title}</h3>
                <p className="text-sm leading-relaxed text-warm-gray">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Image break */}
      <section className="relative h-[40vh] min-h-[300px] overflow-hidden">
        <Image
          src="/images/hero/hero-2.jpg"
          alt="Społeczność FashionHero"
          fill
          className="object-cover"
        />
      </section>

      {/* Timeline */}
      <section className="max-w-3xl mx-auto px-4 py-20">
        <p className="text-[11px] font-medium uppercase tracking-[1px] text-warm-gray mb-10 text-center">
          NASZA DROGA
        </p>
        <div className="space-y-8">
          {timeline.map((item) => (
            <div key={item.year} className="flex gap-6 items-start">
              <span className="text-2xl font-light text-charcoal/30 w-16 flex-shrink-0">
                {item.year}
              </span>
              <p className="text-sm leading-relaxed text-charcoal pt-2 border-t border-cream-dark flex-1">
                {item.event}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-charcoal text-white py-20 text-center">
        <p className="text-[11px] font-medium uppercase tracking-[1px] text-white/50 mb-4">
          GOTOWY/A NA KOLEJNY KROK?
        </p>
        <h2 className="text-3xl md:text-4xl font-light mb-8">
          Zacznij odkrywać.
        </h2>
        <div className="flex gap-4 justify-center">
          <Link href="/collections/mens" className="btn-cta bg-white text-charcoal hover:bg-white/90">
            KUP DLA NIEGO
          </Link>
          <Link href="/collections/womens" className="btn-cta bg-white text-charcoal hover:bg-white/90">
            KUP DLA NIEJ
          </Link>
        </div>
      </section>
    </div>
  );
}
