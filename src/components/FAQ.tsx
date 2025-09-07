import FAQClient from './FAQClient';

const faqs = [
  {
    question: "What is an AI conversion sidekick for Shopify?",
    answer: "Think of it like having a little growth assistant working in the background of your store 24/7. An AI conversion sidekick automatically improves your Shopify storefront by testing product images, layouts, buttons, and more—so you don't have to guess what works. Instead of wasting time tweaking themes or hiring expensive consultants, it quietly makes changes that help you sell more merch, clothing, and custom goods."
  },
  {
    question: "How does this actually help me make more money on Shopify?",
    answer: "Every store owner knows traffic is hard (and expensive) to get. The magic here is that AI helps turn more of your visitors into paying customers. It tests things like product displays, colors, and calls-to-action, then keeps the versions that convert best. That means higher Shopify conversion rates, more sales from the same traffic, and better results from your ads and marketing campaigns."
  },
  {
    question: "Who is this really built for?",
    answer: "It's built for everyday Shopify merchants who want their store to perform like the big brands—without a big team or budget. Influencers selling merch, streetwear shops, lifestyle brands, and custom gift stores all get the most out of it. If you've got products people love but feel like your store isn't converting as well as it should, this is for you."
  },
  {
    question: "What types of stores benefit the most?",
    answer: "Stores selling visual products—like t-shirts, hoodies, mugs, or personalized gifts—tend to see huge wins because design and presentation matter so much. If you run ads or promote on TikTok, Instagram, or through influencers, you'll benefit even more, because the AI makes sure all that traffic you're paying for actually turns into sales."
  },
  {
    question: "How does it work with Shopify and GA4 analytics?",
    answer: "Setup is simple: connect your Shopify store, and the AI instantly gets to work optimizing. It also plugs into Google Analytics 4 (GA4) so you can see exactly how your conversion rates and sales are trending. Instead of vague \"maybe it's working\" promises, you'll see real numbers—traffic going up, sales increasing, and revenue growing."
  },
  {
    question: "How is this different from editing my Shopify theme or using apps?",
    answer: "Theme editors and apps give you tools, but they don't tell you what actually converts. With AI, you're not just making random design tweaks—it's constantly testing and improving your storefront in real time. It's like the difference between doing your own marketing versus having a team that experiments nonstop to squeeze every extra sale out of your traffic."
  },
  {
    question: "How fast can I expect to see results?",
    answer: "Most merchants notice changes in just a few weeks. The AI runs experiments quickly, learns what your customers respond to, and keeps the winners. And the longer it runs, the smarter it gets—meaning your store keeps improving month after month."
  },
  {
    question: "Why should Shopify merchants care about conversion optimization?",
    answer: "Because traffic is expensive! You work hard (and spend hard) to get people to your store—ads, influencers, social posts. If your site isn't optimized, most of those visitors leave without buying. Conversion optimization makes sure more of them actually check out. That means you make more money without buying more ads, which is the fastest way to grow any Shopify store."
  }
];

export default function FAQ() {

  return (
    <section className="bg-section py-20">
      <div className="max-w-4xl mx-auto px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-5xl lg:text-6xl font-medium text-black leading-tight font-title mb-6">
            FAQ
          </h2>
          <p className="text-xl text-gray-600">
            Everything you need to know about boosting your Shopify conversion rates
          </p>
        </div>

        {/* Static FAQ Content for SEO - Hidden when JS is available */}
        <div className="space-y-0" id="static-faq">
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className={`border-b border-gray-200 ${index === faqs.length - 1 ? 'border-b-0' : ''}`}
              itemScope
              itemType="https://schema.org/Question"
            >
              <div className="py-6">
                <h3 
                  className="text-lg font-semibold text-black mb-4"
                  itemProp="name"
                >
                  {faq.question}
                </h3>
                <div 
                  className="text-gray-700 leading-relaxed"
                  itemScope
                  itemType="https://schema.org/Answer"
                  itemProp="acceptedAnswer"
                >
                  <div itemProp="text">
                    {faq.answer}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Interactive FAQ Component - Shown when JS is available */}
        <FAQClient faqs={faqs} />
      </div>
    </section>
  );
}