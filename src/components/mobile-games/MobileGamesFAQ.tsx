import MobileGamesFAQClient from './MobileGamesFAQClient';

const faqs = [
  {
    question: "How can I easily integrate in-app purchases into my mobile game?",
    answer: "Our SDK integrates once with Unity, Unreal, or Cocos and instantly connects your game to our dynamic paywall system. No complex IAP setup needed—just plug in our SDK and start testing different purchase flows, pricing, and offers without touching your game code. We handle all the heavy lifting while you focus on making great games."
  },
  {
    question: "How can I increase in-app purchases without updating my app?",
    answer: "With our dynamic paywall builder, you can test new offers, change prices, and update store layouts instantly—no app store resubmission required. Test $2.99 vs $4.99 gem packs, try different bundle combinations, or switch from grid to carousel layouts, all from your dashboard. Changes go live immediately to boost your revenue."
  },
  {
    question: "What's the best way to optimize mobile game monetization?",
    answer: "The key is continuous A/B testing of your IAP offers combined with player segmentation. Our AI automatically tests different pricing tiers, bundle sizes, and purchase flows while targeting the right offers to the right players. Free-to-play users get starter packs, while whales see premium bundles—all optimized in real-time to maximize ARPU."
  },
  {
    question: "How do I increase revenue per user (ARPU) in my mobile game?",
    answer: "ARPU increases when you show players the right offer at the right time. Our platform analyzes player behavior—progression level, spend history, session frequency—to automatically trigger personalized purchase opportunities. A player stuck on level 20 might see a power-up bundle, while a returning player gets a 'welcome back' discount pack."
  },
  {
    question: "How do I implement LiveOps and event-based monetization?",
    answer: "Our platform handles all LiveOps automation for you. Schedule limited-time offers, seasonal events, and flash sales directly from your dashboard. Halloween skin packs, double XP weekends, or 'last chance' bundles—all triggered automatically based on player behavior and optimal timing. No dev team required for execution."
  },
  {
    question: "What's the best mobile game payment integration for indie developers?",
    answer: "For indie devs, the best payment integration is one that requires minimal setup and maximum flexibility. Our SDK connects with both iOS and Android payment systems automatically, plus lets you test different pricing strategies without code changes. Start with simple gem packs, then experiment with battle passes, subscription tiers, and limited offers as you scale."
  },
  {
    question: "How can I optimize my mobile game's paywall without coding?",
    answer: "Use our visual paywall builder to create and test different purchase flows without touching code. Drag-and-drop pricing tiers, bundle offers, and promotional graphics. Test whether players prefer individual items ($1.99 per skin) versus bundles (5 skins for $7.99), all while the AI learns which combinations drive the highest revenue per user."
  },
  {
    question: "How do I track and improve mobile game retention through monetization?",
    answer: "Smart monetization actually improves retention when done right. Our analytics track not just revenue metrics (ARPU, LTV) but also how IAP purchases affect player engagement. Players who buy a starter pack often stay longer because they're more invested. We help you find the sweet spot where monetization enhances rather than hurts the player experience."
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
            Everything you need to know about mobile game monetization and IAP optimization
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
        <MobileGamesFAQClient faqs={faqs} />
      </div>
    </section>
  );
}