import Image from 'next/image';
import { HiSparkles } from 'react-icons/hi2';

export default function PersonalizeSection() {
  return (
    <section id="personalize" className="bg-section py-20">
      <div className="max-w-7xl mx-auto px-8">
        {/* Title and Description */}
        <div className="text-center mb-16 space-y-6">
          <h2 className="text-5xl lg:text-6xl font-medium text-black leading-tight font-title">
            Personalized for every visitor
          </h2>
          
          <p className="text-xl text-gray-700 leading-relaxed max-w-4xl mx-auto">
            Every customer gets a unique, optimized experience tailored in real-time. We analyze how they found you—Google Ads, TikTok, Facebook, organic search—along with their location, time of day, device, and behavior patterns to deliver the perfect storefront that maximizes conversions and sales for each individual visitor.
          </p>
        </div>

        {/* Two Persona Sections - Vertical Stack */}
        <div className="w-full space-y-12 lg:space-y-16">
          {/* Kenzie Section */}
          <div className="flex flex-col lg:flex-row items-center gap-6 lg:gap-8">
            <div className="relative w-full lg:flex-1 max-w-md lg:max-w-none">
              <div className="aspect-[16/9] rounded-2xl overflow-hidden shadow-lg">
                <Image
                  src="/kenzie.png"
                  alt="Kenzie - Young woman with beanie"
                  width={400}
                  height={300}
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Kenzie Profile Card */}
              <div className="absolute top-2 -right-2 sm:-right-4 lg:-right-8 bg-white/95 backdrop-blur-sm rounded-2xl px-4 sm:px-6 py-3 shadow-lg min-w-[180px] sm:min-w-[200px] z-10">
                <h3 className="text-lg sm:text-2xl font-semibold text-black mb-2 font-title">Kenzie</h3>
                <div className="space-y-1 text-xs sm:text-sm text-gray-700">
                  <div><span className="font-medium">Segment:</span> Outdoor lifestyle</div>
                  <div><span className="font-medium">RFM:</span> Frequent buyer</div>
                  <div><span className="font-medium">Channel:</span> TikTok Ad</div>
                  <div><span className="font-medium">Favorite Style:</span> Gorpcore</div>
                </div>
              </div>
            </div>
            
            {/* AI Sparkle Graphic */}
            <div className="flex items-center justify-center px-4 lg:px-8 py-4 flex-shrink-0">
              <div className="w-12 h-12 lg:w-16 lg:h-16 border-2 border-gray-400 rounded-full flex items-center justify-center">
                <HiSparkles className="w-6 h-6 lg:w-8 lg:h-8 text-gray-600" />
              </div>
            </div>
            
            {/* Kenzie's Landing Page */}
            <div className="w-full lg:flex-1 max-w-md lg:max-w-none">
              <div className="aspect-[16/9] rounded-2xl overflow-hidden shadow-lg">
                <Image
                  src="/hero1.png"
                  alt="Kenzie's personalized landing page"
                  width={400}
                  height={300}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* Matt Section */}
          <div className="flex flex-col lg:flex-row items-center gap-6 lg:gap-8">
            <div className="relative w-full lg:flex-1 max-w-md lg:max-w-none">
              <div className="aspect-[16/9] rounded-2xl overflow-hidden shadow-lg">
                <Image
                  src="/matt.png"
                  alt="Matt - Young professional with laptop"
                  width={400}
                  height={300}
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Matt Profile Card */}
              <div className="absolute top-2 -right-2 sm:-right-4 lg:-right-8 bg-white/95 backdrop-blur-sm rounded-2xl px-4 sm:px-6 py-3 shadow-lg min-w-[180px] sm:min-w-[200px] z-10">
                <h3 className="text-lg sm:text-2xl font-semibold text-black mb-2 font-title">Matt</h3>
                <div className="space-y-1 text-xs sm:text-sm text-gray-700">
                  <div><span className="font-medium">Segment:</span> Tech enthusiast</div>
                  <div><span className="font-medium">RFM:</span> High value customer</div>
                  <div><span className="font-medium">Channel:</span> Google Ad</div>
                  <div><span className="font-medium">Favorite Style:</span> Streetwear</div>
                </div>
              </div>
            </div>
            
            {/* AI Sparkle Graphic */}
            <div className="flex items-center justify-center px-4 lg:px-8 py-4 flex-shrink-0">
              <div className="w-12 h-12 lg:w-16 lg:h-16 border-2 border-gray-400 rounded-full flex items-center justify-center">
                <HiSparkles className="w-6 h-6 lg:w-8 lg:h-8 text-gray-600" />
              </div>
            </div>
            
            {/* Matt's Landing Page */}
            <div className="w-full lg:flex-1 max-w-md lg:max-w-none">
              <div className="aspect-[16/9] rounded-2xl overflow-hidden shadow-lg">
                <Image
                  src="/hero2.png"
                  alt="Matt's personalized landing page"
                  width={400}
                  height={300}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}