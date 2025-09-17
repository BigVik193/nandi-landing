'use client';

import { useState } from 'react';

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-hero">
      <div className="flex items-center justify-between px-4 sm:px-8 py-2">
      <a href="/mobile-games" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
        <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
          <div className="w-4 h-4 bg-white transform rotate-45"></div>
        </div>
        <span className="text-xl font-bold text-black">Nandi</span>
      </a>
      
        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-8 absolute left-1/2 transform -translate-x-1/2">
          <a href="/mobile-games#installation" className="text-base text-gray-700 hover:text-black transition-colors">Installation</a>
          <a href="/mobile-games#personalize" className="text-base text-gray-700 hover:text-black transition-colors">How it works</a>
          <a href="/onboarding/workspace" className="text-base text-gray-700 hover:text-black transition-colors">Demo</a>
          <a href="/mobile-games#contact" className="text-base text-gray-700 hover:text-black transition-colors">Help</a>
        </div>
      
        {/* Desktop CTA Buttons */}
        <div className="hidden md:flex items-center space-x-4">
          <a 
            href="https://discord.gg/uyADMgnV" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="bg-[#5865F2] text-white px-4 py-2 rounded-full font-medium text-base hover:bg-[#4752C4] transition-colors flex items-center space-x-2"
          >
            <img src="/discord-logo.png" alt="Discord" className="w-5 h-5" />
            <span>Join Discord</span>
          </a>
          <a href="https://vikrambattalapalli.gumroad.com/l/awfvm" target="_blank" rel="noopener noreferrer" className="bg-black text-white px-4 py-2 rounded-full font-medium text-base hover:bg-gray-800 transition-colors">
            Get Early Access
          </a>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden flex flex-col items-center justify-center w-8 h-8 space-y-1"
          aria-label="Toggle menu"
        >
          <div className={`w-6 h-0.5 bg-black transition-all duration-300 ${isOpen ? 'rotate-45 translate-y-2' : ''}`}></div>
          <div className={`w-6 h-0.5 bg-black transition-all duration-300 ${isOpen ? 'opacity-0' : ''}`}></div>
          <div className={`w-6 h-0.5 bg-black transition-all duration-300 ${isOpen ? '-rotate-45 -translate-y-2' : ''}`}></div>
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 shadow-lg">
          <div className="flex flex-col space-y-1 px-4 py-4">
            <a href="/mobile-games#installation" className="text-base text-gray-700 hover:text-black transition-colors py-2" onClick={() => setIsOpen(false)}>Installation</a>
            <a href="/mobile-games#personalize" className="text-base text-gray-700 hover:text-black transition-colors py-2" onClick={() => setIsOpen(false)}>How it works</a>
            <a href="/onboarding/workspace" className="text-base text-gray-700 hover:text-black transition-colors py-2" onClick={() => setIsOpen(false)}>Demo</a>
            <a href="/mobile-games#contact" className="text-base text-gray-700 hover:text-black transition-colors py-2" onClick={() => setIsOpen(false)}>Help</a>
            <div className="flex flex-col space-y-3 pt-4 border-t border-gray-200">
              <a 
                href="https://discord.gg/uyADMgnV" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="bg-[#5865F2] text-white px-4 py-2 rounded-full font-medium text-center hover:bg-[#4752C4] transition-colors flex items-center justify-center space-x-2"
                onClick={() => setIsOpen(false)}
              >
                <img src="/discord-logo.png" alt="Discord" className="w-5 h-5" />
                <span>Join Discord</span>
              </a>
              <a 
                href="https://vikrambattalapalli.gumroad.com/l/awfvm" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="bg-black text-white px-4 py-2 rounded-full font-medium text-center hover:bg-gray-800 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Get Early Access
              </a>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}