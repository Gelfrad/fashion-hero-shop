"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface SizeSelectorProps {
  sizes: number[];
  selectedSize: number | null;
  onSelect: (size: number) => void;
}

export function SizeSelector({ sizes, selectedSize, onSelect }: SizeSelectorProps) {
  const [sizeType, setSizeType] = useState<"men" | "women">("men");

  return (
    <div>
      {/* Tab toggle */}
      <div className="flex border-b border-border mb-4">
        <button
          onClick={() => setSizeType("men")}
          className={cn(
            "text-[12px] font-medium uppercase tracking-[0.5px] pb-2 mr-6 border-b-2 transition-colors",
            sizeType === "men"
              ? "border-charcoal text-charcoal"
              : "border-transparent text-warm-gray hover:text-charcoal"
          )}
        >
          ROZMIARY MĘSKIE
        </button>
        <button
          onClick={() => setSizeType("women")}
          className={cn(
            "text-[12px] font-medium uppercase tracking-[0.5px] pb-2 border-b-2 transition-colors",
            sizeType === "women"
              ? "border-charcoal text-charcoal"
              : "border-transparent text-warm-gray hover:text-charcoal"
          )}
        >
          ROZMIARY DAMSKIE
        </button>
      </div>

      {/* Size grid — cleaner pills */}
      <div className="grid grid-cols-4 gap-2">
        {sizes.map((size) => (
          <button
            key={size}
            onClick={() => onSelect(size)}
            className={cn(
              "py-2.5 text-[13px] font-medium rounded-sm transition-all",
              selectedSize === size
                ? "bg-charcoal text-white"
                : "bg-white border border-border text-charcoal hover:border-charcoal"
            )}
          >
            {sizeType === "women" ? size : size}
          </button>
        ))}
      </div>
    </div>
  );
}
