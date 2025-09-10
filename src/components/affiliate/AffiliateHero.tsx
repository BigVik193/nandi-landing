import Image from 'next/image';

export default function AffiliateHero() {
  return (
    <main className="h-screen flex items-center">
      <div className="max-w-7xl mx-auto px-8 w-full mt-20">
        <div className="grid lg:grid-cols-2 gap-6 items-center">
        {/* Left Side - Text Content */}
        <div className="space-y-8">
          <h1 className="text-6xl lg:text-7xl xl:text-8xl font-medium text-black leading-tight font-title">
            Stop leaving
            <br />
            money on
            <br />
            the table
          </h1>
          
          <p className="text-lg text-gray-700 max-w-lg leading-relaxed">
            Turn your 2% campaigns into 20% winners. Our AI optimizes your pages in real-time so you can focus on scaling.
          </p>

            
          <div className="flex flex-col sm:flex-row gap-4">
            <a href="https://vikrambattalapalli.gumroad.com/l/sjjmhx" target="_blank" rel="noopener noreferrer" className="bg-black text-white px-8 py-4 rounded-full font-medium text-lg hover:bg-gray-800 transition-colors text-center ring-4 ring-orange-300 ring-offset-2">
              Get Early Access - 50% Off Forever
            </a>
            <a href="#how-it-works" className="border-2 border-black text-black px-8 py-4 rounded-full font-medium text-lg hover:bg-black hover:text-white transition-colors text-center">
              See How It Works
            </a>
          </div>
        </div>

        {/* Right Side - Hero Graphic */}
        <div className="relative flex flex-col items-center justify-center">
          {/* Logo Graphic */}
          <div className="relative">
            <Image
              src="/affiliate-logo-graphic.png"
              alt="Traffic Sources"
              width={600}
              height={300}
              className="w-full max-w-md object-contain"
            />
          </div>
          
          {/* Enhanced Conversion Rate Improvement Visual */}
          <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl p-8 shadow-xl w-full max-w-lg border border-gray-100">
            <div className="space-y-6">
              {/* Header */}
              <div className="text-center">
                <div className="inline-flex items-center space-x-2 bg-gray-100 rounded-full px-4 py-2 mb-4">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-base font-medium text-gray-700">Live Campaign Data</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-6">Campaign Performance</h3>
              </div>

              {/* Before/After Comparison */}
              <div className="relative">
                <div className="flex items-center justify-between">
                  <div className="text-center flex-1">
                    <div className="relative">
                      <p className="text-4xl font-bold text-red-500 mb-3 relative">
                        2.3%
                        {/* <span className="absolute inset-0 border-b-2 border-red-400 transform rotate-12 translate-y-4"></span> */}
                      </p>
                    </div>
                    <div className="bg-red-50 rounded-lg px-4 py-2">
                      <p className="text-base font-medium text-red-600">Before</p>
                    </div>
                  </div>
                  
                  <div className="flex-shrink-0 mx-4">
                    <div className="relative">
                      <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-lg">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </div>
                      <div className="absolute -inset-1 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full opacity-30 animate-ping"></div>
                    </div>
                  </div>
                  
                  <div className="text-center flex-1">
                    <p className="text-4xl font-bold text-green-600 mb-3">18.7%</p>
                    <div className="bg-green-50 rounded-lg px-4 py-2">
                      <p className="text-base font-medium text-green-600">After Nandi</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* ROI Increase */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-5 border border-green-100">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700 font-medium text-base">ROI Increase</span>
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center">
                      <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      </svg>
                      <span className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">+713%</span>
                    </div>
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