import type { Metadata } from "next";
import { Bricolage_Grotesque, Figtree } from "next/font/google";
import Script from "next/script";
import { Analytics } from '@vercel/analytics/next';
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
    default: "Nandi AI - E-commerce Store Optimization & Conversion Rate Automation",
    template: "%s | Nandi AI - E-commerce Growth Engine",
  },
  description: "Boost online store sales with AI-powered conversion optimization. Automated A/B testing, real-time store improvements, and seamless integration. Perfect for merch stores, custom goods, and apparel brands.",
  keywords: ["e-commerce optimization", "conversion rate optimization", "online store AI tools", "ecommerce automation", "e-commerce store growth", "sales optimization", "AI marketing automation", "automated testing"],
  authors: [{ name: "Nandi Team" }],
  creator: "Nandi Team",
  publisher: "Nandi Team",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "Nandi AI - Automated E-commerce Store Optimization & Growth",
    description: "AI-powered conversion optimization for online stores. Boost sales with automated A/B testing, real-time improvements, and seamless integration.",
    siteName: "Nandi AI",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Nandi AI - E-commerce Store Optimization Platform",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Nandi AI - Automated E-commerce Growth Engine", 
    description: "AI-powered conversion optimization for online stores. Boost sales automatically.",
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
        <Analytics />
        <Script 
          src="https://assets.calendly.com/assets/external/widget.js" 
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
