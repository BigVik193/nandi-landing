export default function AffiliateHow() {
  return (
    <section id="how-it-works" className="bg-pricing py-20">
      <div className="max-w-7xl mx-auto px-8">
        <div className="text-center mb-16">
          <h2 className="text-5xl lg:text-6xl font-medium text-black leading-tight font-title mb-6">
            How it will work
            <br />
            when we launch
          </h2>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            Simple setup, powerful results. We're building this to work with any tracking system, any traffic source, any offer.
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Step 1 */}
          <div className="relative">
            <div className="bg-white rounded-2xl p-6 shadow-lg h-full">
              <div className="absolute -top-4 -left-4 w-12 h-12 bg-black text-white rounded-full flex items-center justify-center font-bold text-xl">
                1
              </div>
              <div className="mt-4">
                <h3 className="text-xl font-bold text-black mb-3">Add your pages</h3>
                <p className="text-gray-700">
                  Upload your landing pages, pre-landers, or connect your page builder. Works with ClickFunnels, Unbounce, or custom HTML.
                </p>
              </div>
            </div>
            <div className="hidden lg:block absolute top-1/2 -right-8 transform -translate-y-1/2">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>

          {/* Step 2 */}
          <div className="relative">
            <div className="bg-white rounded-2xl p-6 shadow-lg h-full">
              <div className="absolute -top-4 -left-4 w-12 h-12 bg-black text-white rounded-full flex items-center justify-center font-bold text-xl">
                2
              </div>
              <div className="mt-4">
                <h3 className="text-xl font-bold text-black mb-3">Set your goals</h3>
                <p className="text-gray-700">
                  Define what success looks like—email submits, sales, form fills. Set your target CPA and let AI optimize toward it.
                </p>
              </div>
            </div>
            <div className="hidden lg:block absolute top-1/2 -right-8 transform -translate-y-1/2">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>

          {/* Step 3 */}
          <div className="relative">
            <div className="bg-white rounded-2xl p-6 shadow-lg h-full">
              <div className="absolute -top-4 -left-4 w-12 h-12 bg-black text-white rounded-full flex items-center justify-center font-bold text-xl">
                3
              </div>
              <div className="mt-4">
                <h3 className="text-xl font-bold text-black mb-3">Send traffic</h3>
                <p className="text-gray-700">
                  Point your campaigns to our tracking link. We'll handle split testing, optimization, and deliver visitors to winning variations.
                </p>
              </div>
            </div>
            <div className="hidden lg:block absolute top-1/2 -right-8 transform -translate-y-1/2">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>

          {/* Step 4 */}
          <div className="relative">
            <div className="bg-white rounded-2xl p-6 shadow-lg h-full">
              <div className="absolute -top-4 -left-4 w-12 h-12 bg-green-500 text-white rounded-full flex items-center justify-center font-bold text-xl">
                ✓
              </div>
              <div className="mt-4">
                <h3 className="text-xl font-bold text-black mb-3">Scale winners</h3>
                <p className="text-gray-700">
                  Watch your ROI climb as AI finds winning combinations. Scale confident that your pages keep improving automatically.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Integration Logos */}
        <div className="mt-20">
          <p className="text-center text-gray-600 mb-8">Works seamlessly with your existing stack</p>
          <div className="flex flex-wrap justify-center items-center gap-8">
            <div className="text-gray-400">
              <span className="text-2xl font-bold">ClickFunnels</span>
            </div>
            <div className="text-gray-400">
              <span className="text-2xl font-bold">Unbounce</span>
            </div>
            <div className="text-gray-400">
              <span className="text-2xl font-bold">Voluum</span>
            </div>
            <div className="text-gray-400">
              <span className="text-2xl font-bold">RedTrack</span>
            </div>
            <div className="text-gray-400">
              <span className="text-2xl font-bold">Binom</span>
            </div>
            <div className="text-gray-400">
              <span className="text-2xl font-bold">Custom HTML</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}