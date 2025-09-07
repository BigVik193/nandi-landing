export default function Navigation() {
  return (
    <nav className="flex items-center justify-between px-8 pt-4">
      <div className="flex items-center space-x-2">
        <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
          <div className="w-4 h-4 bg-white transform rotate-45"></div>
        </div>
        <span className="text-2xl font-bold text-black">Tula</span>
      </div>
      
      <div className="hidden md:flex items-center space-x-8">
        <a href="#features" className="text-lg text-gray-700 hover:text-black transition-colors">Features</a>
        <a href="#personalize" className="text-lg text-gray-700 hover:text-black transition-colors">How it works</a>
        <a href="#contact" className="text-lg text-gray-700 hover:text-black transition-colors">Help</a>
      </div>
      
      <button className="bg-black text-white px-6 py-3 rounded-full font-medium text-lg hover:bg-gray-800 transition-colors">
        Pledge
      </button>
    </nav>
  );
}