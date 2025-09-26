'use client';

import { useState, useEffect } from 'react';
import { HiArrowLeft, HiCode } from 'react-icons/hi';
import { Navigation } from './Navigation';

interface DocsLayoutProps {
  children: React.ReactNode;
}

export function DocsLayout({ children }: DocsLayoutProps) {
  const [activeSection, setActiveSection] = useState('overview');

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Update active section based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      const sections = [
        'overview', 'getting-started', 'installation', 'initialization', 'authentication',
        'core-concepts', 'variant-selection', 'ab-testing', 'bandit-algorithms',
        'api-reference', 'initialization-api', 'variant-api', 'events-api', 'purchase-api',
        'integration-guide', 'store-integration', 'ios-storekit', 'android-billing', 'unity-iap',
        'best-practices', 'troubleshooting'
      ];

      for (const sectionId of sections) {
        const element = document.getElementById(sectionId);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 100 && rect.bottom > 100) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => window.location.href = '/dashboard'}
                className="text-gray-600 hover:text-gray-900 flex items-center space-x-2"
              >
                <HiArrowLeft className="w-5 h-5" />
                <span>Back to Dashboard</span>
              </button>
              <div className="h-6 w-px bg-gray-300"></div>
              <div className="flex items-center space-x-2">
                <HiCode className="w-6 h-6 text-indigo-600" />
                <h1 className="text-2xl font-bold text-black">Nandi SDK Documentation</h1>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-sm text-gray-500">Version 0.1.0</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex max-w-7xl mx-auto">
        {/* Sidebar Navigation */}
        <div className="w-64 sticky top-[73px] h-[calc(100vh-73px)] overflow-y-auto bg-white border-r border-gray-200 p-6">
          <Navigation 
            activeSection={activeSection} 
            onSectionClick={scrollToSection}
          />
        </div>

        {/* Main Content */}
        <div className="flex-1 px-8 py-8 max-w-4xl">
          {children}
        </div>
      </div>
    </div>
  );
}