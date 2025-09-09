export default function AffiliateNavigation() {
  return (
    <nav className="flex items-center justify-between px-8 pt-4">
      <div className="flex items-center space-x-2">
        <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
          <div className="w-4 h-4 bg-white transform rotate-45"></div>
        </div>
        <span className="text-2xl font-bold text-black">Nandi</span>
      </div>
      
      <div className="hidden md:flex items-center space-x-8">
        <a href="#benefits" className="text-lg text-gray-700 hover:text-black transition-colors">Benefits</a>
        <a href="#how-it-works" className="text-lg text-gray-700 hover:text-black transition-colors">How it works</a>
        <a href="#pricing" className="text-lg text-gray-700 hover:text-black transition-colors">Pricing</a>
        <a href="#contact" className="text-lg text-gray-700 hover:text-black transition-colors">Contact</a>
      </div>
      
      <a href="https://vikrambattalapalli.gumroad.com/l/nhsjky" target="_blank" rel="noopener noreferrer" className="bg-black text-white px-6 py-3 rounded-full font-medium text-lg hover:bg-gray-800 transition-colors">
        Get Early Access
      </a>
    </nav>
  );
}