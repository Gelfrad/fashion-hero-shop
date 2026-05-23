import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getCollection } from "@/data/collections";
import { collections } from "@/data/collections";
import { getProductsByCollection } from "@/data/products";
import { getActiveBannerForCategory } from "@/data/campaigns";
import { CollectionHero } from "@/components/collection-hero";
import { CollectionView } from "@/components/collection-view";
import { SponsoredBanner } from "@/components/sponsored-banner";

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ seller?: string }>;
}

export async function generateStaticParams() {
  return collections.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const collection = getCollection(slug);

  if (!collection) {
    return { title: "Collection Not Found" };
  }

  return {
    title: `${collection.name} | FashionHero`,
    description: collection.description,
  };
}

export default async function CollectionPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const { seller } = await searchParams;
  const collection = getCollection(slug);

  if (!collection) {
    notFound();
  }

  const products = getProductsByCollection(slug);
  const banner = getActiveBannerForCategory(slug);

  return (
    <>
      {banner ? (
        <SponsoredBanner campaign={banner} />
      ) : (
        <CollectionHero collection={collection} />
      )}
      <CollectionView
        products={products}
        collectionName={collection.name}
        initialSellerSlug={seller}
      />
    </>
  );
}
