import { Metadata } from 'next';
import Link from 'next/link';
import { getAllBlogPosts } from '@/lib/blog';
import MobileGamesNavigation from '@/components/mobile-games/MobileGamesNavigation';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Mobile Game Revenue Optimization Blog - Increase ARPU & Bypass App Store Fees | 2025 Expert Guides',
  description: 'Learn how to increase mobile game revenue by 30-50% with dynamic in-game stores, AI optimization, and external payments. Expert guides from top game studios. Updated for 2025 algorithm changes.',
  keywords: [
    'how to increase mobile game revenue 2025',
    'mobile game monetization guide',
    'bypass app store fees', 
    'dynamic in-game stores',
    'AI game optimization',
    'mobile game ARPU increase',
    'external payment processing',
    'game revenue optimization 2025',
    'mobile game conversion rates',
    'app store commission bypass'
  ],
  authors: [{ name: 'Nandi Team', url: 'https://trynandi.com/about' }],
  creator: 'Nandi Team',
  publisher: 'Nandi',
  category: 'Mobile Game Development',
  classification: 'Business/Technology',
  openGraph: {
    title: 'Mobile Game Revenue Optimization Blog | Expert Monetization Guides 2025',
    description: 'Learn proven strategies to increase mobile game revenue by 30-50% and bypass app store fees. Expert insights updated for 2025.',
    type: 'website',
    siteName: 'Nandi - Mobile Game Monetization Platform',
    locale: 'en_US',
    images: [
      {
        url: 'https://trynandi.com/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Mobile Game Revenue Optimization Blog - Nandi',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mobile Game Revenue Optimization Blog | Expert Guides 2025',
    description: 'Learn proven strategies to increase mobile game revenue by 30-50% and bypass app store fees.',
    images: ['https://trynandi.com/twitter-image.png'],
    creator: '@trynandi',
  },
  alternates: {
    canonical: 'https://trynandi.com/blog',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

export default function BlogPage() {
  const posts = getAllBlogPosts();

  const blogStructuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Blog",
        "@id": "https://trynandi.com/blog#blog",
        "url": "https://trynandi.com/blog",
        "name": "Mobile Game Revenue Optimization Blog",
        "description": "Expert insights on mobile game monetization, dynamic in-game stores, and AI-powered optimization strategies.",
        "publisher": {
          "@type": "Organization",
          "name": "Nandi",
          "url": "https://trynandi.com",
          "logo": {
            "@type": "ImageObject",
            "url": "https://trynandi.com/favicon.ico"
          }
        },
        "inLanguage": "en-US"
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "How can mobile games increase revenue by 30-50% in 2025?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Mobile games can increase revenue by 30-50% using dynamic in-game stores with AI optimization, external payment processing to bypass 30% app store fees, real-time A/B testing of pricing and layouts, and personalized offers based on player behavior patterns."
            }
          },
          {
            "@type": "Question", 
            "name": "How do you bypass App Store and Google Play commission fees?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "After the Apple vs Epic settlement and new regulations, developers can direct players to external websites for purchases, process payments outside app stores using services like Stripe or PayPal, and keep 97-100% of revenue instead of losing 30% to platform fees."
            }
          },
          {
            "@type": "Question",
            "name": "What are dynamic in-game stores and how do they work?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Dynamic in-game stores use AI to test pricing in real-time, personalize offers based on player spending behavior, optimize layouts automatically using machine learning, and adjust bundles instantly for maximum conversion rates without requiring app updates or store approvals."
            }
          },
          {
            "@type": "Question",
            "name": "What are the best mobile game monetization tools in 2025?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "The top mobile game monetization tools in 2025 include AI-powered dynamic stores (Nandi), analytics platforms (DeltaMonetize), live-ops tools (GameBoost Labs), player behavior analysis (Playlytics), and basic price testing (StoreMaster Pro), with AI automation delivering the highest ROI."
            }
          },
          {
            "@type": "Question",
            "name": "How can mobile game studios reduce engineering overhead for monetization?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Studios can reduce engineering overhead by using dynamic stores that automatically test pricing and bundles without code changes, eliminating app store submission requirements for monetization updates, and implementing AI-powered optimization that requires zero ongoing engineering time after initial setup."
            }
          }
        ]
      },
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://trynandi.com"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Blog",
            "item": "https://trynandi.com/blog"
          }
        ]
      }
    ]
  };

  return (
    <div className="min-h-screen bg-section">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogStructuredData) }}
      />
      <MobileGamesNavigation />
      
      <div className="pt-20">
        {/* Hero Section */}
        <section className="py-16 px-4 sm:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-medium text-black leading-tight font-title mb-6">
              Mobile Game Revenue 
              <br />
              Optimization Blog
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
              Expert insights on how to increase mobile game revenue by 30-50% using dynamic in-game stores, AI-powered optimization, and external payment strategies. Updated for 2025 market trends.
            </p>
          </div>
        </section>

        {/* Blog Posts Grid */}
        <section className="pb-20 px-4 sm:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="grid sm:grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
              {posts.map((post) => (
                <article key={post.slug} className="bg-card rounded-3xl p-6 sm:p-8 border-2 border-black shadow-lg hover:shadow-xl transition-shadow">
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <time dateTime={post.date}>{formatDate(post.date)}</time>
                    <span>{post.readTime} min read</span>
                  </div>
                  
                  <h2 className="text-xl md:text-2xl font-bold text-black mb-4 leading-tight">
                    <Link 
                      href={`/blog/${post.slug}`}
                      className="hover:text-gray-700 transition-colors"
                      aria-label={`Read full article: ${post.title}`}
                    >
                      {post.title}
                    </Link>
                  </h2>
                  
                  <p className="text-gray-700 mb-6 leading-relaxed">
                    {post.excerpt}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mb-6">
                    {post.keywords.slice(0, 3).map((keyword) => (
                      <span 
                        key={keyword}
                        className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                  
                  <Link 
                    href={`/blog/${post.slug}`}
                    className="inline-flex items-center text-black font-medium hover:text-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 rounded-lg p-2 -m-2"
                    aria-label={`Read full article about ${post.title}`}
                  >
                    Read more 
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-pricing py-16 px-4 sm:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl lg:text-5xl font-medium text-black leading-tight font-title mb-6">
              Ready to optimize your 
              <br />
              mobile game revenue?
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Join leading game studios using Nandi's AI-powered dynamic stores to boost conversions and reduce platform fees.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a 
                href="/#pricing" 
                className="bg-black text-white px-8 py-4 rounded-full font-medium text-lg hover:bg-gray-800 transition-colors"
              >
                Get Early Access
              </a>
              <a 
                href="/#contact" 
                className="text-black font-medium text-lg hover:text-gray-700 transition-colors"
              >
                Learn more →
              </a>
            </div>
          </div>
        </section>
      </div>
      
      <Footer />
    </div>
  );
}