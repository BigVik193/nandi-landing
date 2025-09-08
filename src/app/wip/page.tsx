import Link from 'next/link';

export default function WorkInProgress() {
  return (
    <div className="min-h-screen bg-hero flex items-center justify-center px-8">
      <div className="max-w-2xl mx-auto text-center space-y-8">
        {/* Logo */}
        <div className="flex items-center justify-center space-x-2 mb-8">
          <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center">
            <div className="w-6 h-6 bg-white transform rotate-45"></div>
          </div>
          <span className="text-4xl font-bold text-black">Nandi</span>
        </div>

        {/* Main Content */}
        <div className="space-y-6">
          <h1 className="text-5xl lg:text-6xl font-medium text-black leading-tight font-title">
            We're still working on this
          </h1>
          
          <p className="text-xl text-gray-700 leading-relaxed max-w-lg mx-auto">
            This page is under construction. We're building something amazing for you. 
            In the meantime, check out what we already have ready!
          </p>
        </div>

        {/* Action Button */}
        <div className="pt-8">
          <Link 
            href="/"
            className="inline-flex items-center space-x-2 bg-black text-white px-8 py-4 rounded-full font-medium text-lg hover:bg-gray-800 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Back to Home</span>
          </Link>
        </div>

        {/* Decoration */}
        <div className="pt-12">
          <div className="flex justify-center space-x-2">
            <div className="w-2 h-2 bg-black rounded-full animate-pulse"></div>
            <div className="w-2 h-2 bg-black rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
            <div className="w-2 h-2 bg-black rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
          </div>
        </div>
      </div>
    </div>
  );
}