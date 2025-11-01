import VIPMarketplace from "@/components/app/vip-pass/vip-marketplace/VIPMarketplace";

interface MarketplacePageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function VIPMarketplacePage({
  searchParams,
}: MarketplacePageProps) {
  const resolvedSearchParams = await searchParams;
  const city = (resolvedSearchParams.city as string) || "helsinki";

  return <VIPMarketplace initialCity={city} />;
}
