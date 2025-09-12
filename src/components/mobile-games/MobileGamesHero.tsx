import Image from 'next/image';

export default function Hero() {
  return (
    <main className="min-h-screen flex items-center pt-24 pb-20 sm:pt-20 sm:pb-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left Side - Text Content */}
          <div className="space-y-6 sm:space-y-8 text-center lg:text-left">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-medium text-black leading-tight font-title">
              Maximize
              <br />
              revenue per
              <br />
              player with
              <br />
              AI-powered
              <br/>
              conversions
            </h1>

            
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <a 
                href="#pricing" 
                className="bg-black text-white px-8 py-4 rounded-full font-medium text-lg hover:bg-gray-800 transition-colors text-center ring-4 ring-orange-300 ring-offset-2"
              >
                Get Early Access - 50% Off Forever
              </a>
              <a 
                href="https://discord.gg/uyADMgnV" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="border-2 border-black text-black px-8 py-4 rounded-full font-medium text-lg hover:bg-black hover:text-white transition-colors text-center"
              >
                Join Community
              </a>
            </div>
          </div>

          {/* Right Side - Hero Graphic */}
          <div className="relative flex items-center justify-center w-full">
            <div className="w-full max-w-sm sm:max-w-lg lg:max-w-full max-h-[50vh] sm:max-h-[60vh] lg:max-h-[70vh]">
              <Image
                src="/gaming-hero.png"
                alt="Gaming IAP optimization dashboard showing +235% conversions and -36% first purchase delay"
                width={800}
                height={600}
                className="w-full h-auto max-h-[50vh] sm:max-h-[60vh] lg:max-h-[70vh] object-contain"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}