import type { Metadata } from "next";
import { Bricolage_Grotesque, Figtree } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const bricolageGrotesque = Bricolage_Grotesque({
  variable: "--font-bricolage-grotesque",
  subsets: ["latin"],
});

const figtree = Figtree({
  variable: "--font-figtree",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Nandi AI - Shopify Store Optimization & Conversion Rate Automation",
    template: "%s | Nandi AI - Shopify Growth Engine",
  },
  description: "Boost Shopify sales with AI-powered conversion optimization. Automated A/B testing, real-time store improvements, and seamless integration. Perfect for merch stores, custom goods, and apparel brands.",
  keywords: ["Shopify optimization", "conversion rate optimization", "Shopify AI tools", "ecommerce automation", "Shopify store growth", "sales optimization", "AI marketing automation", "automated testing"],
  authors: [{ name: "Nandi Team" }],
  creator: "Nandi Team",
  publisher: "Nandi Team",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "Nandi AI - Automated Shopify Store Optimization & Growth",
    description: "AI-powered conversion optimization for Shopify stores. Boost sales with automated A/B testing, real-time improvements, and seamless integration.",
    siteName: "Nandi AI",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Nandi AI - Shopify Store Optimization Platform",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Nandi AI - Automated Shopify Growth Engine", 
    description: "AI-powered conversion optimization for Shopify stores. Boost sales automatically.",
    images: ["/twitter-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${bricolageGrotesque.variable} ${figtree.variable} antialiased`}
      >
        {children}
        <Script 
          src="https://assets.calendly.com/assets/external/widget.js" 
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
