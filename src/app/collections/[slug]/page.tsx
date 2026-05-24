import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getCollection } from "@/data/collections";
import { collections } from "@/data/collections";
import { getProductsByCollection } from "@/data/products";
import { CollectionHeader } from "@/components/collection-header";
import { CollectionView } from "@/components/collection-view";

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ seller?: string; type?: string; cat?: string; gender?: string }>;
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
  const { seller, type, cat, gender } = await searchParams;
  const collection = getCollection(slug);

  if (!collection) {
    notFound();
  }

  const products = getProductsByCollection(slug);

  return (
    <>
      <CollectionHeader collection={collection} />
      <CollectionView
        products={products}
        collectionName={collection.name}
        initialSellerSlug={seller}
        initialType={type}
        initialProductCategory={cat}
        initialGender={gender}
      />
    </>
  );
}
