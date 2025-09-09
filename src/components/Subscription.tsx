export default function Subscription() {
  return (
    <section id="pricing" className="bg-pricing py-20">
      <div className="max-w-7xl mx-auto px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-6xl lg:text-7xl font-medium text-black leading-tight font-title mb-6">
            Flexible pricing
            <br />
            for every stage
          </h2>
          <p className="text-xl text-gray-600">
            Simple plans. Real growth. Pick yours.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {/* Starter Plan */}
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
                <div className="text-sm text-gray-600 mb-1">Starting at</div>
                <div className="flex flex-col items-end">
                  <div className="text-lg text-gray-500 line-through">$100/mo</div>
                  <div className="text-3xl font-bold text-black">$50<span className="text-lg text-gray-600">/mo</span></div>
                </div>
              </div>
            </div>
            
            {/* Description Section - Fixed Height */}
            <div className="h-16 mb-4 flex items-start">
              <p className="text-lg text-gray-700">
                Boost your sales with essential CRO tools.
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
                  <span className="text-gray-700">Up to 30 tests per month</span>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-gray-700">AI-powered enhancements</span>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-gray-700">Real-time store updates</span>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-gray-700">Seamless Shopify integration</span>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-gray-700">Email support</span>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-gray-700">Automated A/B testing</span>
                </div>
              </div>
            </div>
            
            <a href="https://vikrambattalapalli.gumroad.com/l/nhsjky" target="_blank" rel="noopener noreferrer" className="w-full bg-purple-300 hover:bg-purple-400 text-black font-medium py-4 px-6 rounded-full text-lg transition-colors mt-auto text-center inline-block">
              Pledge
            </a>
          </div>

          {/* Pro Plan */}
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
                <div className="text-sm text-gray-600 mb-1">Starting at</div>
                <div className="flex flex-col items-end">
                  <div className="text-lg text-gray-500 line-through">$300/mo</div>
                  <div className="text-3xl font-bold text-black">$150<span className="text-lg text-gray-600">/mo</span></div>
                </div>
              </div>
            </div>
            
            {/* Description Section - Fixed Height */}
            <div className="h-16 mb-4 flex items-start">
              <p className="text-lg text-gray-700">
                Elevate your growth with premium features.
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
                  <span className="text-gray-700">Up to 150 tests per month</span>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-gray-700">Includes all Starter features</span>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-gray-700">Priority customer support</span>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-gray-700">Manage multiple stores</span>
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
                  <span className="text-gray-700">Team collaboration access</span>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-gray-700">Custom brand optimization</span>
                </div>
              </div>
            </div>
            
            <a href="https://vikrambattalapalli.gumroad.com/l/nhsjky" target="_blank" rel="noopener noreferrer" className="w-full bg-purple-300 hover:bg-purple-400 text-black font-medium py-4 px-6 rounded-full text-lg transition-colors mt-auto text-center inline-block">
              Pledge
            </a>
          </div>

          {/* Scale Plan */}
          <div className="bg-card rounded-3xl p-8 shadow-lg flex flex-col relative">
            {/* Badge Section - Fixed Height (empty for Scale) */}
            <div className="relative mb-4">
            </div>
            
            {/* Header Section - Fixed Height */}
            <div className="h-20 flex justify-between items-start mb-6">
              <h3 className="text-4xl font-bold text-black">Scale</h3>
              <div className="text-right">
                <div className="text-sm text-gray-600 mb-1">For large stores</div>
                <div className="text-2xl font-bold text-black">Custom</div>
              </div>
            </div>
            
            {/* Description Section - Fixed Height */}
            <div className="h-16 mb-4 flex items-start">
              <p className="text-lg text-gray-700">
                White-glove service for high-volume Shopify stores.
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
                  <span className="text-gray-700">Unlimited tests & stores</span>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-gray-700">Includes all Pro features</span>
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
                  <span className="text-gray-700">Exclusive onboarding</span>
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
                  <span className="text-gray-700">Custom integrations</span>
                </div>
              </div>
            </div>
            
            <a href="#contact" className="w-full bg-black hover:bg-gray-800 text-white font-medium py-4 px-6 rounded-full text-lg transition-colors mt-auto text-center inline-block">
              Contact us
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}