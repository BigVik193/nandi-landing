export default function Navigation() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-3 bg-hero">
      <a href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
        <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
          <div className="w-4 h-4 bg-white transform rotate-45"></div>
        </div>
        <span className="text-2xl font-bold text-black">Nandi</span>
      </a>
      
      <div className="hidden md:flex items-center space-x-8 absolute left-1/2 transform -translate-x-1/2">
        <a href="#features" className="text-lg text-gray-700 hover:text-black transition-colors">Features</a>
        <a href="#personalize" className="text-lg text-gray-700 hover:text-black transition-colors">How it works</a>
        <a href="/affiliate" className="text-lg text-gray-700 hover:text-black transition-colors">For Affiliates</a>
        <a href="#contact" className="text-lg text-gray-700 hover:text-black transition-colors">Help</a>
      </div>
      
      <div className="flex items-center space-x-4">
        <a 
          href="https://discord.gg/epGst5vZ" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="bg-[#5865F2] text-white px-6 py-3 rounded-full font-medium text-lg hover:bg-[#4752C4] transition-colors flex items-center space-x-2"
        >
          <img src="/discord-logo.png" alt="Discord" className="w-5 h-5" />
          <span>Join Discord</span>
        </a>
        <a href="https://vikrambattalapalli.gumroad.com/l/nhsjky" target="_blank" rel="noopener noreferrer" className="bg-black text-white px-6 py-3 rounded-full font-medium text-lg hover:bg-gray-800 transition-colors">
          Get Early Access
        </a>
      </div>
    </nav>
  );
}