"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { PlusIcon, MinusIcon } from "@/components/icons";
import type { Product } from "@/types";

interface ProductDetailsAccordionProps {
  product: Product;
}

interface AccordionSection {
  id: string;
  title: string;
  content: string;
}

function AccordionItem({
  section,
  isOpen,
  onToggle,
}: {
  section: AccordionSection;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="border-b border-border">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between py-4 text-left"
      >
        <span className="text-nav">{section.title}</span>
        {isOpen ? (
          <MinusIcon className="h-4 w-4 text-charcoal" />
        ) : (
          <PlusIcon className="h-4 w-4 text-charcoal" />
        )}
      </button>
      <div
        className={cn(
          "overflow-hidden transition-all duration-300 ease-in-out",
          isOpen ? "max-h-96 pb-4" : "max-h-0"
        )}
      >
        <p className="text-sm text-warm-gray leading-relaxed whitespace-pre-line">
          {section.content}
        </p>
      </div>
    </div>
  );
}

export function ProductDetailsAccordion({ product }: ProductDetailsAccordionProps) {
  const [openId, setOpenId] = useState<string | null>(null);

  const sections: AccordionSection[] = [
    {
      id: "description",
      title: "OPIS",
      content: product.description,
    },
    {
      id: "features",
      title: "CECHY",
      content: product.features.map((f) => `\u2022 ${f}`).join("\n"),
    },
    {
      id: "materials",
      title: "MATERIA\u0141Y",
      content: product.materials,
    },
    {
      id: "care",
      title: "PIEL\u0118GNACJA",
      content: product.care,
    },
  ];

  function handleToggle(id: string) {
    setOpenId((prev) => (prev === id ? null : id));
  }

  return (
    <div className="border-t border-border">
      {sections.map((section) => (
        <AccordionItem
          key={section.id}
          section={section}
          isOpen={openId === section.id}
          onToggle={() => handleToggle(section.id)}
        />
      ))}
    </div>
  );
}
