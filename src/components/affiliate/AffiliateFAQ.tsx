'use client';

import { useState } from 'react';

const affiliateFaqs = [
  {
    question: "How is this different from other landing page optimization tools?",
    answer: "Most tools just give you A/B testing capabilities—you still have to manually create variations, analyze results, and implement changes. Nandi's AI automatically generates variations, runs tests, and optimizes in real-time without any manual work. It's like having a conversion optimization team working 24/7 on your campaigns."
  },
  {
    question: "Will this work with my existing tracking setup?",
    answer: "Yes! Nandi works with any tracker—Voluum, RedTrack, Binom, FunnelFlux, or custom solutions. You simply point your campaigns to our tracking link, and we handle the optimization while passing all data back to your tracker for reporting."
  },
  {
    question: "How quickly will I see results?",
    answer: "Most affiliates see improvements within the first week, with significant gains by week 3-4. The AI needs some initial data to learn your traffic patterns, but once it does, optimizations happen in real-time. Higher traffic volumes = faster optimization."
  },
  {
    question: "What types of offers work best with Nandi?",
    answer: "Nandi works with any offer that converts on landing pages—dating, crypto, e-commerce, lead gen, sweeps, nutra, you name it. The AI adapts to your specific vertical and learns what elements drive conversions for your audience."
  },
  {
    question: "Do I need to rebuild my landing pages?",
    answer: "Nope! Upload your existing pages and we'll optimize them. Works with HTML files, ClickFunnels pages, Unbounce, or any page builder. You can also start fresh with our page templates if you prefer."
  },
  {
    question: "How does traffic source optimization work?",
    answer: "The AI recognizes where your traffic comes from (Facebook, Google, TikTok, native, etc.) and automatically serves different page variations optimized for each source. Facebook traffic might see different angles than Google Ads traffic—maximizing performance for each channel."
  },
  {
    question: "Can I test multiple offers simultaneously?",
    answer: "Yes! With multi-offer testing, you can run different offers to the same traffic and let AI determine which converts best for different segments. Perfect for testing new offers or maximizing revenue from existing traffic."
  },
  {
    question: "Is there a minimum traffic requirement?",
    answer: "For best results, we recommend at least 100 visitors per day per page. The AI needs data to optimize effectively. Lower traffic works too, but optimization will be slower."
  },
  {
    question: "What about compliance and network restrictions?",
    answer: "You set the boundaries. Define what elements can and cannot be changed, and the AI will respect those limits. Perfect for maintaining compliance with network requirements while still optimizing performance."
  },
  {
    question: "Do you offer affiliate/referral commissions?",
    answer: "Absolutely! We have a generous affiliate program for marketers who refer other affiliates. Contact us for details about our referral commissions and promotional materials."
  }
];

export default function AffiliateFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleQuestion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="bg-pricing py-20">
      <div className="max-w-4xl mx-auto px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-5xl lg:text-6xl font-medium text-black leading-tight font-title mb-6">
            FAQ
          </h2>
          <p className="text-xl text-gray-600">
            Everything you need to know about optimizing your affiliate campaigns
          </p>
        </div>

        {/* FAQ Items */}
        <div className="space-y-0">
          {affiliateFaqs.map((faq, index) => (
            <div 
              key={index} 
              className={`border-b border-gray-200 ${index === affiliateFaqs.length - 1 ? 'border-b-0' : ''}`}
            >
              <button
                className="w-full py-6 text-left focus:outline-none focus:ring-2 focus:ring-purple-300"
                onClick={() => toggleQuestion(index)}
                aria-expanded={openIndex === index}
              >
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-black pr-8">
                    {faq.question}
                  </h3>
                  <div className="flex-shrink-0">
                    <svg 
                      className={`w-6 h-6 text-gray-500 transform transition-transform ${
                        openIndex === index ? 'rotate-180' : ''
                      }`}
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </button>
              
              {openIndex === index && (
                <div className="pb-6">
                  <div className="text-gray-700 leading-relaxed">
                    {faq.answer}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}