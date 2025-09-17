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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalData = {
      ...formData,
      storePath: selectedPath,
      gameEntities: defaultEntities,
      selectedStoreAreas
    };
    onNext(finalData);
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
      
      {currentStep === 1 && (
        <>
          <h2 className="text-3xl font-bold mb-6 text-center text-black">Branching Onboarding Paths</h2>
          <p className="text-gray-600 text-center mb-8">
            Tell us about your current store setup to customize your experience
          </p>
          
          <form onSubmit={(e) => e.preventDefault()} className="space-y-8">
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-black border-b-2 border-black pb-2">
                What's your store situation?
              </h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                {/* Existing Store Path */}
                <div className={`border-2 rounded-lg p-6 cursor-pointer transition-colors ${
                  selectedPath === 'existing' ? 'border-purple-500 bg-purple-50' : 'border-gray-200 hover:border-purple-300'
                }`} onClick={() => setSelectedPath('existing')}>
                  <div className="flex items-start space-x-3">
                    <input
                      type="radio"
                      name="storePath"
                      value="existing"
                      checked={selectedPath === 'existing'}
                      onChange={(e) => setSelectedPath(e.target.value as 'existing')}
                      className="mt-1 w-4 h-4 text-purple-600 border-gray-300 focus:ring-purple-500"
                    />
                    <div className="flex-1">
                      <div className="w-10 h-10 bg-green-300 rounded-full flex items-center justify-center mb-3">
                        <HiCog className="w-5 h-5 text-green-800" />
                      </div>
                      <h4 className="font-semibold text-lg mb-2">I already have a dynamic in-game store</h4>
                      <p className="text-gray-600 text-sm mb-3">
                        You have server-driven store config, remote config, or cloud content delivery already set up.
                      </p>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2 text-sm">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-gray-700">Analyze existing store structure</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-gray-700">Preview your current store</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-gray-700">Grant selective SDK access</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* New Store Path */}
                <div className={`border-2 rounded-lg p-6 cursor-pointer transition-colors ${
                  selectedPath === 'new' ? 'border-purple-500 bg-purple-50' : 'border-gray-200 hover:border-purple-300'
                }`} onClick={() => setSelectedPath('new')}>
                  <div className="flex items-start space-x-3">
                    <input
                      type="radio"
                      name="storePath"
                      value="new"
                      checked={selectedPath === 'new'}
                      onChange={(e) => setSelectedPath(e.target.value as 'new')}
                      className="mt-1 w-4 h-4 text-purple-600 border-gray-300 focus:ring-purple-500"
                    />
                    <div className="flex-1">
                      <div className="w-10 h-10 bg-blue-300 rounded-full flex items-center justify-center mb-3">
                        <HiSparkles className="w-5 h-5 text-blue-800" />
                      </div>
                      <h4 className="font-semibold text-lg mb-2">I need a new in-game store from scratch</h4>
                      <p className="text-gray-600 text-sm mb-3">
                        Build a dynamic store system with AI assistance using Lovable-like interface.
                      </p>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2 text-sm">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <span className="text-gray-700">AI-powered store builder</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <span className="text-gray-700">Live rendering with your assets</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <span className="text-gray-700">GitHub integration</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {selectedPath && (
                <div className="text-center">
                  <button
                    type="button"
                    onClick={selectedPath === 'existing' ? handleCodebaseAnalysis : handleNewStoreBuilder}
                    disabled={isAnalyzing || isBuilding}
                    className="bg-purple-500 text-white px-8 py-4 rounded-full font-medium text-lg hover:bg-purple-600 transition-colors"
                  >
                    {selectedPath === 'existing' 
                      ? (isAnalyzing ? 'Analyzing Codebase...' : 'Analyze My Store')
                      : (isBuilding ? 'Building Store...' : 'Start Building')
                    }
                  </button>
                </div>
              )}
            </div>
          </form>
        </>
      )}

      {/* Existing Store Preview & Configuration */}
      {selectedPath === 'existing' && currentStep === 2 && (
        <>
          <h2 className="text-3xl font-bold mb-6 text-center text-black">Your Store Preview</h2>
          <p className="text-gray-600 text-center mb-8">
            We've analyzed your store. Click areas to grant Nandi live access for testing and optimization.
          </p>

          <div className="space-y-8">
            {/* Mock Store Preview */}
            <div className="bg-gray-100 rounded-xl p-6 border-2 border-gray-300">
              <h3 className="text-lg font-semibold mb-4 text-center">Live Store Preview</h3>
              <div className="bg-white rounded-lg p-6 shadow-inner">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {formData.uiAnchors.map((anchor, index) => (
                    <div
                      key={anchor}
                      onClick={() => handleAreaSelection(anchor)}
                      className={`border-2 rounded-lg p-4 cursor-pointer transition-all hover:shadow-lg ${
                        selectedStoreAreas.includes(anchor)
                          ? 'border-green-500 bg-green-50'
                          : 'border-gray-300 hover:border-purple-400'
                      }`}
                    >
                      <div className="text-center">
                        <div className={`w-8 h-8 mx-auto mb-2 rounded-full flex items-center justify-center ${
                          selectedStoreAreas.includes(anchor) 
                            ? 'bg-green-500 text-white' 
                            : 'bg-gray-300 text-gray-600'
                        }`}>
                          {selectedStoreAreas.includes(anchor) ? (
                            <HiCheck className="w-4 h-4" />
                          ) : (
                            <HiCog className="w-4 h-4" />
                          )}
                        </div>
                        <p className="text-sm font-medium">{anchor}</p>
                        <p className="text-xs text-gray-600 mt-1">
                          {selectedStoreAreas.includes(anchor) ? 'Access Granted' : 'Click to Grant Access'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Game Entities Definition */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-black border-b-2 border-black pb-2">
                Define Game Entities & Pricing Tolerances
              </h3>
              <div className="grid gap-4">
                {defaultEntities.map((entity) => (
                  <div key={entity.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="flex items-center space-x-4 mb-3">
                      <span className="text-2xl">{entity.icon}</span>
                      <div className="flex-1">
                        <h4 className="font-semibold">{entity.name}</h4>
                        <p className="text-sm text-gray-600 capitalize">{entity.type} • {entity.basePrice}</p>
                      </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Min Price Tolerance
                        </label>
                        <input
                          type="text"
                          placeholder="$0.50"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                          onChange={(e) => handleEntityPricing(entity.id, 'minPrice', e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Max Price Tolerance
                        </label>
                        <input
                          type="text"
                          placeholder="$10.00"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                          onChange={(e) => handleEntityPricing(entity.id, 'maxPrice', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {/* New Store Builder */}
      {selectedPath === 'new' && currentStep === 3 && (
        <>
          <h2 className="text-3xl font-bold mb-6 text-center text-black">AI Store Builder</h2>
          <p className="text-gray-600 text-center mb-8">
            Your store has been built! Click areas to grant SDK access and define your game entities.
          </p>

          <div className="space-y-8">
            {/* AI Store Builder Interface */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border-2 border-purple-300">
              <h3 className="text-lg font-semibold mb-4 text-center">🎉 Store Built Successfully!</h3>
              <div className="bg-white rounded-lg p-6 shadow-inner">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {formData.uiAnchors.map((anchor, index) => (
                    <div
                      key={anchor}
                      onClick={() => handleAreaSelection(anchor)}
                      className={`border-2 rounded-lg p-4 cursor-pointer transition-all hover:shadow-lg ${
                        selectedStoreAreas.includes(anchor)
                          ? 'border-green-500 bg-green-50'
                          : 'border-gray-300 hover:border-purple-400'
                      }`}
                    >
                      <div className="text-center">
                        <div className={`w-8 h-8 mx-auto mb-2 rounded-full flex items-center justify-center ${
                          selectedStoreAreas.includes(anchor) 
                            ? 'bg-green-500 text-white' 
                            : 'bg-gray-300 text-gray-600'
                        }`}>
                          {selectedStoreAreas.includes(anchor) ? (
                            <HiCheck className="w-4 h-4" />
                          ) : (
                            <HiSparkles className="w-4 h-4" />
                          )}
                        </div>
                        <p className="text-sm font-medium">{anchor}</p>
                        <p className="text-xs text-gray-600 mt-1">
                          {selectedStoreAreas.includes(anchor) ? 'Access Granted' : 'Click to Grant Access'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Game Entities Definition for New Store */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-black border-b-2 border-black pb-2">
                Define Game Entities & Pricing Tolerances
              </h3>
              <div className="grid gap-4">
                {defaultEntities.map((entity) => (
                  <div key={entity.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="flex items-center space-x-4 mb-3">
                      <span className="text-2xl">{entity.icon}</span>
                      <div className="flex-1">
                        <h4 className="font-semibold">{entity.name}</h4>
                        <p className="text-sm text-gray-600 capitalize">{entity.type} • {entity.basePrice}</p>
                      </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Min Price Tolerance
                        </label>
                        <input
                          type="text"
                          placeholder="$0.50"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                          onChange={(e) => handleEntityPricing(entity.id, 'minPrice', e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Max Price Tolerance
                        </label>
                        <input
                          type="text"
                          placeholder="$10.00"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                          onChange={(e) => handleEntityPricing(entity.id, 'maxPrice', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {/* Completion Summary */}
      {(currentStep > 1) && isPathComplete() && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 mt-8">
          <h3 className="font-semibold text-green-800 mb-3">Setup Complete! 🎉</h3>
          <p className="text-green-700 mb-4">
            Nandi now has {selectedPath === 'existing' ? 'analyzed your existing store' : 'built your new store'} and understands:
          </p>
          <ul className="space-y-2 text-green-700">
            <li className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>{selectedStoreAreas.length} store areas granted live access</span>
            </li>
            <li className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>{defaultEntities.length} game entities mapped with pricing tolerances</span>
            </li>
            <li className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Ready for AI-powered optimization and testing</span>
            </li>
          </ul>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-6">
        <button
          type="button"
          onClick={onBack}
          className="border-2 border-black text-black px-8 py-4 rounded-full font-medium text-lg hover:bg-black hover:text-white transition-colors"
        >
          Back
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!isPathComplete()}
          className={`px-8 py-4 rounded-full font-medium text-lg transition-colors ring-4 ring-orange-300 ring-offset-2 ${
            isPathComplete()
              ? 'bg-black text-white hover:bg-gray-800'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          Launch Your Store
        </button>
      </div>
    </div>
  );
}