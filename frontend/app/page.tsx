import { HeroSection } from "@/components/hero-section";
import { getHomePage } from "@/lib/strapi";

export async function generateMetadata() {
  const strapiData = await getHomePage();
  return {
    title: strapiData?.title || "My Strapi Site",
    description: strapiData?.description || "Welcome to my Strapi powered website",
  };
}

export default async function Home() {

  const strapiData = await getHomePage();

  const { title, description } = strapiData;
  const [heroSection] = strapiData?.sections || [];

  return (
    <main className="container mx-auto py-6">
      <HeroSection data={{ ...heroSection, title, description }} />
    </main>
  );
}
