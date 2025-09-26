'use client';

import { useState } from 'react';
import { HiCode, HiPlay, HiChartBar, HiCurrencyDollar, HiCheckCircle, HiExclamationCircle, HiLightningBolt, HiChevronDown, HiChevronRight } from 'react-icons/hi';

interface SubSection {
  id: string;
  title: string;
}

interface Section {
  id: string;
  title: string;
  icon?: React.ReactNode;
  subsections?: SubSection[];
}

interface NavigationProps {
  activeSection: string;
  onSectionClick: (sectionId: string) => void;
}

const sections: Section[] = [
  { 
    id: 'overview', 
    title: 'Overview',
    icon: <HiPlay className="w-5 h-5" />
  },
  { 
    id: 'getting-started', 
    title: 'Getting Started',
    icon: <HiLightningBolt className="w-5 h-5" />,
    subsections: [
      { id: 'installation', title: 'Installation' },
      { id: 'initialization', title: 'Initialization' },
      { id: 'authentication', title: 'Authentication' }
    ]
  },
  { 
    id: 'core-concepts', 
    title: 'Core Concepts',
    icon: <HiChartBar className="w-5 h-5" />,
    subsections: [
      { id: 'variant-selection', title: 'Variant Selection' },
      { id: 'ab-testing', title: 'A/B Testing' },
      { id: 'bandit-algorithms', title: 'Bandit Algorithms' }
    ]
  },
  { 
    id: 'api-reference', 
    title: 'API Reference',
    icon: <HiCode className="w-5 h-5" />,
    subsections: [
      { id: 'initialization-api', title: 'Initialization' },
      { id: 'variant-api', title: 'Getting Variants' },
      { id: 'events-api', title: 'Event Tracking' },
      { id: 'purchase-api', title: 'Purchase Tracking' }
    ]
  },
  { 
    id: 'integration-guide', 
    title: 'Integration Guide',
    icon: <HiCurrencyDollar className="w-5 h-5" />,
    subsections: [
      { id: 'store-integration', title: 'Store Integration' },
      { id: 'ios-storekit', title: 'iOS StoreKit' },
      { id: 'android-billing', title: 'Android Billing' },
      { id: 'unity-iap', title: 'Unity IAP' }
    ]
  },
  { 
    id: 'best-practices', 
    title: 'Best Practices',
    icon: <HiCheckCircle className="w-5 h-5" />
  },
  { 
    id: 'troubleshooting', 
    title: 'Troubleshooting',
    icon: <HiExclamationCircle className="w-5 h-5" />
  }
];

export function Navigation({ activeSection, onSectionClick }: NavigationProps) {
  const [expandedSections, setExpandedSections] = useState<string[]>(['getting-started', 'api-reference']);

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => 
      prev.includes(sectionId) 
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const handleSectionClick = (section: Section) => {
    onSectionClick(section.id);
    if (section.subsections) {
      toggleSection(section.id);
    }
  };

  return (
    <nav className="space-y-2">
      {sections.map(section => (
        <div key={section.id}>
          <button
            onClick={() => handleSectionClick(section)}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${
              activeSection === section.id 
                ? 'bg-indigo-50 text-indigo-600 font-medium' 
                : 'hover:bg-gray-100 text-gray-700'
            }`}
          >
            <div className="flex items-center space-x-2">
              {section.icon}
              <span className="text-sm">{section.title}</span>
            </div>
            {section.subsections && (
              expandedSections.includes(section.id) 
                ? <HiChevronDown className="w-4 h-4" />
                : <HiChevronRight className="w-4 h-4" />
            )}
          </button>
          {section.subsections && expandedSections.includes(section.id) && (
            <div className="ml-7 mt-1 space-y-1">
              {section.subsections.map(subsection => (
                <button
                  key={subsection.id}
                  onClick={() => onSectionClick(subsection.id)}
                  className={`w-full text-left px-3 py-1.5 text-sm rounded-lg transition-colors ${
                    activeSection === subsection.id
                      ? 'bg-indigo-50 text-indigo-600 font-medium'
                      : 'hover:bg-gray-100 text-gray-600'
                  }`}
                >
                  {subsection.title}
                </button>
              ))}
            </div>
          )}
        </div>
      ))}
    </nav>
  );
}