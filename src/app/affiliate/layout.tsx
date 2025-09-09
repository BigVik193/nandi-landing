import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nandi AI for Affiliate Marketers - Maximize Campaign ROI Automatically",
  description: "AI-powered landing page optimization for affiliate marketers. Boost conversions on every campaign with automated A/B testing, real-time optimization, and multi-offer testing. Perfect for affiliates running paid traffic.",
  keywords: ["affiliate marketing optimization", "landing page optimization", "conversion rate optimization", "affiliate AI tools", "campaign optimization", "split testing", "A/B testing", "affiliate marketing automation"],
  openGraph: {
    title: "Nandi AI for Affiliates - Automated Landing Page Optimization",
    description: "Maximize your affiliate campaign ROI with AI-powered landing page optimization. Automated testing, real-time improvements, and higher conversions.",
    images: [
      {
        url: "/og-image-affiliate.png",
        width: 1200,
        height: 630,
        alt: "Nandi AI - Affiliate Marketing Optimization Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Nandi AI for Affiliates - Boost Campaign Performance", 
    description: "AI-powered landing page optimization for affiliate marketers. Maximize ROI automatically.",
    images: ["/twitter-image-affiliate.png"],
  },
};

export default function AffiliateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}