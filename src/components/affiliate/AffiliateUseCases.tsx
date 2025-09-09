import Image from 'next/image';

export default function AffiliateUseCases() {
  return (
    <section className="bg-pricing py-20">
      <div className="max-w-7xl mx-auto px-8">
        <div className="text-center mb-16">
          <h2 className="text-5xl lg:text-6xl font-medium text-black leading-tight font-title mb-6">
            Works with every vertical
          </h2>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            From high-ticket to impulse buys, our AI adapts to your offer's unique conversion patterns
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* E-commerce/Dropshipping */}
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <div className="flex items-start space-x-6">
              <div className="w-16 h-16 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-black mb-3">E-commerce & Dropshipping</h3>
                <p className="text-gray-700 mb-4">
                  Perfect for product landing pages, advertorials, and pre-sell pages. Test product angles, urgency tactics, and social proof elements.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-orange-50 text-orange-700 rounded-full text-sm">Product pages</span>
                  <span className="px-3 py-1 bg-orange-50 text-orange-700 rounded-full text-sm">Advertorials</span>
                  <span className="px-3 py-1 bg-orange-50 text-orange-700 rounded-full text-sm">Upsells</span>
                </div>
              </div>
            </div>
          </div>

          {/* Lead Generation */}
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <div className="flex items-start space-x-6">
              <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-black mb-3">Lead Generation</h3>
                <p className="text-gray-700 mb-4">
                  Optimize form layouts, qualifying questions, and value propositions. Perfect for insurance, solar, home services, and education offers.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">Multi-step forms</span>
                  <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">Quiz funnels</span>
                  <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">CPL optimization</span>
                </div>
              </div>
            </div>
          </div>

          {/* Dating & Social */}
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <div className="flex items-start space-x-6">
              <div className="w-16 h-16 bg-pink-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <svg className="w-8 h-8 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-black mb-3">Dating & Social</h3>
                <p className="text-gray-700 mb-4">
                  Test profile previews, registration flows, and engagement hooks. Optimize for both free signups and paid conversions.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-pink-50 text-pink-700 rounded-full text-sm">Registration pages</span>
                  <span className="px-3 py-1 bg-pink-50 text-pink-700 rounded-full text-sm">Profile teasers</span>
                  <span className="px-3 py-1 bg-pink-50 text-pink-700 rounded-full text-sm">Chat previews</span>
                </div>
              </div>
            </div>
          </div>

          {/* Crypto & Finance */}
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <div className="flex items-start space-x-6">
              <div className="w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-black mb-3">Crypto & Trading</h3>
                <p className="text-gray-700 mb-4">
                  Optimize trust signals, profit calculators, and urgency elements. Perfect for trading platforms, crypto offers, and investment opportunities.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm">VSLs</span>
                  <span className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm">Calculators</span>
                  <span className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm">Trust badges</span>
                </div>
              </div>
            </div>
          </div>

          {/* Sweepstakes */}
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <div className="flex items-start space-x-6">
              <div className="w-16 h-16 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-black mb-3">Sweepstakes & Prizes</h3>
                <p className="text-gray-700 mb-4">
                  Test prize displays, countdown timers, and entry mechanics. Maximize both email captures and credit card submissions.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-sm">Prize pages</span>
                  <span className="px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-sm">Surveys</span>
                  <span className="px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-sm">CC submits</span>
                </div>
              </div>
            </div>
          </div>

          {/* Nutra & Health */}
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <div className="flex items-start space-x-6">
              <div className="w-16 h-16 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-black mb-3">Nutra & Health</h3>
                <p className="text-gray-700 mb-4">
                  Optimize testimonials, before/after images, and scientific claims. Perfect for supplements, CBD, skincare, and wellness offers.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-red-50 text-red-700 rounded-full text-sm">Advertorials</span>
                  <span className="px-3 py-1 bg-red-50 text-red-700 rounded-full text-sm">VSLs</span>
                  <span className="px-3 py-1 bg-red-50 text-red-700 rounded-full text-sm">Testimonials</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}