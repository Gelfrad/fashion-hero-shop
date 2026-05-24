"use client";

import { cn } from "@/lib/utils";
import type { ShoeType, ShoeMaterial } from "@/types";
import { getAllSellers } from "@/data/sellers";

type GenderFilter = "all" | "men" | "women";
type PriceRange = "all" | "under-100" | "100-130" | "over-130";

interface FilterSidebarProps {
  gender: GenderFilter;
  priceRange: PriceRange;
  shoeTypes: ShoeType[];
  materials: ShoeMaterial[];
  sizes: number[];
  availableTypes?: ShoeType[];
  sellerSlugs: string[];
  onGenderChange: (gender: GenderFilter) => void;
  onPriceRangeChange: (range: PriceRange) => void;
  onShoeTypeChange: (types: ShoeType[]) => void;
  onMaterialChange: (materials: ShoeMaterial[]) => void;
  onSizesChange: (sizes: number[]) => void;
  onSellerChange: (slugs: string[]) => void;
  onClearAll: () => void;
  activeFilterCount: number;
}

const allSizes = [5, 6, 7, 8, 9, 10, 11, 12, 13];

const allTypeOptions: { value: ShoeType; label: string }[] = [
  { value: "runner", label: "Runner" },
  { value: "walker", label: "Walker" },
  { value: "slip-on", label: "Slip-On" },
  { value: "trainer", label: "Trainer" },
  { value: "flat", label: "Flat" },
  { value: "hiker", label: "Hiker" },
  { value: "slide", label: "Slide" },
  { value: "loafer", label: "Loafer" },
  { value: "sock", label: "Sock" },
  { value: "tee", label: "Tee" },
  { value: "hoodie", label: "Hoodie" },
  { value: "pant", label: "Jogger" },
  { value: "jacket", label: "Jacket" },
  { value: "cardigan", label: "Cardigan" },
  { value: "bag", label: "Bag" },
  { value: "beanie", label: "Beanie" },
  { value: "cap", label: "Cap" },
  { value: "insole", label: "Insole" },
];

const materialOptions: { value: ShoeMaterial; label: string }[] = [
  { value: "mesh", label: "Mesh" },
  { value: "wool", label: "Wool" },
  { value: "tree-fiber", label: "Tree Fiber" },
  { value: "knit", label: "Knit" },
];

const priceOptions: { value: PriceRange; label: string }[] = [
  { value: "under-100", label: "Poniżej 199 zł" },
  { value: "100-130", label: "199 – 399 zł" },
  { value: "over-130", label: "Powyżej 399 zł" },
];

function FilterSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="py-5 border-b border-black/10">
      <h4 className="text-[11px] font-medium uppercase tracking-[0.8px] text-charcoal mb-3">
        {title}
      </h4>
      {children}
    </div>
  );
}

function Checkbox({
  checked,
  label,
  onChange,
}: {
  checked: boolean;
  label: string;
  onChange: () => void;
}) {
  return (
    <label className="flex items-center gap-2.5 py-1 cursor-pointer group">
      <span
        className={cn(
          "w-4 h-4 rounded-sm border flex items-center justify-center transition-colors flex-shrink-0",
          checked
            ? "bg-charcoal border-charcoal"
            : "border-black/20 group-hover:border-black/40"
        )}
      >
        {checked && (
          <svg viewBox="0 0 12 12" fill="none" className="w-2.5 h-2.5">
            <path
              d="M2 6l3 3 5-5"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </span>
      <span className="text-[13px] text-charcoal/80 group-hover:text-charcoal transition-colors">
        {label}
      </span>
    </label>
  );
}

export function FilterSidebar({
  gender,
  priceRange,
  shoeTypes,
  materials,
  sizes,
  availableTypes,
  sellerSlugs,
  onGenderChange,
  onPriceRangeChange,
  onShoeTypeChange,
  onMaterialChange,
  onSizesChange,
  onSellerChange,
  onClearAll,
  activeFilterCount,
}: FilterSidebarProps) {
  const allSellers = getAllSellers();
  const shoeTypeOptions = availableTypes
    ? allTypeOptions.filter((opt) => availableTypes.includes(opt.value))
    : allTypeOptions;
  function toggleShoeType(type: ShoeType) {
    onShoeTypeChange(
      shoeTypes.includes(type)
        ? shoeTypes.filter((t) => t !== type)
        : [...shoeTypes, type]
    );
  }

  function toggleMaterial(mat: ShoeMaterial) {
    onMaterialChange(
      materials.includes(mat)
        ? materials.filter((m) => m !== mat)
        : [...materials, mat]
    );
  }

  function toggleSize(size: number) {
    onSizesChange(
      sizes.includes(size)
        ? sizes.filter((s) => s !== size)
        : [...sizes, size]
    );
  }

  function toggleSeller(slug: string) {
    onSellerChange(
      sellerSlugs.includes(slug)
        ? sellerSlugs.filter((s) => s !== slug)
        : [...sellerSlugs, slug]
    );
  }

  return (
    <aside className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-black/10">
        <h3 className="text-[12px] font-medium uppercase tracking-[0.5px]">
          Filtry
        </h3>
        {activeFilterCount > 0 && (
          <button
            onClick={onClearAll}
            className="text-[11px] text-warm-gray underline hover:text-charcoal transition-colors"
          >
            Wyczyść ({activeFilterCount})
          </button>
        )}
      </div>

      {/* Gender */}
      <FilterSection title="Płeć">
        <div className="flex flex-col gap-0.5">
          {(["all", "men", "women"] as const).map((g) => (
            <Checkbox
              key={g}
              checked={gender === g}
              label={g === "all" ? "Wszystko" : g === "men" ? "Mężczyzna" : "Kobieta"}
              onChange={() => onGenderChange(g)}
            />
          ))}
        </div>
      </FilterSection>

      {/* Size */}
      <FilterSection title="Rozmiar">
        <div className="grid grid-cols-4 gap-1.5">
          {allSizes.map((size) => (
            <button
              key={size}
              onClick={() => toggleSize(size)}
              className={cn(
                "h-9 text-[12px] font-medium border rounded transition-colors",
                sizes.includes(size)
                  ? "bg-charcoal text-white border-charcoal"
                  : "bg-white text-charcoal border-black/15 hover:border-charcoal"
              )}
            >
              {size}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* Price Range */}
      <FilterSection title="Cena">
        <div className="flex flex-col gap-0.5">
          {priceOptions.map((opt) => (
            <Checkbox
              key={opt.value}
              checked={priceRange === opt.value}
              label={opt.label}
              onChange={() =>
                onPriceRangeChange(priceRange === opt.value ? "all" : opt.value)
              }
            />
          ))}
        </div>
      </FilterSection>

      {/* Shoe Type */}
      <FilterSection title="Typ produktu">
        <div className="flex flex-col gap-0.5">
          {shoeTypeOptions.map((opt) => (
            <Checkbox
              key={opt.value}
              checked={shoeTypes.includes(opt.value)}
              label={opt.label}
              onChange={() => toggleShoeType(opt.value)}
            />
          ))}
        </div>
      </FilterSection>

      {/* Material */}
      <FilterSection title="Materiał">
        <div className="flex flex-col gap-0.5">
          {materialOptions.map((opt) => (
            <Checkbox
              key={opt.value}
              checked={materials.includes(opt.value)}
              label={opt.label}
              onChange={() => toggleMaterial(opt.value)}
            />
          ))}
        </div>
      </FilterSection>

      {/* Seller */}
      <FilterSection title="Sprzedawca">
        <div className="flex flex-col gap-0.5">
          {allSellers.map((seller) => (
            <Checkbox
              key={seller.slug}
              checked={sellerSlugs.includes(seller.slug)}
              label={seller.name}
              onChange={() => toggleSeller(seller.slug)}
            />
          ))}
        </div>
      </FilterSection>
    </aside>
  );
}

export type { GenderFilter, PriceRange };
