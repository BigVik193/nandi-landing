import type { Metadata } from "next";
import Script from "next/script";

export const metadata: Metadata = {
  title: "Nandi AI for Mobile Games - Maximize Revenue Per Player with AI-Powered IAP Optimization",
  description: "AI-powered in-game monetization platform for mobile game developers. Boost ARPU and conversions with automated IAP testing, in-game store optimization, and dynamic pricing. Perfect for indie developers and game studios.",
  keywords: ["mobile game monetization", "in-app purchase optimization", "IAP testing", "in-game store optimization", "mobile game revenue optimization", "ARPU optimization", "game monetization AI", "automated IAP testing", "mobile game conversion optimization"],
  openGraph: {
    title: "Nandi AI for Mobile Games - AI-Powered In-Game Monetization Platform",
    description: "Maximize revenue per player with AI-powered in-app purchase optimization. Automated testing of IAP offers, pricing, and in-game store layouts to boost ARPU without app updates.",
    images: [
      {
        url: "/mobile-games/og-image.png",
        width: 1200,
        height: 630,
        alt: "Nandi AI - Mobile Game Monetization Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Nandi AI for Mobile Games - Boost ARPU with AI-Powered IAP Optimization", 
    description: "AI-powered in-game monetization platform. Maximize revenue per player with automated IAP testing and in-game store optimization.",
    images: ["/mobile-games/twitter-image.png"],
  },
};

export default function MobileGamesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* Google Ads Conversion Tracking */}
      <Script
        id="gtag-conversion-tracking"
        strategy="afterInteractive"
                  dangerouslySetInnerHTML={{
            __html: `
              function gtag_report_conversion(url) {
                console.log('🎯 Conversion tracking triggered!', {
                  url: url,
                  conversionId: 'AW-17577910658/E4TcCKTE-5wbEILD5r1B',
                  value: 1.0,
                  currency: 'USD'
                });
                
                var callback = function () {
                  console.log('✅ Conversion callback executed, redirecting to:', url);
                  if (typeof(url) != 'undefined') {
                    window.location = url;
                  }
                };
                
                gtag('event', 'conversion', {
                    'send_to': 'AW-17577910658/E4TcCKTE-5wbEILD5r1B',
                    'value': 1.0,
                    'currency': 'USD',
                    'event_callback': callback
                });
                
                console.log('📊 Google Ads conversion event sent');
                return false;
              }
            `,
          }}
      />
      {children}
    </>
  );
}