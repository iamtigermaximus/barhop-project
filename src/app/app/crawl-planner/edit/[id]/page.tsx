import CrawlPlanner from "@/components/app/crawl/crawl-planner/CrawlPlanner";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditCrawlPage({ params }: PageProps) {
  const { id } = await params;

  return <CrawlPlanner editCrawlId={id} />;
}
