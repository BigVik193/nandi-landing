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
  metadataBase: new URL('https://trynandi.com'),
  title: {
    default: "Mobile Game Monetization - AI-Powered IAP & In-Game Store Optimization",
    template: "%s | Nandi AI - Mobile Game Monetization Platform",
  },
  description: "Maximize revenue per player with AI-powered in-app purchase optimization. Automated testing of IAP offers, pricing, and in-game store layouts to boost ARPU and conversions without app updates.",
  keywords: ["mobile game monetization", "in-app purchase optimization", "IAP testing", "in-game store optimization", "mobile game revenue optimization", "ARPU optimization", "game monetization AI", "automated IAP testing"],
  authors: [{ name: "Nandi Team" }],
  creator: "Nandi Team",
  publisher: "Nandi Team",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "Nandi AI - Mobile Game Monetization & IAP Optimization Platform",
    description: "Maximize revenue per player with AI-powered in-app purchase optimization. Automated testing of IAP offers, pricing, and in-game store layouts to boost ARPU without app updates.",
    siteName: "Nandi AI",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Nandi AI - Mobile Game Monetization & IAP Optimization", 
    description: "AI-powered in-app purchase optimization. Boost ARPU and conversions with automated IAP testing.",
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Google Analytics (gtag.js) */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=AW-17577910658"
          strategy="afterInteractive"
        />
        <Script
          id="gtag-init"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'AW-17577910658');
            `,
          }}
        />
      </head>
      <body
        className={`${bricolageGrotesque.variable} ${figtree.variable} antialiased`}
      >
        {children}
        <Analytics />
        <Script 
          src="https://assets.calendly.com/assets/external/widget.js" 
          strategy="afterInteractive"
        />
        <Script 
          src="https://rust.referzone.io/235.js" 
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
