"use client";

import { useActiveBannerForCategory } from "@/store/marketplace-store";
import { CollectionHero } from "./collection-hero";
import { SponsoredBanner } from "./sponsored-banner";
import type { Collection } from "@/types";

interface CollectionHeaderProps {
  collection: Collection;
}

/**
 * Decides whether to render a sponsored banner (when an active category_banner
 * campaign exists for this slug) or the default CollectionHero.
 * Reads campaign state from the marketplace store so it updates live when a
 * seller pauses/launches a banner campaign.
 */
export function CollectionHeader({ collection }: CollectionHeaderProps) {
  const banner = useActiveBannerForCategory(collection.slug);
  if (banner) {
    return <SponsoredBanner campaign={banner} />;
  }
  return <CollectionHero collection={collection} />;
}
