'use client';

import { useState, useEffect } from 'react';

interface FAQ {
  question: string;
  answer: string;
}

interface FAQClientProps {
  faqs: FAQ[];
}

export default function FAQClient({ faqs }: FAQClientProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Hide static FAQ and show interactive one
    const staticFaq = document.getElementById('static-faq');
    if (staticFaq) {
      staticFaq.style.display = 'none';
    }
    setIsVisible(true);
  }, []);

  const toggleQuestion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className="space-y-0" id="interactive-faq">
      {faqs.map((faq, index) => (
        <div 
          key={index} 
          className={`border-b border-gray-200 ${index === faqs.length - 1 ? 'border-b-0' : ''}`}
          itemScope
          itemType="https://schema.org/Question"
        >
          <button
            className="w-full py-6 text-left focus:outline-none focus:ring-2 focus:ring-purple-300"
            onClick={() => toggleQuestion(index)}
            aria-expanded={openIndex === index}
          >
            <div className="flex justify-between items-center">
              <h3 
                className="text-lg font-semibold text-black pr-8"
                itemProp="name"
              >
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
            <div 
              className="pb-6"
              itemScope
              itemType="https://schema.org/Answer"
            >
              <div 
                className="text-gray-700 leading-relaxed"
                itemProp="text"
              >
                {faq.answer}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}