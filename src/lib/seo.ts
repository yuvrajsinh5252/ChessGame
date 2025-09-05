export const SEO_CONFIG = {
  site: {
    name: "Chessmate",
    baseUrl: "https://chess.yuvrajsinh.dev",
    description:
      "Play chess online against global players, challenge AI opponents, or enjoy local matches with friends. Real-time multiplayer chess with smart AI, beautiful themes, and competitive matchmaking.",
    locale: "en_US",
    twitterCard: "summary_large_image" as const,
    imageWidth: 1200,
    imageHeight: 630,
  },
  sitemap: {
    changeFrequencies: {
      home: "weekly" as const,
      onlineMultiplayer: "weekly" as const,
      computer: "weekly" as const,
      twoPlayer: "weekly" as const,
      profile: "monthly" as const,
    },
    priorities: {
      home: 1.0,
      onlineMultiplayer: 0.9,
      computer: 0.8,
      twoPlayer: 0.8,
      profile: 0.6,
    },
  },
} as const;

export function generatePageSEO({
  title,
  description,
  image = "chess.png",
  path = "",
}: {
  title: string;
  description: string;
  image?: string;
  path?: string;
}) {
  const fullTitle = `${title} - ${SEO_CONFIG.site.name}`;

  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const cleanPath = normalizedPath === "/" ? "" : normalizedPath;

  const normalizedImage = image.startsWith("/") ? image.slice(1) : image;
  const finalImage = normalizedImage || "chess.png";

  const pageUrl = `${SEO_CONFIG.site.baseUrl}${cleanPath}`;

  return {
    title: fullTitle,
    description,
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      title: fullTitle,
      description,
      url: pageUrl,
      siteName: SEO_CONFIG.site.name,
      images: [
        {
          url: `${SEO_CONFIG.site.baseUrl}/${finalImage}`,
          width: SEO_CONFIG.site.imageWidth,
          height: SEO_CONFIG.site.imageHeight,
          alt: title,
        },
      ],
      locale: SEO_CONFIG.site.locale,
      type: "website" as const,
    },
    twitter: {
      card: SEO_CONFIG.site.twitterCard,
      title: fullTitle,
      description,
      images: [`${SEO_CONFIG.site.baseUrl}/${finalImage}`],
    },
  };
}
