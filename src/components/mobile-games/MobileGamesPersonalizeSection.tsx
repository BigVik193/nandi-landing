import Image from 'next/image';

export default function PersonalizeSection() {
  return (
    <section id="personalize" className="bg-section py-20">
      <div className="max-w-7xl mx-auto px-8">
        {/* Title and Description */}
        <div className="text-center mb-16 space-y-6">
          <h2 className="text-5xl lg:text-6xl font-medium text-black leading-tight font-title">
            Personalized offers for every player segment
          </h2>
          
          <p className="text-xl text-gray-700 leading-relaxed max-w-4xl mx-auto">
            Every player gets targeted IAP offers based on their behavior and spending patterns. We analyze player progression, spend history, playtime, and churn risk to deliver the perfect bundle, price point, and timing that maximizes revenue from each individual player.
          </p>
        </div>
        {/* Main Layout with Personas on Left (3/7) and Single Image on Right (4/7) */}
<div className="grid lg:grid-cols-7 gap-12 lg:gap-16 items-center">
  {/* Left Side - Two Persona Sections */}
  <div className="lg:col-span-3 space-y-12 lg:space-y-16">
    {/* Kenzie Section */}
    <div className="flex flex-col items-start">
      <div className="relative w-full">
        <div className="aspect-[16/9] rounded-2xl overflow-hidden shadow-lg">
          <Image
            src="/kenzie.png"
            alt="Kenzie - Young casual gamer"
            width={400}
            height={300}
            className="w-full h-full object-cover"
          />
        </div>
        {/* Kenzie Profile Card */}
        <div className="absolute top-2 -right-2 sm:-right-4 bg-white/95 backdrop-blur-sm rounded-2xl px-4 sm:px-6 py-3 shadow-lg min-w-[180px] sm:min-w-[200px] z-10">
          <h3 className="text-lg sm:text-2xl font-semibold text-black mb-2 font-title">Kenzie</h3>
          <div className="space-y-1 text-xs sm:text-sm text-gray-700">
            <div><span className="font-medium">Segment:</span> Free-to-play</div>
            <div><span className="font-medium">Spend:</span> $0 in 7 days</div>
            <div><span className="font-medium">Level:</span> 15 (mid-game)</div>
            <div><span className="font-medium">Risk:</span> Low churn</div>
          </div>
        </div>
      </div>
    </div>

    {/* Matt Section */}
    <div className="flex flex-col items-start">
      <div className="relative w-full">
        <div className="aspect-[16/9] rounded-2xl overflow-hidden shadow-lg">
          <Image
            src="/peter.png"
            alt="Peter - Competitive gamer"
            width={400}
            height={300}
            className="w-full h-full object-cover"
          />
        </div>
        {/* Matt Profile Card */}
        <div className="absolute top-2 -right-2 sm:-right-4 bg-white/95 backdrop-blur-sm rounded-2xl px-4 sm:px-6 py-3 shadow-lg min-w-[180px] sm:min-w-[200px] z-10">
          <h3 className="text-lg sm:text-2xl font-semibold text-black mb-2 font-title">Peter</h3>
          <div className="space-y-1 text-xs sm:text-sm text-gray-700">
            <div><span className="font-medium">Segment:</span> Whale</div>
            <div><span className="font-medium">Spend:</span> $150+ lifetime</div>
            <div><span className="font-medium">Level:</span> 45 (end-game)</div>
            <div><span className="font-medium">Risk:</span> High value</div>
          </div>
        </div>
      </div>
    </div>
  </div>

  {/* Right Side - Single Full Height Image */}
  <div className="lg:col-span-4 flex items-center justify-center">
    <Image
      src="/diff-paywalls-mobile-game.png"
      alt="Different paywall variations for personalized IAP offers"
      width={600}
      height={700}
      className="w-full h-auto object-contain"
    />
  </div>
</div>


      </div>
    </section>
  );
}