import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { getBlogPost, getAllBlogPosts } from '@/lib/blog';
import MobileGamesNavigation from '@/components/mobile-games/MobileGamesNavigation';
import Footer from '@/components/Footer';

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = getAllBlogPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);

  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  return {
    title: `${post.title} | Expert Mobile Game Monetization Guide 2025`,
    description: `${post.excerpt} Learn from industry experts with proven results. Updated for 2025 mobile game market trends.`,
    keywords: post.keywords,
    authors: [{ name: 'Nandi Team', url: 'https://trynandi.com/about' }],
    creator: 'Nandi Team',
    publisher: 'Nandi',
    category: 'Mobile Game Development',
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.date,
      modifiedTime: post.date,
      authors: ['Nandi Team'],
      siteName: 'Nandi - Mobile Game Monetization Platform',
      locale: 'en_US',
      images: [
        {
          url: 'https://trynandi.com/og-image.png',
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
      tags: post.keywords,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: ['https://trynandi.com/twitter-image.png'],
      creator: '@trynandi',
    },
    alternates: {
      canonical: `https://trynandi.com/blog/${slug}`,
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
}

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}


export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = getBlogPost(slug);

  if (!post) {
    notFound();
  }

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "@id": `https://trynandi.com/blog/${post.slug}#article`,
        "isPartOf": {
          "@id": `https://trynandi.com/blog/${post.slug}#webpage`
        },
        "headline": post.title,
        "description": post.excerpt,
        "image": {
          "@type": "ImageObject",
          "url": "https://trynandi.com/og-image.png",
          "width": 1200,
          "height": 630
        },
        "author": {
          "@type": "Organization",
          "name": "Nandi",
          "url": "https://trynandi.com",
          "logo": {
            "@type": "ImageObject",
            "url": "https://trynandi.com/favicon.ico"
          }
        },
        "publisher": {
          "@type": "Organization",
          "name": "Nandi",
          "logo": {
            "@type": "ImageObject",
            "url": "https://trynandi.com/favicon.ico"
          }
        },
        "datePublished": post.date,
        "dateModified": post.date,
        "mainEntityOfPage": {
          "@type": "WebPage",
          "@id": `https://trynandi.com/blog/${post.slug}#webpage`
        },
        "keywords": post.keywords.join(", "),
        "articleSection": "Mobile Game Monetization",
        "wordCount": post.content.split(' ').length,
        "timeRequired": `PT${post.readTime}M`,
        "inLanguage": "en-US",
        "about": [
          {
            "@type": "Thing",
            "name": "Mobile Game Monetization",
            "description": "Strategies and techniques for increasing revenue from mobile games"
          },
          {
            "@type": "Thing", 
            "name": "App Store Fees",
            "description": "Commission fees charged by Apple App Store and Google Play Store"
          },
          {
            "@type": "Thing",
            "name": "Dynamic In-Game Stores",
            "description": "AI-powered systems that automatically optimize in-game purchases and pricing"
          },
          {
            "@type": "Thing",
            "name": "Game Revenue Optimization",
            "description": "Methods to increase Average Revenue Per User (ARPU) in mobile games"
          }
        ],
        "mentions": [
          {
            "@type": "SoftwareApplication",
            "name": "Nandi",
            "applicationCategory": "Mobile Game Monetization Platform",
            "operatingSystem": "Web-based"
          }
        ]
      },
      {
        "@type": "WebPage",
        "@id": `https://trynandi.com/blog/${post.slug}#webpage`,
        "url": `https://trynandi.com/blog/${post.slug}`,
        "name": post.title,
        "isPartOf": {
          "@id": "https://trynandi.com/blog#blog"
        },
        "primaryImageOfPage": {
          "@type": "ImageObject",
          "url": "https://trynandi.com/og-image.png"
        },
        "datePublished": post.date,
        "dateModified": post.date,
        "breadcrumb": {
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
            },
            {
              "@type": "ListItem",
              "position": 3,
              "name": post.title,
              "item": `https://trynandi.com/blog/${post.slug}`
            }
          ]
        }
      },
      {
        "@type": "HowTo",
        "name": `How to ${post.title.toLowerCase().replace(/^how to /, '')}`,
        "description": post.excerpt,
        "image": "https://trynandi.com/og-image.png",
        "totalTime": `PT${post.readTime}M`,
        "estimatedCost": {
          "@type": "MonetaryAmount",
          "currency": "USD",
          "value": "0"
        },
        "supply": [
          {
            "@type": "HowToSupply",
            "name": "Mobile game with in-app purchases"
          },
          {
            "@type": "HowToSupply", 
            "name": "Game development team"
          }
        ],
        "tool": [
          {
            "@type": "HowToTool",
            "name": "Nandi Platform"
          },
          {
            "@type": "HowToTool",
            "name": "Analytics Dashboard"
          }
        ]
      }
    ]
  };

  return (
    <div className="min-h-screen bg-section">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <MobileGamesNavigation />
      
      <div className="pt-20">
        {/* Breadcrumb */}
        <div className="px-4 sm:px-8 py-6">
          <div className="max-w-4xl mx-auto">
            <nav className="text-sm">
              <Link href="/blog" className="text-gray-600 hover:text-black transition-colors">
                Blog
              </Link>
              <span className="mx-2 text-gray-400">/</span>
              <span className="text-black">{post.title}</span>
            </nav>
          </div>
        </div>

        {/* Article Header */}
        <header className="px-4 sm:px-8 pb-12">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between text-sm text-gray-500 mb-6">
              <time dateTime={post.date}>{formatDate(post.date)}</time>
              <span>{post.readTime} min read</span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-medium text-black leading-tight font-title mb-6">
              {post.title}
            </h1>
            
            <p className="text-lg sm:text-xl text-gray-600 leading-relaxed mb-8">
              {post.excerpt}
            </p>
            
            <div className="flex flex-wrap gap-2">
              {post.keywords.map((keyword) => (
                <span 
                  key={keyword}
                  className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                >
                  {keyword}
                </span>
              ))}
            </div>
          </div>
        </header>

        {/* Article Content */}
        <article className="px-4 sm:px-8 pb-16">
          <div className="max-w-4xl mx-auto">
            <div className="prose prose-base md:prose-lg max-w-none prose-headings:text-black prose-headings:font-bold prose-h2:text-2xl prose-h2:md:text-3xl prose-h2:mt-8 prose-h2:mb-4 prose-p:text-gray-700 prose-p:leading-relaxed prose-p:text-base prose-p:md:text-lg prose-strong:text-black prose-strong:font-bold prose-a:text-black prose-a:font-medium hover:prose-a:text-gray-700 prose-a:no-underline hover:prose-a:underline prose-a:focus:outline-none prose-a:focus:ring-2 prose-a:focus:ring-black prose-a:focus:ring-offset-2 prose-ul:text-gray-700 prose-li:leading-relaxed prose-li:text-base prose-li:md:text-lg prose-table:text-sm prose-table:md:text-base">
              <ReactMarkdown 
                remarkPlugins={[remarkGfm]}
                components={{
                  h1: ({ children }) => <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-black mb-4 mt-8">{children}</h1>,
                  h2: ({ children }) => <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-black mb-4 mt-8">{children}</h2>,
                  h3: ({ children }) => <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-black mb-3 mt-6">{children}</h3>,
                  p: ({ children }) => <p className="text-base md:text-lg text-gray-700 leading-relaxed mb-4">{children}</p>,
                  ul: ({ children }) => <ul className="list-disc list-inside space-y-2 mb-4 text-gray-700">{children}</ul>,
                  ol: ({ children }) => <ol className="list-decimal list-inside space-y-2 mb-4 text-gray-700">{children}</ol>,
                  li: ({ children }) => <li className="text-base md:text-lg leading-relaxed">{children}</li>,
                  strong: ({ children }) => <strong className="font-bold text-black">{children}</strong>,
                  a: ({ href, children }) => (
                    <a 
                      href={href} 
                      className="text-black font-medium hover:text-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 rounded underline"
                      target={href?.startsWith('http') ? '_blank' : undefined}
                      rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
                    >
                      {children}
                    </a>
                  ),
                  table: ({ children }) => (
                    <div className="overflow-x-auto mb-6">
                      <table className="min-w-full border-collapse border border-gray-300 text-sm md:text-base">
                        {children}
                      </table>
                    </div>
                  ),
                  th: ({ children }) => <th className="border border-gray-300 bg-gray-50 px-3 py-2 text-left font-bold text-black">{children}</th>,
                  td: ({ children }) => <td className="border border-gray-300 px-3 py-2 text-gray-700">{children}</td>,
                }}
              >
                {post.content}
              </ReactMarkdown>
            </div>
          </div>
        </article>

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

        {/* Back to Blog */}
        <section className="py-12 px-4 sm:px-8">
          <div className="max-w-4xl mx-auto">
            <Link 
              href="/blog"
              className="inline-flex items-center text-black font-medium hover:text-gray-700 transition-colors"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Blog
            </Link>
          </div>
        </section>
      </div>
      
      <Footer />
    </div>
  );
}