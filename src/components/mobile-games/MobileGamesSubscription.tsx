// Declare global function for TypeScript
declare global {
  function gtag_report_conversion(url?: string): boolean;
}

export default function Subscription() {
  return (
    <section id="pricing" className="bg-pricing py-20">
      <div className="max-w-7xl mx-auto px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-6xl lg:text-7xl font-medium text-black leading-tight font-title mb-6">
            Revenue-share pricing
          </h2>
          <p className="text-xl text-gray-600">
            Pay only when we help you earn more — no upfront cost, no risk.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {/* Indie Plan */}
          <div className="bg-card rounded-3xl p-8 shadow-lg flex flex-col relative">
            {/* Badge Section - Fixed Height */}
            <div className="relative mb-4">
              <div className="absolute -top-11 left-0 bg-orange-500 text-white px-4 py-1 rounded-full text-sm font-bold">
                🎉 EARLY ACCESS: 50% OFF
              </div>
            </div>
            
            {/* Header Section - Fixed Height */}
            <div className="h-20 flex justify-between items-start mb-6">
              <h3 className="text-4xl font-bold text-black">Starter</h3>
              <div className="text-right">
                <div className="flex flex-col items-end">
                  <div className="text-lg text-gray-500 line-through">10%</div>
                  <div className="text-4xl font-bold text-black">5<span className="text-2xl text-gray-600">%</span></div>
                  <div className="text-sm text-gray-500">per conversion</div>
                </div>
              </div>
            </div>
            
            {/* CTA Button - Top Position */}
            <div className="mb-6">
              <a 
                href="https://vikrambattalapalli.gumroad.com/l/awfvm" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-full bg-purple-300 hover:bg-purple-400 text-black font-medium py-4 px-6 rounded-full text-lg transition-colors text-center inline-block"
                onClick={() => gtag_report_conversion('https://vikrambattalapalli.gumroad.com/l/awfvm')}
              >
                Get Early Access
              </a>
            </div>
            
            {/* Description Section - Fixed Height */}
            <div className="h-16 mb-4 flex items-start">
              <p className="text-lg text-gray-700">
                Best for indie or small studios testing paywall CRO for the first time.
              </p>
            </div>

            <div className="border-t border-stone-200 pt-8 mb-8">
              <div className="grid grid-cols-1 gap-4">
                <div className="flex items-start space-x-3">
                  <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-gray-700">Automated A/B and multivariate paywall testing</span>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-gray-700">AI-powered price & layout suggestions</span>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-gray-700">Real-time revenue uplift tracking</span>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-gray-700">Integration with App Store / Google Play</span>
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
            
          </div>

          {/* Studio Plan */}
          <div className="bg-card rounded-3xl p-8 shadow-lg flex flex-col relative">
            {/* Badge Section - Fixed Height */}
            <div className="relative mb-4">
              <div className="absolute -top-11 left-0 bg-orange-500 text-white px-4 py-1 rounded-full text-sm font-bold">
                🎉 EARLY ACCESS: 50% OFF
              </div>
            </div>
            
            {/* Header Section - Fixed Height */}
            <div className="h-20 flex justify-between items-start mb-6">
              <h3 className="text-4xl font-bold text-black">Pro</h3>
              <div className="text-right">
                <div className="flex flex-col items-end">
                  <div className="text-lg text-gray-500 line-through">5%</div>
                  <div className="text-4xl font-bold text-black">2.5<span className="text-2xl text-gray-600">%</span></div>
                  <div className="text-sm text-gray-500">per conversion</div>
                </div>
              </div>
            </div>
            
            {/* CTA Button - Top Position */}
            <div className="mb-6">
              <a 
                href="https://vikrambattalapalli.gumroad.com/l/awfvm" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-full bg-purple-300 hover:bg-purple-400 text-black font-medium py-4 px-6 rounded-full text-lg transition-colors text-center inline-block"
                onClick={() => gtag_report_conversion('https://vikrambattalapalli.gumroad.com/l/awfvm')}
              >
                Get Early Access
              </a>
            </div>
            
            {/* Description Section - Fixed Height */}
            <div className="h-16 mb-4 flex items-start">
              <p className="text-lg text-gray-700">
                For growing studios managing multiple titles.
              </p>
            </div>

            <div className="border-t border-stone-200 pt-8 mb-8">
              <div className="grid grid-cols-1 gap-4">
                <div className="flex items-start space-x-3">
                  <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-gray-700">All Starter features</span>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-gray-700">Manage multiple games under one account</span>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-gray-700">Priority support</span>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-gray-700">Advanced analytics & insights on IAP funnels</span>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-gray-700">Team collaboration access</span>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-gray-700">Custom paywall & brand optimization</span>
                </div>
              </div>
            </div>
            
          </div>

          {/* Publisher Plan */}
          <div className="bg-card rounded-3xl p-8 shadow-lg flex flex-col relative">
            {/* Badge Section - Fixed Height (empty for Publisher) */}
            <div className="relative mb-4">
            </div>
            
            {/* Header Section - Fixed Height */}
            <div className="h-20 flex justify-between items-start mb-6">
              <h3 className="text-4xl font-bold text-black">Scale</h3>
              <div className="text-right">
                <div className="text-sm text-gray-600 mb-1">For large studios</div>
                <div className="text-2xl font-bold text-black">Custom</div>
              </div>
            </div>
            
            {/* CTA Button - Top Position */}
            <div className="mb-6">
              <a href="#contact" className="w-full bg-black hover:bg-gray-800 text-white font-medium py-4 px-6 rounded-full text-lg transition-colors text-center inline-block">
                Contact us
              </a>
            </div>
            
            {/* Description Section - Fixed Height */}
            <div className="h-16 mb-4 flex items-start">
              <p className="text-lg text-gray-700">
                White-glove service for top-grossing studios and publishers.
              </p>
            </div>

            <div className="border-t border-stone-200 pt-8 mb-8">
              <div className="grid grid-cols-1 gap-4">
                <div className="flex items-start space-x-3">
                  <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-gray-700">All Pro features</span>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-gray-700">Unlimited games & paywalls</span>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-gray-700">24/7 dedicated support</span>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-gray-700">Exclusive onboarding & training</span>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-gray-700">Dedicated success manager</span>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-gray-700">Priority feature requests</span>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-gray-700">Deep BI & monetization stack integrations</span>
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </section>
  );
}