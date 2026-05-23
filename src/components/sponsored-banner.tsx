import Image from "next/image";
import Link from "next/link";
import type { Campaign } from "@/types";
import { getSellerById } from "@/data/sellers";

interface SponsoredBannerProps {
  campaign: Campaign;
}

export function SponsoredBanner({ campaign }: SponsoredBannerProps) {
  const seller = getSellerById(campaign.sellerId);
  const image = campaign.bannerImage ?? "/images/products/product-22.jpg";
  const headline = campaign.bannerHeadline ?? "Odkryj kolekcję";
  const cta = campaign.bannerCta ?? "Zobacz kolekcję";
  const sellerLabel = seller ? `${seller.name} · sponsorowane` : "Sponsorowane";

  const tooltip = seller
    ? `Płatne miejsce. Sprzedawca ${seller.name} zapłacił za promocję tej kolekcji.`
    : "Płatne miejsce. Sprzedawca zapłacił za promocję tej kolekcji.";

  return (
    <section className="relative w-full overflow-hidden">
      <div
        className="relative flex items-end px-6 md:px-16 pb-10 md:pb-14"
        style={{
          background: "linear-gradient(145deg, #d4a5a5 0%, #c08080 50%, #9a5e5e 100%)",
          minHeight: "44vh",
        }}
      >
        <Image
          src={image}
          alt={headline}
          fill
          sizes="100vw"
          priority
          className="object-cover object-[center_30%]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/40 to-black/20" />

        <div className="absolute top-3 right-3 z-10" title={tooltip}>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.6px] rounded-full bg-black/45 backdrop-blur text-white border border-white/20">
            Sponsorowane
          </span>
        </div>

        <div className="relative z-10 max-w-xl text-white">
          <p className="text-[11px] uppercase tracking-[1px] text-white/80 mb-3">{sellerLabel}</p>
          <h2 className="text-3xl md:text-5xl font-light tracking-tight mb-6 leading-tight">
            {headline}
          </h2>
          {seller && (
            <Link
              href={`/collections/womens?seller=${seller.slug}`}
              className="inline-flex items-center justify-center px-6 py-2.5 text-[12px] font-medium uppercase tracking-[0.6px] text-white border border-white rounded-full hover:bg-white hover:text-charcoal transition-all"
            >
              {cta}
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
