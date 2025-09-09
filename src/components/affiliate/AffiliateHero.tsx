import Image from 'next/image';

export default function AffiliateHero() {
  return (
    <main className="max-w-7xl mx-auto px-8 py-8">
      <div className="grid lg:grid-cols-2 gap-6 items-center min-h-[90vh]">
        {/* Left Side - Text Content */}
        <div className="space-y-4">
          <h1 className="text-5xl lg:text-6xl xl:text-7xl font-medium text-black leading-tight font-title">
            Stop
            <br />
            leaving
            <br />
            money on
            <br />
            the table
          </h1>
          
          <p className="text-base text-gray-700 max-w-lg leading-relaxed">
            Turn your 2% campaigns into 20% winners. Our AI optimizes your pages in real-time so you can focus on scaling.
          </p>

          <div className="bg-orange-100 border border-orange-300 rounded-lg p-3 max-w-lg">
            <div className="flex items-center space-x-2 mb-1">
              <span className="text-xl">🚀</span>
              <span className="font-bold text-orange-800 text-sm">Early Access - 50% Off Forever</span>
            </div>
            <p className="text-orange-700 text-sm leading-tight">
              Join our founding affiliates. Help us build the perfect optimization tool.
            </p>
          </div>

          <div className="flex flex-wrap gap-4">
            <a href="https://vikrambattalapalli.gumroad.com/l/nhsjky" target="_blank" rel="noopener noreferrer" className="bg-black text-white px-10 py-5 rounded-full font-bold text-xl hover:bg-gray-800 transition-colors">
              Get Early Access - $100
            </a>
            <a href="#how-it-works" className="bg-white text-black border-2 border-black px-10 py-5 rounded-full font-bold text-xl hover:bg-gray-100 transition-colors">
              See How It Works
            </a>
          </div>
        </div>

        {/* Right Side - Hero Graphic */}
        <div className="relative flex flex-col items-center justify-center">
          {/* Traffic Sources Graphic */}
          <div className="relative mb-4">
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-white rounded-lg p-3 shadow-md flex items-center justify-center h-12">
                <Image
                  src="/Google_Ads_icon.png"
                  alt="Google Ads"
                  width={32}
                  height={32}
                  className="w-8 h-8 object-contain"
                />
              </div>
              <div className="bg-white rounded-lg p-3 shadow-md flex items-center justify-center h-12">
                <Image
                  src="/TikTok-Logo-2016-present.png"
                  alt="TikTok Ads"
                  width={32}
                  height={32}
                  className="w-8 h-8 object-contain"
                />
              </div>
              <div className="bg-white rounded-lg p-3 shadow-md flex items-center justify-center h-12">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-base">f</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Enhanced Conversion Rate Improvement Visual */}
          <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl p-6 shadow-xl w-full max-w-sm border border-gray-100">
            <div className="space-y-5">
              {/* Header */}
              <div className="text-center">
                <div className="inline-flex items-center space-x-2 bg-gray-100 rounded-full px-3 py-1 mb-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-gray-700">Live Campaign Data</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Campaign Performance</h3>
              </div>

              {/* Before/After Comparison */}
              <div className="relative">
                <div className="flex items-center justify-between">
                  <div className="text-center flex-1">
                    <div className="relative">
                      <p className="text-3xl font-bold text-red-500 mb-2 relative">
                        2.3%
                        {/* <span className="absolute inset-0 border-b-2 border-red-400 transform rotate-12 translate-y-4"></span> */}
                      </p>
                    </div>
                    <div className="bg-red-50 rounded-lg px-3 py-1">
                      <p className="text-sm font-medium text-red-600">Before</p>
                    </div>
                  </div>
                  
                  <div className="flex-shrink-0 mx-4">
                    <div className="relative">
                      <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-lg">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </div>
                      <div className="absolute -inset-1 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full opacity-30 animate-ping"></div>
                    </div>
                  </div>
                  
                  <div className="text-center flex-1">
                    <p className="text-3xl font-bold text-green-600 mb-2">18.7%</p>
                    <div className="bg-green-50 rounded-lg px-3 py-1">
                      <p className="text-sm font-medium text-green-600">After Nandi</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* ROI Increase */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-100">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700 font-medium text-sm">ROI Increase</span>
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center">
                      <svg className="w-4 h-4 text-green-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      </svg>
                      <span className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">+713%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}