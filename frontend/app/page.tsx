import { HeroSection } from "@/components/hero-section";
import { getHomePageData } from "@/lib/strapi";

export async function generateMetadata() {
  const strapiData = await getHomePageData();
  return {
    title: strapiData?.title || "My Strapi Site",
    description: strapiData?.description || "Welcome to my Strapi powered website",
  };
}

export default async function Home() {

  const strapiData = await getHomePageData();

  const { title, description } = strapiData;
  const [heroSection] = strapiData?.sections || [];

  return (
    <main className="container mx-auto py-6">
      <HeroSection data={{ ...heroSection, title, description }} />
    </main>
  );
}
