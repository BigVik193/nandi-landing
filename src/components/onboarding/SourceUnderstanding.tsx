'use client';

import { useState } from 'react';
import { HiDocumentSearch, HiInformationCircle, HiCheck, HiUpload, HiCode, HiCurrencyDollar, HiColorSwatch, HiSparkles, HiCog } from 'react-icons/hi';
import { FaGithub, FaGamepad, FaCoins, FaGem } from 'react-icons/fa';

interface SourceUnderstandingProps {
  onNext: (data: any) => void;
  onBack: () => void;
  userData: any;
}

export default function SourceUnderstanding({ onNext, onBack, userData }: SourceUnderstandingProps) {
  const [selectedPath, setSelectedPath] = useState<'existing' | 'new' | ''>('');
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    storePath: '',
    codebaseAnalyzed: false,
    storeRendered: false,
    liveAccessGranted: false,
    gameEntities: [] as any[],
    pricingTolerances: {} as any,
    storeBuilt: false,
    githubConnected: false,
    storeAssets: [] as string[],
    schemaFields: [] as string[],
    uiAnchors: [] as string[]
  });

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isBuilding, setIsBuilding] = useState(false);
  const [selectedStoreAreas, setSelectedStoreAreas] = useState<string[]>([]);

  // Sample game entities for demo
  const defaultEntities = [
    { id: 'gems', name: 'Gems', type: 'currency', icon: '💎', basePrice: '$1-2 per 100 gems' },
    { id: 'coins', name: 'Coins', type: 'currency', icon: '🪙', basePrice: '$1-2 per 1,000 coins' },
    { id: 'rare_skin', name: 'Rare Skins', type: 'cosmetic', icon: '🎨', basePrice: '$1-2' },
    { id: 'epic_skin', name: 'Epic Skins', type: 'cosmetic', icon: '⭐', basePrice: '$2-5' },
    { id: 'legendary_skin', name: 'Legendary Skins', type: 'cosmetic', icon: '👑', basePrice: '$5+' },
    { id: 'card_upgrades', name: 'Card Upgrades', type: 'progression', icon: '⚡', basePrice: '$1-3' }
  ];

  const handleCodebaseAnalysis = async () => {
    setIsAnalyzing(true);
    // Simulate AI codebase analysis for existing store
    setTimeout(() => {
      setFormData(prev => ({
        ...prev,
        codebaseAnalyzed: true,
        storeRendered: true,
        storeAssets: ['MainStorePanel.prefab', 'ItemCard.cs', 'BundleDisplay.unity', 'StoreBackground.png'],
        schemaFields: ['itemId', 'price', 'currency', 'category', 'rarity', 'unlockLevel'],
        uiAnchors: ['MainStore', 'ItemDetails', 'BundleSection', 'CurrencyPanel']
      }));
      setIsAnalyzing(false);
      setCurrentStep(2);
    }, 2000);
  };

  const handleNewStoreBuilder = async () => {
    setIsBuilding(true);
    // Simulate AI store building
    setTimeout(() => {
      setFormData(prev => ({
        ...prev,
        storeBuilt: true,
        githubConnected: true,
        storeAssets: ['AI-Generated Store Layout', 'Dynamic Item Grid', 'Bundle Carousel', 'Currency Display'],
        schemaFields: ['itemId', 'price', 'currency', 'category', 'availability'],
        uiAnchors: ['StoreContainer', 'ItemGrid', 'BundleArea', 'PurchasePanel']
      }));
      setIsBuilding(false);
      setCurrentStep(3);
    }, 1500);
  };

  const handleAreaSelection = (area: string) => {
    if (selectedStoreAreas.includes(area)) {
      setSelectedStoreAreas(selectedStoreAreas.filter(a => a !== area));
    } else {
      setSelectedStoreAreas([...selectedStoreAreas, area]);
    }
  };

  const handleEntityPricing = (entityId: string, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      pricingTolerances: {
        ...prev.pricingTolerances,
        [entityId]: {
          ...prev.pricingTolerances[entityId],
          [field]: value
        }
      }
    }));
  };

  const handlePathSelection = (path: 'existing' | 'new') => {
    // Both paths now go to analytics first, which then shows branching
    window.location.href = '/analytics';
  };

  const isPathComplete = () => {
    if (selectedPath === 'existing') {
      return formData.storeRendered && selectedStoreAreas.length > 0 && Object.keys(formData.pricingTolerances).length > 0;
    } else if (selectedPath === 'new') {
      return formData.storeBuilt && selectedStoreAreas.length > 0 && Object.keys(formData.pricingTolerances).length > 0;
    }
    return false;
  };

  return (
    <div className="bg-section rounded-2xl p-8 border-2 border-black shadow-lg">
      <div className="w-14 h-14 bg-purple-300 rounded-full flex items-center justify-center mb-6 mx-auto">
        <HiDocumentSearch className="w-7 h-7 text-purple-900" />
      </div>
      
      <h2 className="text-3xl font-bold mb-6 text-center text-black">Choose Your Path</h2>
      <p className="text-gray-600 text-center mb-8">
        Tell us about your current store setup to get started
      </p>
      
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {/* Existing Store Path */}
        <div 
          className="border-2 rounded-lg p-6 cursor-pointer transition-colors hover:border-purple-300 hover:bg-purple-50"
          onClick={() => handlePathSelection('existing')}
        >
          <div className="w-10 h-10 bg-green-300 rounded-full flex items-center justify-center mb-4">
            <HiCog className="w-5 h-5 text-green-800" />
          </div>
          <h4 className="font-semibold text-lg mb-2">I already have a dynamic in-game store</h4>
          <p className="text-gray-600 text-sm mb-3">
            You have server-driven store config, remote config, or cloud content delivery already set up.
          </p>
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-gray-700">Go to Entity Definition</span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-gray-700">Map entities to your codebase</span>
            </div>
          </div>
        </div>

        {/* New Store Path */}
        <div 
          className="border-2 rounded-lg p-6 cursor-pointer transition-colors hover:border-purple-300 hover:bg-purple-50"
          onClick={() => handlePathSelection('new')}
        >
          <div className="w-10 h-10 bg-blue-300 rounded-full flex items-center justify-center mb-4">
            <HiSparkles className="w-5 h-5 text-blue-800" />
          </div>
          <h4 className="font-semibold text-lg mb-2">I need a new in-game store from scratch</h4>
          <p className="text-gray-600 text-sm mb-3">
            Build a dynamic store system with AI assistance using our store builder.
          </p>
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-sm">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-gray-700">Go to Store Builder</span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-gray-700">AI-powered development</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-6">
        <button
          type="button"
          onClick={onBack}
          className="border-2 border-black text-black px-8 py-4 rounded-full font-medium text-lg hover:bg-black hover:text-white transition-colors"
        >
          Back
        </button>
      </div>
    </div>
  );
}