import { MetadataRoute } from "next";
import { SEO_CONFIG } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/_next/", "/admin/", "/private/"],
    },
    sitemap: `${SEO_CONFIG.site.baseUrl}/sitemap.xml`,
    host: SEO_CONFIG.site.baseUrl,
  };
}
