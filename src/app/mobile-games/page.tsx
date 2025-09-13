import type { Metadata } from "next";
import MobileGamesNavigation from '@/components/mobile-games/MobileGamesNavigation';
import MobileGamesHero from '@/components/mobile-games/MobileGamesHero';
import MobileGamesWhatIsNandi from '@/components/mobile-games/MobileGamesWhatIsNandi';
import MobileGamesLearnSection from '@/components/mobile-games/MobileGamesLearnSection';
import MobileGamesPersonalizeSection from '@/components/mobile-games/MobileGamesPersonalizeSection';
import MobileGamesStatsSection from '@/components/mobile-games/MobileGamesStatsSection';
import MobileGamesCompetitive from '@/components/mobile-games/MobileGamesCompetitive';
import MobileGamesSubscription from '@/components/mobile-games/MobileGamesSubscription';
import MobileGamesFAQ from '@/components/mobile-games/MobileGamesFAQ';
import MobileGamesContact from '@/components/mobile-games/MobileGamesContact';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: "Mobile Game Monetization - AI-Powered IAP & In-Game Store Optimization",
  description: "Maximize revenue per player with AI-powered in-app purchase optimization. Automated testing of IAP offers, pricing, and in-game store layouts to boost ARPU and conversions without app updates.",
  keywords: [
    "mobile game monetization",
    "in-app purchase optimization", 
    "IAP testing",
    "in-game store optimization",
    "mobile game revenue optimization",
    "ARPU optimization",
    "game monetization AI",
    "automated IAP testing",
    "mobile game conversion optimization",
    "game revenue automation"
  ],
  openGraph: {
    title: "Nandi AI - Mobile Game Monetization & IAP Optimization Platform",
    description: "Maximize revenue per player with AI-powered in-app purchase optimization. Automated testing of IAP offers, pricing, and in-game store layouts to boost ARPU without app updates.",
    siteName: "Nandi AI",
    images: [
      {
        url: "/mobile-games/og-image.png",
        width: 1200,
        height: 630,
        alt: "Nandi AI Mobile Game Monetization - IAP and In-Game Store Optimization Platform",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Nandi AI - Mobile Game Monetization & IAP Optimization", 
    description: "AI-powered in-app purchase optimization. Boost ARPU and conversions with automated IAP testing.",
    images: ["/mobile-games/twitter-image.png"],
  },
};

export default function MobileGamesPage() {
  return (
    <div className="min-h-screen bg-hero">
      <MobileGamesNavigation />
      <MobileGamesHero />
      <MobileGamesWhatIsNandi />
      <MobileGamesLearnSection />
      <MobileGamesPersonalizeSection />
      <MobileGamesStatsSection />
      <MobileGamesCompetitive />
      <MobileGamesSubscription />
      <MobileGamesContact />
      <MobileGamesFAQ />
      <Footer />
    </div>
  );
}