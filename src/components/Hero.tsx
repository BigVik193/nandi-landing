import Image from 'next/image';

export default function Hero() {
  return (
    <main className="h-screen flex items-center">
      <div className="max-w-7xl mx-auto px-8 w-full mt-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Text Content */}
          <div className="space-y-8">
            <h1 className="text-5xl lg:text-6xl xl:text-7xl font-medium text-black leading-tight font-title">
              Your
              <br />
              always-on
              <br />
              e-commerce
              <br />
              growth engine
            </h1>

            <p className="text-lg text-gray-700 max-w-lg leading-relaxed">
              Supercharge your store with our AI-powered sidekick. No marketing team? No problem!
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <a 
                href="#pricing" 
                className="bg-black text-white px-8 py-4 rounded-full font-medium text-lg hover:bg-gray-800 transition-colors text-center ring-4 ring-orange-300 ring-offset-2"
              >
                Get Early Access - 50% Off Forever
              </a>
              <a 
                href="https://discord.gg/epGst5vZ" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="border-2 border-black text-black px-8 py-4 rounded-full font-medium text-lg hover:bg-black hover:text-white transition-colors text-center"
              >
                Join Community
              </a>
            </div>
          </div>

          {/* Right Side - Hero Graphic */}
          <div className="relative flex flex-col items-center justify-center min-h-[500px]">
            {/* Logo Graphic */}
            <div className="relative">
              <Image
                src="/logo-graphic.png"
                alt="Platform integrations graphic"
                width={440}
                height={220}
                className="w-[440px] h-auto object-contain"
              />
            </div>
            
            {/* Nandi Mascot */}
            <div className="relative">
              <Image
                src="/tula-mascot.png"
                alt="Nandi AI mascot working on computer"
                width={380}
                height={380}
                className="w-[380px] h-[380px] object-contain"
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}