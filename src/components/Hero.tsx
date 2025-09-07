import Image from 'next/image';

export default function Hero() {
  return (
    <main className="max-w-7xl mx-auto px-8 py-12">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        {/* Left Side - Text Content */}
        <div className="space-y-8">
          <h1 className="text-7xl lg:text-8xl xl:text-8xl font-medium text-black leading-tight font-title">
            Your
            <br />
            always-
            <br />
            on growth
            <br />
            engine
          </h1>
          
          <p className="text-xl text-gray-700 max-w-lg leading-relaxed">
            Supercharge your store with our AI-powered sidekick. Elevate your sales game with real-time optimizations and seamless Shopify integration. No marketing team? No problem!
          </p>
        </div>

        {/* Right Side - Image Cards */}
        <div className="space-y-4">
          {/* Top Card - Laptop */}
          <div className="w-full h-48 rounded-2xl overflow-hidden shadow-lg">
            <Image
              src="/hero1.png"
              alt="AI-powered store optimization dashboard"
              width={400}
              height={192}
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* Middle Card - Person */}
          <div className="w-full h-48 rounded-2xl overflow-hidden shadow-lg">
            <Image
              src="/hero1.png"
              alt="Merchant working with optimized store"
              width={400}
              height={192}
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* Bottom Card - Products */}
          <div className="w-full h-32 rounded-2xl overflow-hidden shadow-lg">
            <Image
              src="/hero1.png"
              alt="Product showcase and layout optimization"
              width={400}
              height={128}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </main>
  );
}