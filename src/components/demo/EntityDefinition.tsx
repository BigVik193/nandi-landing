'use client';

import { useState } from 'react';
import { HiCurrencyDollar, HiColorSwatch, HiSparkles, HiCheck, HiCode, HiSearch } from 'react-icons/hi';
import { FaCoins, FaGem, FaCrown, FaPalette } from 'react-icons/fa';

interface EntityDefinitionProps {
  onNext: (data: any) => void;
  onBack: () => void;
  userData: any;
}

export default function EntityDefinition({ onNext, onBack, userData }: EntityDefinitionProps) {
  const [selectedEntity, setSelectedEntity] = useState<string | null>(null);
  const [entityDefinitions, setEntityDefinitions] = useState<{[key: string]: any}>({});
  const [searchCode, setSearchCode] = useState('');

  // Sample game entities
  const gameEntities = [
    { 
      id: 'gems', 
      name: 'Gems', 
      type: 'currency', 
      icon: '💎', 
      description: 'Premium currency for special purchases',
      basePrice: '$1-2 per 100 gems',
      color: 'bg-purple-100 border-purple-300 text-purple-800'
    },
    { 
      id: 'coins', 
      name: 'Coins', 
      type: 'currency', 
      icon: '🪙', 
      description: 'Basic in-game currency for regular items',
      basePrice: '$1-2 per 1,000 coins',
      color: 'bg-yellow-100 border-yellow-300 text-yellow-800'
    },
    { 
      id: 'rare_skins', 
      name: 'Rare Skins', 
      type: 'cosmetic', 
      icon: '🎨', 
      description: 'Character skins with rare rarity',
      basePrice: '$1-2',
      color: 'bg-blue-100 border-blue-300 text-blue-800'
    },
    { 
      id: 'epic_skins', 
      name: 'Epic Skins', 
      type: 'cosmetic', 
      icon: '⭐', 
      description: 'Character skins with epic rarity',
      basePrice: '$2-5',
      color: 'bg-indigo-100 border-indigo-300 text-indigo-800'
    },
    { 
      id: 'legendary_skins', 
      name: 'Legendary Skins', 
      type: 'cosmetic', 
      icon: '👑', 
      description: 'Character skins with legendary rarity',
      basePrice: '$5+',
      color: 'bg-orange-100 border-orange-300 text-orange-800'
    },
    { 
      id: 'card_upgrades', 
      name: 'Card Upgrades', 
      type: 'progression', 
      icon: '⚡', 
      description: 'Upgrade materials for card progression',
      basePrice: '$1-3',
      color: 'bg-green-100 border-green-300 text-green-800'
    }
  ];

  // Sample codebase files
  const codebaseFiles = [
    {
      name: 'StoreManager.cs',
      path: '/Scripts/Store/StoreManager.cs',
      type: 'C#',
      content: `public class StoreManager : MonoBehaviour {
    [Header("Currency Settings")]
    public int gemPrice = 100;
    public int coinValue = 1000;
    
    [Header("Item Definitions")]
    public List<StoreItem> availableItems;
    public List<Skin> characterSkins;
    
    public void PurchaseGems(int amount) {
        // Gem purchase logic
        PlayerCurrency.AddGems(amount);
    }
    
    public void PurchaseCoins(int amount) {
        // Coin purchase logic  
        PlayerCurrency.AddCoins(amount);
    }
    
    public void UnlockSkin(string skinId) {
        // Skin unlock logic
        PlayerInventory.AddSkin(skinId);
    }
}`
    },
    {
      name: 'PlayerCurrency.cs', 
      path: '/Scripts/Player/PlayerCurrency.cs',
      type: 'C#',
      content: `public static class PlayerCurrency {
    public static int Gems { get; private set; }
    public static int Coins { get; private set; }
    
    public static void AddGems(int amount) {
        Gems += amount;
        OnCurrencyChanged?.Invoke();
    }
    
    public static void AddCoins(int amount) {
        Coins += amount;
        OnCurrencyChanged?.Invoke();
    }
    
    public static bool SpendGems(int amount) {
        if (Gems >= amount) {
            Gems -= amount;
            OnCurrencyChanged?.Invoke();
            return true;
        }
        return false;
    }
}`
    },
    {
      name: 'SkinManager.cs',
      path: '/Scripts/Cosmetics/SkinManager.cs', 
      type: 'C#',
      content: `public class SkinManager : MonoBehaviour {
    [Header("Skin Database")]
    public SkinDatabase skinDatabase;
    
    [System.Serializable]
    public class Skin {
        public string id;
        public string name;
        public SkinRarity rarity;
        public Sprite icon;
        public int gemCost;
        public bool isUnlocked;
    }
    
    public enum SkinRarity {
        Common,
        Rare, 
        Epic,
        Legendary
    }
    
    public void UnlockSkin(string skinId) {
        var skin = skinDatabase.GetSkin(skinId);
        if (skin != null) {
            skin.isUnlocked = true;
            PlayerData.Save();
        }
    }
}`
    }
  ];

  const [selectedFile, setSelectedFile] = useState(codebaseFiles[0]);
  const [filteredFiles, setFilteredFiles] = useState(codebaseFiles);

  const handleEntityDefinition = (entityId: string, field: string, value: any) => {
    setEntityDefinitions(prev => ({
      ...prev,
      [entityId]: {
        ...prev[entityId],
        [field]: value
      }
    }));
  };

  const handleCodeSearch = (query: string) => {
    setSearchCode(query);
    if (query.trim()) {
      const filtered = codebaseFiles.filter(file => 
        file.name.toLowerCase().includes(query.toLowerCase()) ||
        file.content.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredFiles(filtered);
    } else {
      setFilteredFiles(codebaseFiles);
    }
  };

  const getEntityCompletion = (entityId: string) => {
    const def = entityDefinitions[entityId];
    if (!def) return 0;
    
    const requiredFields = ['minPrice', 'maxPrice', 'codeReference'];
    const completedFields = requiredFields.filter(field => def[field]);
    return (completedFields.length / requiredFields.length) * 100;
  };

  const isAllEntitiesComplete = () => {
    return gameEntities.every(entity => getEntityCompletion(entity.id) === 100);
  };

  const handleNext = () => {
    onNext({ 
      entityDefinitions,
      entitiesComplete: true 
    });
  };

  return (
    <div className="min-h-screen bg-hero">
      {/* Header */}
      <div className="pt-8 pb-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <h1 className="text-3xl font-bold text-center text-black mb-2">
            Entity Definition
          </h1>
          <p className="text-gray-600 text-center">
            Define your game entities and map them to your codebase
          </p>
        </div>
      </div>

      {/* Main Interface */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 pb-8">
        <div className="grid lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
          
          {/* Left Panel - Entity Definition */}
          <div className="bg-section rounded-2xl border-2 border-black flex flex-col">
            <div className="p-6 border-b border-gray-200">
              <h2 className="font-semibold text-lg mb-2">Game Entities</h2>
              <p className="text-sm text-gray-600">Click an entity to define it</p>
            </div>

            <div className="flex-1 p-6 overflow-y-auto space-y-4">
              {gameEntities.map((entity) => {
                const completion = getEntityCompletion(entity.id);
                const isSelected = selectedEntity === entity.id;
                
                return (
                  <div
                    key={entity.id}
                    onClick={() => setSelectedEntity(entity.id)}
                    className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                      isSelected 
                        ? 'border-purple-500 bg-purple-50' 
                        : entity.color
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <span className="text-xl">{entity.icon}</span>
                        <div>
                          <h4 className="font-semibold">{entity.name}</h4>
                          <p className="text-xs text-gray-600 capitalize">{entity.type}</p>
                        </div>
                      </div>
                      {completion === 100 && (
                        <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                          <HiCheck className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </div>
                    
                    <p className="text-sm text-gray-700 mb-2">{entity.description}</p>
                    <p className="text-xs font-medium">{entity.basePrice}</p>
                    
                    {completion > 0 && completion < 100 && (
                      <div className="mt-2">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-purple-500 h-2 rounded-full transition-all"
                            style={{ width: `${completion}%` }}
                          ></div>
                        </div>
                        <p className="text-xs text-gray-600 mt-1">{Math.round(completion)}% complete</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Entity Definition Form */}
            {selectedEntity && (
              <div className="p-6 border-t border-gray-200 bg-gray-50">
                <h3 className="font-semibold mb-4">
                  Define {gameEntities.find(e => e.id === selectedEntity)?.name}
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Min Price Tolerance
                    </label>
                    <input
                      type="text"
                      placeholder="$0.50"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                      value={entityDefinitions[selectedEntity]?.minPrice || ''}
                      onChange={(e) => handleEntityDefinition(selectedEntity, 'minPrice', e.target.value)}
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
                      value={entityDefinitions[selectedEntity]?.maxPrice || ''}
                      onChange={(e) => handleEntityDefinition(selectedEntity, 'maxPrice', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Code Reference
                    </label>
                    <input
                      type="text"
                      placeholder="Select from codebase →"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                      value={entityDefinitions[selectedEntity]?.codeReference || ''}
                      onChange={(e) => handleEntityDefinition(selectedEntity, 'codeReference', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Panel - Codebase Browser */}
          <div className="lg:col-span-2 bg-section rounded-2xl border-2 border-black flex flex-col">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="font-semibold text-lg">Codebase Browser</h2>
                  <p className="text-sm text-gray-600">Select code that relates to your entities</p>
                </div>
                <div className="flex items-center space-x-2">
                  <HiCode className="w-4 h-4 text-gray-600" />
                  <span className="text-sm text-gray-600">{userData.gameEngine || 'Unity'}</span>
                </div>
              </div>
              
              {/* Search */}
              <div className="relative">
                <HiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search files and code..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  value={searchCode}
                  onChange={(e) => handleCodeSearch(e.target.value)}
                />
              </div>
            </div>

            <div className="flex flex-1 overflow-hidden">
              {/* File List */}
              <div className="w-1/3 border-r border-gray-200 p-4 overflow-y-auto">
                <h3 className="font-medium text-sm text-gray-700 mb-3">Files</h3>
                <div className="space-y-1">
                  {filteredFiles.map((file, index) => (
                    <div
                      key={index}
                      onClick={() => setSelectedFile(file)}
                      className={`p-3 rounded-lg cursor-pointer transition-colors ${
                        selectedFile.name === file.name
                          ? 'bg-purple-100 border border-purple-300'
                          : 'hover:bg-gray-100'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <HiCode className="w-4 h-4 text-gray-500" />
                        <div>
                          <p className="text-sm font-medium">{file.name}</p>
                          <p className="text-xs text-gray-500">{file.path}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Code Preview */}
              <div className="flex-1 p-4 overflow-y-auto">
                <div className="mb-4">
                  <h3 className="font-medium text-sm text-gray-700 mb-1">{selectedFile.name}</h3>
                  <p className="text-xs text-gray-500">{selectedFile.path}</p>
                </div>
                
                <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                  <pre className="text-sm text-gray-100 whitespace-pre-wrap font-mono">
                    {selectedFile.content}
                  </pre>
                </div>
                
                {selectedEntity && (
                  <div className="mt-4">
                    <button
                      onClick={() => {
                        const reference = `${selectedFile.name}:${selectedFile.path}`;
                        handleEntityDefinition(selectedEntity, 'codeReference', reference);
                      }}
                      className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-colors text-sm"
                    >
                      Map to {gameEntities.find(e => e.id === selectedEntity)?.name}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between pt-6">
          <button
            onClick={onBack}
            className="border-2 border-black text-black px-8 py-4 rounded-full font-medium text-lg hover:bg-black hover:text-white transition-colors"
          >
            Back
          </button>
          
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-600">
              {gameEntities.filter(e => getEntityCompletion(e.id) === 100).length} of {gameEntities.length} entities defined
            </div>
            <button
              onClick={handleNext}
              disabled={!isAllEntitiesComplete()}
              className={`px-8 py-4 rounded-full font-medium text-lg transition-colors ring-4 ring-orange-300 ring-offset-2 ${
                isAllEntitiesComplete()
                  ? 'bg-black text-white hover:bg-gray-800'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              Continue to Store Permissions
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}