import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nandi AI - E-commerce Store Optimization & Conversion Rate Automation",
  description: "Boost online store sales with AI-powered conversion optimization. Automated A/B testing, real-time store improvements, and seamless integration. Perfect for merch stores, custom goods, and apparel brands.",
  keywords: ["e-commerce optimization", "conversion rate optimization", "online store AI tools", "ecommerce automation", "e-commerce store growth", "sales optimization", "AI marketing automation", "automated testing"],
  openGraph: {
    title: "Nandi AI - Automated E-commerce Store Optimization & Growth",
    description: "AI-powered conversion optimization for online stores. Boost sales with automated A/B testing, real-time improvements, and seamless integration.",
    siteName: "Nandi AI",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Nandi AI - Automated E-commerce Growth Engine", 
    description: "AI-powered conversion optimization for online stores. Boost sales automatically.",
  },
};

export default function ECommerceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}