import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nandi AI for Mobile Games - Maximize Downloads & Revenue Automatically",
  description: "AI-powered app store optimization for mobile game developers. Boost downloads and player engagement with automated A/B testing, icon optimization, and screenshot testing. Perfect for indie developers and game studios.",
  keywords: ["mobile game optimization", "ASO optimization", "app store optimization", "mobile game AI tools", "game marketing automation", "icon A/B testing", "screenshot optimization", "mobile game growth"],
  openGraph: {
    title: "Nandi AI for Mobile Games - Automated ASO & Growth",
    description: "Maximize your mobile game downloads with AI-powered app store optimization. Automated testing, real-time improvements, and higher conversion rates.",
    images: [
      {
        url: "/og-image-mobile-games.png",
        width: 1200,
        height: 630,
        alt: "Nandi AI - Mobile Game Growth Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Nandi AI for Mobile Games - Boost Downloads Automatically", 
    description: "AI-powered app store optimization for mobile game developers. Maximize downloads and revenue automatically.",
    images: ["/twitter-image-mobile-games.png"],
  },
};

export default function MobileGamesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}