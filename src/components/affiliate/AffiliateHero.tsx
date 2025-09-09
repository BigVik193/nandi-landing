import Image from 'next/image';

export default function AffiliateHero() {
  return (
    <main className="max-w-7xl mx-auto px-8 pb-6">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        {/* Left Side - Text Content */}
        <div className="space-y-8">
          <h1 className="text-7xl lg:text-8xl xl:text-8xl font-medium text-black leading-tight font-title">
            Stop
            <br />
            leaving
            <br />
            money on
            <br />
            the table
          </h1>
          
          <p className="text-xl text-gray-700 max-w-lg leading-relaxed">
            Your traffic costs the same whether it converts at 2% or 20%. Our AI automatically optimizes your landing pages, pre-landers, and bridge pages to squeeze maximum ROI from every click—while you focus on scaling campaigns.
          </p>

          <div className="flex flex-wrap gap-4">
            <a href="https://vikrambattalapalli.gumroad.com/l/nhsjky" target="_blank" rel="noopener noreferrer" className="bg-black text-white px-8 py-4 rounded-full font-medium text-lg hover:bg-gray-800 transition-colors">
              Start Free Trial
            </a>
            <a href="#how-it-works" className="bg-white text-black border-2 border-black px-8 py-4 rounded-full font-medium text-lg hover:bg-gray-100 transition-colors">
              See How It Works
            </a>
          </div>
        </div>

        {/* Right Side - Hero Graphic */}
        <div className="relative flex flex-col items-center justify-center min-h-[600px]">
          {/* Traffic Sources Graphic */}
          <div className="relative mb-8">
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white rounded-xl p-4 shadow-lg">
                <Image
                  src="/Google_Ads_icon.png"
                  alt="Google Ads"
                  width={60}
                  height={60}
                  className="w-full h-auto object-contain"
                />
              </div>
              <div className="bg-white rounded-xl p-4 shadow-lg">
                <Image
                  src="/TikTok-Logo-2016-present.png"
                  alt="TikTok Ads"
                  width={60}
                  height={60}
                  className="w-full h-auto object-contain"
                />
              </div>
              <div className="bg-white rounded-xl p-4 shadow-lg">
                <div className="w-[60px] h-[60px] bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-2xl">f</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Conversion Rate Improvement Visual */}
          <div className="bg-white rounded-2xl p-8 shadow-xl w-full max-w-md">
            <div className="space-y-6">
              <div className="text-center">
                <p className="text-gray-600 mb-2">Campaign Performance</p>
                <div className="flex items-center justify-center space-x-4">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-red-500 line-through">2.3%</p>
                    <p className="text-sm text-gray-500">Before</p>
                  </div>
                  <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-green-500">18.7%</p>
                    <p className="text-sm text-gray-500">After Nandi</p>
                  </div>
                </div>
              </div>
              
              <div className="border-t pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">ROI Increase</span>
                  <span className="text-2xl font-bold text-green-500">+713%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}