"use client";

import { useState, useRef, useCallback } from "react";
import Link from "next/link";

type MenuKey = "MEN" | "WOMEN" | "SALE";

interface MenuColumn {
  heading: string;
  links: { label: string; href: string }[];
}

const menMenu: MenuColumn[] = [
  {
    heading: "OBUWIE",
    links: [
      { label: "Buty do biegania", href: "/collections/mens?type=runner" },
      { label: "Buty do chodzenia", href: "/collections/mens?type=walker" },
      { label: "Trampki", href: "/collections/mens?type=trainer" },
      { label: "Wsuwane", href: "/collections/mens?type=slip-on" },
      { label: "Wszystkie buty męskie", href: "/collections/mens" },
    ],
  },
  {
    heading: "ODZIEŻ",
    links: [
      { label: "Koszulki", href: "/collections/apparel?gender=men&type=tee" },
      { label: "Bluzy z kapturem", href: "/collections/apparel?gender=men&type=hoodie" },
      { label: "Joggery", href: "/collections/apparel?gender=men&type=pant" },
      { label: "Kurtki", href: "/collections/apparel?gender=men&type=jacket" },
      { label: "Cała odzież męska", href: "/collections/apparel?gender=men" },
    ],
  },
  {
    heading: "SKARPETY",
    links: [
      { label: "Stopki", href: "/collections/socks?gender=men" },
      { label: "Klasyczne", href: "/collections/socks?gender=men" },
      { label: "Niewidoczne", href: "/collections/socks" },
      { label: "Sportowe", href: "/collections/socks" },
      { label: "Wszystkie skarpety", href: "/collections/socks" },
    ],
  },
  {
    heading: "AKCESORIA",
    links: [
      { label: "Torby", href: "/collections/accessories" },
      { label: "Czapki zimowe", href: "/collections/accessories" },
      { label: "Czapki z daszkiem", href: "/collections/accessories" },
      { label: "Wkładki", href: "/collections/accessories" },
    ],
  },
];

const womenMenu: MenuColumn[] = [
  {
    heading: "OBUWIE",
    links: [
      { label: "Buty do biegania", href: "/collections/womens?type=runner" },
      { label: "Buty do chodzenia", href: "/collections/womens?type=walker" },
      { label: "Trampki", href: "/collections/womens?type=trainer" },
      { label: "Baleriny", href: "/collections/womens?type=flat" },
      { label: "Wsuwane", href: "/collections/womens?type=slip-on" },
      { label: "Wszystkie buty damskie", href: "/collections/womens" },
    ],
  },
  {
    heading: "ODZIEŻ",
    links: [
      { label: "Koszulki", href: "/collections/apparel?gender=women&type=tee" },
      { label: "Bluzy z kapturem", href: "/collections/apparel?gender=women&type=hoodie" },
      { label: "Joggery", href: "/collections/apparel?gender=women&type=pant" },
      { label: "Kardigany", href: "/collections/apparel?gender=women&type=cardigan" },
      { label: "Cała odzież damska", href: "/collections/apparel?gender=women" },
    ],
  },
  {
    heading: "SKARPETY",
    links: [
      { label: "Stopki", href: "/collections/socks?gender=women" },
      { label: "Klasyczne", href: "/collections/socks?gender=women" },
      { label: "Niewidoczne", href: "/collections/socks" },
      { label: "Sportowe", href: "/collections/socks" },
      { label: "Wszystkie skarpety", href: "/collections/socks" },
    ],
  },
  {
    heading: "AKCESORIA",
    links: [
      { label: "Torby", href: "/collections/accessories" },
      { label: "Czapki zimowe", href: "/collections/accessories" },
      { label: "Czapki z daszkiem", href: "/collections/accessories" },
      { label: "Wkładki", href: "/collections/accessories" },
    ],
  },
];

const menuData: Record<MenuKey, MenuColumn[] | null> = {
  MEN: menMenu,
  WOMEN: womenMenu,
  SALE: null,
};

const displayLabels: Record<MenuKey, string> = {
  MEN: "MĘŻCZYZNA",
  WOMEN: "KOBIETA",
  SALE: "WYPRZEDAŻ",
};

interface MegaMenuTriggerProps {
  label: MenuKey;
  href: string;
}

export function MegaMenuNav() {
  const [activeMenu, setActiveMenu] = useState<MenuKey | null>(null);
  const [mobileMenu, setMobileMenu] = useState<MenuKey | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleMouseEnter = useCallback((key: MenuKey) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setActiveMenu(key);
  }, []);

  const handleMouseLeave = useCallback(() => {
    timeoutRef.current = setTimeout(() => setActiveMenu(null), 150);
  }, []);

  const handlePanelEnter = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  }, []);

  const triggers: MegaMenuTriggerProps[] = [
    { label: "MEN", href: "/collections/mens" },
    { label: "WOMEN", href: "/collections/womens" },
    { label: "SALE", href: "/collections/sale" },
  ];

  return (
    <>
      {/* Desktop nav triggers */}
      <div className="hidden lg:flex items-center gap-6 flex-1">
        {triggers.map(({ label, href }) => (
          <div
            key={label}
            onMouseEnter={() => handleMouseEnter(label)}
            onMouseLeave={handleMouseLeave}
            className="relative"
          >
            <Link
              href={href}
              className="text-[12px] font-medium uppercase tracking-[0.5px] text-charcoal hover:opacity-60 transition-opacity"
            >
              {displayLabels[label]}
            </Link>
          </div>
        ))}
        <Link
          href="/collections/new-arrivals"
          className="text-[12px] font-medium uppercase tracking-[0.5px] text-charcoal hover:opacity-60 transition-opacity"
        >
          NOWOŚCI
        </Link>
      </div>

      {/* Desktop mega menu panel */}
      {activeMenu && menuData[activeMenu] && (
        <div
          className="hidden lg:block absolute left-0 right-0 top-full bg-white border-t border-black/5 shadow-lg z-50"
          onMouseEnter={handlePanelEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div className="max-w-7xl mx-auto px-8 py-8">
            <div className="grid grid-cols-4 gap-10">
              {menuData[activeMenu]!.map((col) => (
                <div key={col.heading}>
                  <h3 className="text-[12px] font-medium uppercase tracking-[0.8px] text-charcoal mb-3">
                    {col.heading}
                  </h3>
                  <ul className="space-y-2">
                    {col.links.map((link) => (
                      <li key={link.label}>
                        <Link
                          href={link.href}
                          onClick={() => setActiveMenu(null)}
                          className="text-[13px] text-charcoal/70 hover:text-charcoal transition-colors"
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Mobile menu items (rendered inside mobile drawer via prop) */}
      <MegaMenuMobile
        open={mobileMenu}
        onOpen={setMobileMenu}
        onClose={() => setMobileMenu(null)}
        triggers={triggers}
      />
    </>
  );
}

/** Mobile mega menu — rendered as expandable sections */
function MegaMenuMobile({
  open,
  onOpen,
  onClose,
  triggers,
}: {
  open: MenuKey | null;
  onOpen: (key: MenuKey) => void;
  onClose: () => void;
  triggers: MegaMenuTriggerProps[];
}) {
  // This component is used inside the mobile drawer in header.tsx
  // It's exported so header can embed it
  return null; // The mobile rendering is handled directly in the header
}

/** Standalone mobile mega menu content for embedding in header mobile drawer */
export function MobileMegaMenuContent({ onLinkClick }: { onLinkClick: () => void }) {
  const [expanded, setExpanded] = useState<MenuKey | null>(null);

  const triggers: { label: MenuKey; href: string }[] = [
    { label: "MEN", href: "/collections/mens" },
    { label: "WOMEN", href: "/collections/womens" },
    { label: "SALE", href: "/collections/sale" },
  ];

  return (
    <div className="space-y-1">
      {triggers.map(({ label, href }) => {
        const columns = menuData[label];
        if (!columns) {
          // SALE — just a link
          return (
            <Link
              key={label}
              href={href}
              className="block text-nav py-2"
              onClick={onLinkClick}
            >
              {displayLabels[label]}
            </Link>
          );
        }

        const isOpen = expanded === label;
        return (
          <div key={label}>
            <button
              onClick={() => setExpanded(isOpen ? null : label)}
              className="flex items-center justify-between w-full text-nav py-2"
            >
              {displayLabels[label]}
              <span className="text-[12px] text-warm-gray">{isOpen ? "−" : "+"}</span>
            </button>
            {isOpen && (
              <div className="pl-4 pb-3 space-y-4">
                {columns.map((col) => (
                  <div key={col.heading}>
                    <h4 className="text-[11px] font-medium uppercase tracking-[0.8px] text-warm-gray mb-1.5">
                      {col.heading}
                    </h4>
                    <ul className="space-y-1">
                      {col.links.map((link) => (
                        <li key={link.label}>
                          <Link
                            href={link.href}
                            onClick={onLinkClick}
                            className="block text-[13px] text-charcoal/70 hover:text-charcoal py-0.5"
                          >
                            {link.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
      <Link
        href="/collections/new-arrivals"
        className="block text-nav py-2"
        onClick={onLinkClick}
      >
        NOWOŚCI
      </Link>
    </div>
  );
}
