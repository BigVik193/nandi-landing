export default function AffiliatePricing() {
  return (
    <section id="pricing" className="bg-section py-20">
      <div className="max-w-7xl mx-auto px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-6xl lg:text-7xl font-medium text-black leading-tight font-title mb-6">
            Pricing that scales
            <br />
            with your success
          </h2>
          <p className="text-xl text-gray-600">
            Pay based on your traffic volume. The more you scale, the better the deal gets.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {/* Starter Plan */}
          <div className="bg-card rounded-3xl p-8 shadow-lg flex flex-col relative">
            {/* Badge Section - Fixed Height */}
            <div className="relative mb-4">
              <div className="absolute -top-11 left-0 bg-orange-500 text-white px-4 py-1 rounded-full text-sm font-bold">
                🚀 PERFECT FOR NEW AFFILIATES
              </div>
            </div>
            
            {/* Header Section - Fixed Height */}
            <div className="h-20 flex justify-between items-start mb-6">
              <h3 className="text-4xl font-bold text-black">Launch</h3>
              <div className="text-right">
                <div className="text-sm text-gray-600 mb-1">Up to 10K visits/mo</div>
                <div className="text-3xl font-bold text-black">$97<span className="text-lg text-gray-600">/mo</span></div>
              </div>
            </div>
            
            {/* Description Section - Fixed Height */}
            <div className="h-16 mb-4 flex items-start">
              <p className="text-lg text-gray-700">
                Perfect for testing new offers and verticals.
              </p>
            </div>

            <div className="border-t border-stone-200 pt-8 mb-8 flex-grow">
              <div className="grid grid-cols-1 gap-4">
                <div className="flex items-start space-x-3">
                  <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-gray-700">Up to 100 tests per month</span>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-gray-700">5 landing page slots</span>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-gray-700">Real-time optimization</span>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-gray-700">Basic analytics dashboard</span>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-gray-700">Email support</span>
                </div>
              </div>
            </div>
            
            <a href="https://vikrambattalapalli.gumroad.com/l/nhsjky" target="_blank" rel="noopener noreferrer" className="w-full bg-purple-300 hover:bg-purple-400 text-black font-medium py-4 px-6 rounded-full text-lg transition-colors mt-auto text-center inline-block">
              Start Free Trial
            </a>
          </div>

          {/* Scale Plan */}
          <div className="bg-card rounded-3xl p-8 shadow-lg flex flex-col relative border-2 border-purple-500">
            {/* Badge Section - Fixed Height */}
            <div className="relative mb-4">
              <div className="absolute -top-11 left-0 bg-purple-500 text-white px-4 py-1 rounded-full text-sm font-bold">
                ⭐ MOST POPULAR
              </div>
            </div>
            
            {/* Header Section - Fixed Height */}
            <div className="h-20 flex justify-between items-start mb-6">
              <h3 className="text-4xl font-bold text-black">Scale</h3>
              <div className="text-right">
                <div className="text-sm text-gray-600 mb-1">Up to 100K visits/mo</div>
                <div className="text-3xl font-bold text-black">$297<span className="text-lg text-gray-600">/mo</span></div>
              </div>
            </div>
            
            {/* Description Section - Fixed Height */}
            <div className="h-16 mb-4 flex items-start">
              <p className="text-lg text-gray-700">
                For affiliates ready to dominate their verticals.
              </p>
            </div>

            <div className="border-t border-stone-200 pt-8 mb-8 flex-grow">
              <div className="grid grid-cols-1 gap-4">
                <div className="flex items-start space-x-3">
                  <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-gray-700">Unlimited tests per month</span>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-gray-700">50 landing page slots</span>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-gray-700">Traffic source optimization</span>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-gray-700">Advanced analytics & insights</span>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-gray-700">Priority support + Slack access</span>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-gray-700">Multi-offer testing</span>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-gray-700">White-label option</span>
                </div>
              </div>
            </div>
            
            <a href="https://vikrambattalapalli.gumroad.com/l/nhsjky" target="_blank" rel="noopener noreferrer" className="w-full bg-black hover:bg-gray-800 text-white font-medium py-4 px-6 rounded-full text-lg transition-colors mt-auto text-center inline-block">
              Start Free Trial
            </a>
          </div>

          {/* Enterprise Plan */}
          <div className="bg-card rounded-3xl p-8 shadow-lg flex flex-col relative">
            {/* Badge Section - Fixed Height (empty for Enterprise) */}
            <div className="relative mb-4">
              <div className="absolute -top-11 left-0 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-1 rounded-full text-sm font-bold">
                💎 ENTERPRISE
              </div>
            </div>
            
            {/* Header Section - Fixed Height */}
            <div className="h-20 flex justify-between items-start mb-6">
              <h3 className="text-4xl font-bold text-black">Dominate</h3>
              <div className="text-right">
                <div className="text-sm text-gray-600 mb-1">1M+ visits/mo</div>
                <div className="text-2xl font-bold text-black">Custom</div>
              </div>
            </div>
            
            {/* Description Section - Fixed Height */}
            <div className="h-16 mb-4 flex items-start">
              <p className="text-lg text-gray-700">
                For media buying teams and affiliate networks.
              </p>
            </div>

            <div className="border-t border-stone-200 pt-8 mb-8 flex-grow">
              <div className="grid grid-cols-1 gap-4">
                <div className="flex items-start space-x-3">
                  <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-gray-700">Unlimited everything</span>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-gray-700">Includes all Scale features</span>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-gray-700">Dedicated account manager</span>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-gray-700">Custom integrations & API</span>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-gray-700">Team training & onboarding</span>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-gray-700">SLA guarantees</span>
                </div>
              </div>
            </div>
            
            <a href="#contact" className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-medium py-4 px-6 rounded-full text-lg transition-colors mt-auto text-center inline-block">
              Contact Sales
            </a>
          </div>
        </div>

        {/* Money Back Guarantee */}
        <div className="mt-16 text-center bg-white rounded-2xl p-8 shadow-lg max-w-3xl mx-auto">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.031 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
          </div>
          <h3 className="text-2xl font-bold text-black mb-3">30-Day Money-Back Guarantee</h3>
          <p className="text-gray-700">
            If Nandi doesn't improve your ROI within 30 days, we'll refund every penny. No questions asked.
          </p>
        </div>
      </div>
    </section>
  );
}