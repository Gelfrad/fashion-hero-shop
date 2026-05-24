const props = [
  {
    label: "ODKRYWANIE",
    title: "Tysiące sprzedawców, jedna wyszukiwarka",
    description:
      "Od największych marek po niezależnych projektantów — znajdziesz tu dokładnie to, czego szukasz wśród tysięcy sprawdzonych sprzedawców.",
  },
  {
    label: "ZAUFANIE",
    title: "Zweryfikowani sprzedawcy, prawdziwe opinie",
    description:
      "Każdy sprzedawca na FashionHero przechodzi weryfikację. Realne opinie kupujących i program Pro pomagają kupować bez obaw.",
  },
  {
    label: "RÓŻNORODNOŚĆ",
    title: "Od streetwearu po ubrania ekologiczne",
    description:
      "Marki premium, perełki vintage, rękodzieło, codzienne podstawy. Jakikolwiek masz styl — znajdziesz go tutaj.",
  },
];

export function ValueProps() {
  return (
    <section className="px-4 md:px-8 lg:px-12 py-16 bg-cream-light">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-5xl mx-auto text-center">
        {props.map((prop) => (
          <div key={prop.label}>
            <p className="text-[11px] font-medium uppercase tracking-[0.8px] text-warm-gray mb-2">
              {prop.label}
            </p>
            <h3 className="text-lg font-normal text-charcoal mb-3">{prop.title}</h3>
            <p className="text-sm text-warm-gray leading-relaxed">{prop.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
