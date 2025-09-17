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
                var isPurchase = url && url.includes('gumroad.com');
                var eventType = isPurchase ? 'purchase' : 'add_to_cart';
                
                console.log(isPurchase ? '🛒 Purchase tracking triggered!' : '🛍️ Add to cart tracking triggered!', {
                  url: url,
                  conversionId: 'AW-17577910658/E4TcCKTE-5wbEILD5r1B',
                  value: 1.0,
                  currency: 'USD',
                  eventType: eventType
                });
                
                var callback = function () {
                  console.log('✅ ' + (isPurchase ? 'Purchase' : 'Add to cart') + ' callback executed, navigating to:', url);
                  if (typeof(url) != 'undefined') {
                    if (url.startsWith('#')) {
                      // Internal navigation (scroll to section)
                      var element = document.querySelector(url);
                      if (element) {
                        element.scrollIntoView({ behavior: 'smooth' });
                      }
                    } else {
                      // External navigation
                      window.location = url;
                    }
                  }
                };
                
                if (isPurchase) {
                  // Send purchase event for external Gumroad links
                  gtag('event', 'Purchase', {
                      'transaction_id': 'mobile-games-' + Date.now(),
                      'value': 1.0,
                      'currency': 'USD',
                      'items': [{
                        'item_id': 'nandi-mobile-games-early-access',
                        'item_name': 'Nandi Mobile Games Early Access',
                        'category': 'Software',
                        'quantity': 1,
                        'price': 1.0
                      }]
                  });
                } else {
                  // Send add_to_cart event for internal navigation to pricing
                  gtag('event', 'add_to_cart', {
                      'currency': 'USD',
                      'value': 1.0,
                      'items': [{
                        'item_id': 'nandi-mobile-games-early-access',
                        'item_name': 'Nandi Mobile Games Early Access',
                        'category': 'Software',
                        'quantity': 1,
                        'price': 1.0
                      }]
                  });
                }
                
                gtag('event', 'conversion', {
                    'send_to': 'AW-17577910658/E4TcCKTE-5wbEILD5r1B',
                    'value': 1.0,
                    'currency': 'USD',
                    'event_callback': callback
                });
                
                console.log('📊 ' + (isPurchase ? 'Purchase' : 'Add to cart') + ' and conversion events sent');
                return false;
              }
            `,
          }}
      />
      {children}
    </>
  );
}