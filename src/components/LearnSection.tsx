import Image from 'next/image';

export default function LearnSection() {
  return (
    <section id="features" className="bg-section py-20">
      <div className="max-w-7xl mx-auto px-8">
      <div className="grid lg:grid-cols-2 gap-16 items-center">
        {/* Left Side - Text Content */}
        <div className="lg:col-span-1 space-y-6">
          <h2 className="text-5xl lg:text-6xl font-medium text-black leading-tight font-title">
            Always learning, always optimizing
          </h2>
          
          <p className="text-xl text-gray-700 leading-relaxed">
            Nandi continuously runs experiments to find the best way to convert your customers. We're constantly testing headlines, images, color schemes, layouts, and CTAs in real-time. Using deep analytics with Bayesian models, A/B testing frameworks, and multi-armed bandit algorithms, we adapt and respond instantly to maximize your sales conversions.
          </p>
        </div>

        {/* Right Side - Stacked Variations */}
        <div className="lg:col-span-1 space-y-8">
          {/* Variation 1 - Top Left */}
          <div className="relative w-4/5 ml-0">
            <div className="absolute -top-3 -left-3 bg-black text-white px-3 py-1 rounded-full text-sm font-medium z-10">
              Variation 1
            </div>
            <Image
              src="/hero4.jpg"
              alt="Product variation testing - Variation 1"
              width={400}
              height={300}
              className="w-full rounded-2xl shadow-lg"
            />
          </div>

          {/* Variation 2 - Bottom Right */}
          <div className="relative w-4/5 ml-auto">
            <div className="absolute -top-3 -left-3 bg-black text-white px-3 py-1 rounded-full text-sm font-medium z-10">
              Variation 2
            </div>
            <Image
              src="/hero5.jpg"
              alt="Product variation testing - Variation 2"
              width={400}
              height={300}
              className="w-full rounded-2xl shadow-lg"
            />
          </div>
        </div>
      </div>
      </div>
    </section>
  );
}