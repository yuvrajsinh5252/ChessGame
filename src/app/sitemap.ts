import { MetadataRoute } from "next";
import { SEO_CONFIG } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = SEO_CONFIG.site.baseUrl;

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: SEO_CONFIG.sitemap.changeFrequencies.home,
      priority: SEO_CONFIG.sitemap.priorities.home,
    },
    {
      url: `${baseUrl}/online-multiplayer`,
      lastModified: new Date(),
      changeFrequency: SEO_CONFIG.sitemap.changeFrequencies.onlineMultiplayer,
      priority: SEO_CONFIG.sitemap.priorities.onlineMultiplayer,
    },
    {
      url: `${baseUrl}/computer`,
      lastModified: new Date(),
      changeFrequency: SEO_CONFIG.sitemap.changeFrequencies.computer,
      priority: SEO_CONFIG.sitemap.priorities.computer,
    },
    {
      url: `${baseUrl}/two-player`,
      lastModified: new Date(),
      changeFrequency: SEO_CONFIG.sitemap.changeFrequencies.twoPlayer,
      priority: SEO_CONFIG.sitemap.priorities.twoPlayer,
    },
    {
      url: `${baseUrl}/profile`,
      lastModified: new Date(),
      changeFrequency: SEO_CONFIG.sitemap.changeFrequencies.profile,
      priority: SEO_CONFIG.sitemap.priorities.profile,
    },
  ];
}
