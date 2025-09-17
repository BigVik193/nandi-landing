'use client';

import { useState } from 'react';
import { HiSparkles, HiCode, HiCheck, HiPlay, HiChatAlt } from 'react-icons/hi';
import { FaGithub } from 'react-icons/fa';

interface BuildStoreProps {
  onNext: (data: any) => void;
  onBack: () => void;
  userData: any;
}

export default function BuildStore({ onNext, onBack, userData }: BuildStoreProps) {
  const [messages, setMessages] = useState([
    {
      type: 'assistant',
      content: `Hi! I'm here to help you build your in-game store for ${userData.gameProjectName || 'your game'}. I'll create a dynamic store system that integrates seamlessly with your ${userData.gameEngine || 'game engine'} project.`,
      timestamp: new Date()
    },
    {
      type: 'assistant', 
      content: 'Let me start by creating a basic store structure with item grids, bundle sections, and currency displays. You can guide me on any specific requirements!',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isBuilding, setIsBuilding] = useState(false);
  const [buildProgress, setBuildProgress] = useState(0);
  const [isStoreBuilt, setIsStoreBuilt] = useState(false);

  const [storeCode, setStoreCode] = useState(`
// Nandi Dynamic Store System - Generated for ${userData.gameProjectName || 'Your Game'}
public class NandiStoreManager : MonoBehaviour 
{
    [Header("Store Configuration")]
    public GameObject itemCardPrefab;
    public Transform itemGridContainer;
    public Transform bundleContainer;
    public CurrencyDisplay currencyDisplay;
    
    [Header("Store Data")]
    public List<StoreItem> availableItems = new List<StoreItem>();
    public List<Bundle> activeBundles = new List<Bundle>();
    
    private NandiAPI nandiAPI;
    
    void Start() 
    {
        nandiAPI = new NandiAPI("${userData.appId || 'your-app-id'}");
        InitializeStore();
    }
    
    public void InitializeStore() 
    {
        // Fetch dynamic store configuration from Nandi
        nandiAPI.GetStoreConfig((config) => {
            RenderStoreItems(config.items);
            RenderBundles(config.bundles);
            UpdateCurrencyDisplay();
        });
    }
    
    private void RenderStoreItems(List<StoreItemConfig> items) 
    {
        foreach(var item in items) 
        {
            GameObject itemCard = Instantiate(itemCardPrefab, itemGridContainer);
            var cardComponent = itemCard.GetComponent<ItemCard>();
            cardComponent.SetupItem(item);
        }
    }
}

[System.Serializable]
public class StoreItem 
{
    public string id;
    public string name;
    public float price;
    public string currency;
    public Sprite icon;
    public string category;
}
  `);

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;
    
    const newUserMessage = {
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, newUserMessage]);
    setInputMessage('');
    setIsBuilding(true);
    setBuildProgress(0);
    
    // Simulate AI building
    const progressInterval = setInterval(() => {
      setBuildProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setIsBuilding(false);
          
          // Add AI response
          setTimeout(() => {
            const aiResponse = {
              type: 'assistant',
              content: generateAIResponse(newUserMessage.content),
              timestamp: new Date()
            };
            setMessages(prev => [...prev, aiResponse]);
            updateStoreCode(newUserMessage.content);
          }, 500);
          
          return 100;
        }
        return prev + 20;
      });
    }, 200);
  };

  const generateAIResponse = (userMessage: string) => {
    const responses = [
      "Great idea! I've updated the store layout to include those changes. The code has been regenerated with your requirements.",
      "Perfect! I've added that functionality to your store. You can see the updated code in the preview panel.",
      "Excellent suggestion! I've implemented that feature and optimized the store structure accordingly.",
      "That's a smart approach! I've integrated that into your store design with proper error handling and performance optimization."
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const updateStoreCode = (userMessage: string) => {
    // Simulate code updates based on user input
    if (userMessage.toLowerCase().includes('bundle')) {
      setStoreCode(prev => prev + `\n\n// Added Bundle System\npublic void CreateBundle(List<string> itemIds, float discountPercent) {\n    // Bundle creation logic\n}`);
    } else if (userMessage.toLowerCase().includes('currency')) {
      setStoreCode(prev => prev + `\n\n// Enhanced Currency System\npublic void HandleCurrencyPurchase(string currencyType, int amount) {\n    // Currency purchase logic\n}`);
    }
  };

  const handleFinalizeStore = () => {
    setIsStoreBuilt(true);
    setTimeout(() => {
      onNext({ 
        storeBuilt: true,
        storeCode: storeCode,
        buildMessages: messages 
      });
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-hero">
      {/* Header */}
      <div className="pt-8 pb-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <h1 className="text-3xl font-bold text-center text-black mb-2">
            AI Store Builder
          </h1>
          <p className="text-gray-600 text-center">
            Let's build your dynamic in-game store together
          </p>
        </div>
      </div>

      {/* Main Interface - Lovable-like Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 pb-8">
        <div className="grid lg:grid-cols-2 gap-6 h-[calc(100vh-200px)]">
          
          {/* Left Panel - Chat Interface */}
          <div className="bg-section rounded-2xl border-2 border-black flex flex-col">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-300 rounded-full flex items-center justify-center">
                  <HiChatAlt className="w-5 h-5 text-purple-900" />
                </div>
                <div>
                  <h2 className="font-semibold text-lg">AI Store Assistant</h2>
                  <p className="text-sm text-gray-600">Building your {userData.gameEngine || 'Unity'} store</p>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 p-6 overflow-y-auto space-y-4">
              {messages.map((message, index) => (
                <div key={index} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    message.type === 'user' 
                      ? 'bg-purple-500 text-white' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    <p className="text-sm">{message.content}</p>
                  </div>
                </div>
              ))}
              
              {isBuilding && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 text-gray-800 px-4 py-2 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-sm">Building... {buildProgress}%</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-6 border-t border-gray-200">
              <div className="flex space-x-3">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Describe what you want to add or change..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={isBuilding || !inputMessage.trim()}
                  className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 disabled:bg-gray-300 transition-colors"
                >
                  <HiPlay className="w-4 h-4 rotate-90" />
                </button>
              </div>
            </div>
          </div>

          {/* Right Panel - Live Code Preview */}
          <div className="bg-section rounded-2xl border-2 border-black flex flex-col">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-300 rounded-full flex items-center justify-center">
                    <HiCode className="w-5 h-5 text-blue-900" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-lg">Live Store Code</h2>
                    <p className="text-sm text-gray-600">NandiStoreManager.cs</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <FaGithub className="w-4 h-4 text-gray-600" />
                  <span className="text-sm text-gray-600">Connected</span>
                </div>
              </div>
            </div>

            {/* Code Editor */}
            <div className="flex-1 p-4 overflow-y-auto">
              <pre className="text-sm font-mono text-gray-800 whitespace-pre-wrap">
                {storeCode}
              </pre>
            </div>

            {/* Actions */}
            <div className="p-6 border-t border-gray-200">
              <div className="flex space-x-3">
                <button
                  onClick={handleFinalizeStore}
                  className="flex-1 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors font-medium"
                >
                  {isStoreBuilt ? 'Store Built Successfully!' : 'Finalize & Continue'}
                </button>
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
          {isStoreBuilt && (
            <button
              onClick={() => onNext({ storeBuilt: true, storeCode, buildMessages: messages })}
              className="bg-black text-white px-8 py-4 rounded-full font-medium text-lg hover:bg-gray-800 transition-colors ring-4 ring-orange-300 ring-offset-2"
            >
              Continue to Entity Definition
            </button>
          )}
        </div>
      </div>
    </div>
  );
}