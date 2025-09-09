import Image from 'next/image';

export default function Hero() {
  return (
    <main className="max-w-7xl mx-auto px-8 pb-6">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        {/* Left Side - Text Content */}
        <div className="space-y-8">
          <h1 className="text-7xl lg:text-8xl xl:text-8xl font-medium text-black leading-tight font-title">
            Your
            <br />
            always-on
            <br />
            Shopify
            <br />
            growth
            <br />
            engine
          </h1>
          
          <p className="text-xl text-gray-700 max-w-lg leading-relaxed">
            Supercharge your store with our AI-powered sidekick. Elevate your sales game with real-time optimizations and seamless Shopify integration. No marketing team? No problem!
          </p>
        </div>

        {/* Right Side - Hero Graphic */}
        <div className="relative flex flex-col items-center justify-center min-h-[600px]">
          {/* Logo Graphic */}
          <div className="relative">
            <Image
              src="/logo-graphic.png"
              alt="Platform integrations graphic"
              width={500}
              height={250}
              className="w-[500px] h-auto object-contain"
            />
          </div>
          
          {/* Nandi Mascot */}
          <div className="relative">
            <Image
              src="/tula-mascot.png"
              alt="Nandi AI mascot working on computer"
              width={500}
              height={500}
              className="w-[500px] h-[500px] object-contain"
            />
          </div>
        </div>
      </div>
    </main>
  );
}