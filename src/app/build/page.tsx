'use client';

import { useState, useRef, useEffect } from 'react';
import { HiPlay, HiCode, HiFolder, HiDocument, HiSearch, HiArrowUp } from 'react-icons/hi';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { IPhoneMockup } from 'react-device-mockup';
import ReactMarkdown from 'react-markdown';

export default function BuildPage() {
  const [messages, setMessages] = useState([
    {
      type: 'assistant',
      content: 'Welcome to the Nandi Store Builder! I can help you create a dynamic in-game store system. What kind of store would you like to build?',
      timestamp: new Date(),
      id: 1
    },
    {
      type: 'user',
      content: 'Create a store interface for my medieval fantasy RPG game. I need separate sections for weapons, armor, potions, and magical items. The design should feel immersive with a dark stone background, gold trim accents, and parchment-style item cards. Each weapon should display attack power, durability, and special effects. For armor, show defense rating, weight, and set bonuses. Make sure the layout works well on mobile devices since most of our players are on phones.',
      timestamp: new Date(),
      id: 2
    },
    {
      type: 'assistant',
      content: `Excellent! I've designed a medieval fantasy store that captures the atmosphere you're looking for. Here's what I've implemented:

## Store Layout
- **Dark stone texture background** with ornate gold borders and trim
- **Category tabs** with appropriate icons:
  - ⚔️ Weapons (crossed swords)
  - 🛡️ Armor (shield)
  - 🧪 Potions (bottles)
  - 🔮 Magical Items (mystical orbs)

## Item Cards
- **Weathered parchment texture** with elegant typography
- **Weapons**: Attack power with sword icons, durability bars, special effects like \`Fire Damage +15\` or \`Critical Hit Chance +12%\`
- **Armor**: Defense ratings with shield icons, weight indicators, set bonus previews

## Mobile Optimization
- **Responsive grid** that stacks beautifully on smaller screens
- Touch-friendly interaction zones`,
      timestamp: new Date(),
      id: 3
    },
    {
      type: 'user',
      content: 'Perfect! Now I need a featured deals section at the top that showcases limited-time offers. It should have a prominent countdown timer, flash sale badges, and maybe some visual effects like a subtle glow or particle effects to draw attention. I want players to feel urgency and excitement about these special deals. Also, can you make it so the deals automatically rotate every 24 hours with different items?',
      timestamp: new Date(),
      id: 4
    },
    {
      type: 'assistant',
      content: `Love the urgency strategy! I've created a dynamic featured deals banner that's impossible to miss:

## Featured Deals Section
- **Prominent positioning** at the top with rich burgundy background and gold accents
- **Large countdown timer** with red numbers that pulse as time runs low
- **Eye-catching badges**: \`FLASH SALE\` and \`LIMITED TIME\` with subtle golden glow effect
- **Visual effects**: Gentle floating particle animations around high-value items

## Smart Rotation System
- **24-hour auto-refresh** pulling from your inventory
- **Smart pricing algorithms** that create attractive bundles and discounts
- **Daily variety**: Different legendary weapons, rare armor sets, or exclusive cosmetics each day

This encourages **daily check-ins** and creates natural urgency for purchases!`,
      timestamp: new Date(),
      id: 5
    },
    {
      type: 'user',
      content: 'This looks amazing! One more enhancement - when players hover over equipment items, can you show a detailed comparison tooltip that compares the item to what they currently have equipped? It should show stat differences with color-coded indicators (green for improvements, red for downgrades), include the percentage change, and maybe even show how it affects their overall character power rating. This will help players make better purchasing decisions.',
      timestamp: new Date(),
      id: 6
    },
    {
      type: 'assistant',
      content: `Brilliant UX thinking! I've implemented an intelligent comparison system that makes equipment decisions crystal clear:

## Comparison Tooltip Features
- **Side-by-side comparison** of current vs. potential equipment
- **Color-coded indicators**:
  - 🟢 **Green arrows/numbers** for improvements
  - 🔴 **Red arrows/numbers** for downgrades  
  - ⚪ **Gray** for no change

## Detailed Statistics
- **Percentage improvements** displayed prominently: \`+15% Attack Power\` or \`-8% Weight\`
- **Overall power impact**: \`Total Power: +127 (5.2% increase)\`
- **Set bonus previews** showing how new items affect existing sets
- **Secondary stats** included: movement speed, critical chance, elemental resistances

This gives players **complete information** to make confident purchasing decisions with full transparency on how each item will impact their character's performance.`,
      timestamp: new Date(),
      id: 7
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isBuilding, setIsBuilding] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const [currentCode, setCurrentCode] = useState(`// Nandi Dynamic Store System
using UnityEngine;
using System.Collections.Generic;

public class NandiStoreManager : MonoBehaviour 
{
    [Header("Store Configuration")]
    public GameObject itemCardPrefab;
    public Transform itemGridContainer;
    public Transform bundleContainer;
    public CurrencyDisplay currencyDisplay;
    
    [Header("Nandi Integration")]
    public string nandiAppId = "your-app-id";
    private NandiAPI nandiAPI;
    
    void Start() 
    {
        nandiAPI = new NandiAPI(nandiAppId);
        InitializeStore();
    }
    
    public void InitializeStore() 
    {
        // Fetch dynamic store configuration from Nandi
        nandiAPI.GetStoreConfig(OnStoreConfigReceived);
    }
    
    private void OnStoreConfigReceived(StoreConfig config) 
    {
        RenderStoreItems(config.items);
        RenderBundles(config.bundles);
        UpdateCurrencyDisplay();
    }
    
    private void RenderStoreItems(List<StoreItemConfig> items) 
    {
        // Clear existing items
        foreach(Transform child in itemGridContainer) 
        {
            Destroy(child.gameObject);
        }
        
        // Create new item cards
        foreach(var item in items) 
        {
            GameObject itemCard = Instantiate(itemCardPrefab, itemGridContainer);
            var cardComponent = itemCard.GetComponent<ItemCard>();
            cardComponent.SetupItem(item);
        }
    }
}`);

  const [previewMode, setPreviewMode] = useState<'code' | 'visual'>('visual');
  const [buildProgress, setBuildProgress] = useState(0);
  const [phoneOrientation, setPhoneOrientation] = useState<'portrait' | 'landscape'>('landscape');

  // Unity Store Files with Sample Code
  const storeFiles = [
    {
      name: 'NandiStoreManager.cs',
      path: '/Scripts/Store/NandiStoreManager.cs',
      content: `using UnityEngine;
using System.Collections.Generic;
using Newtonsoft.Json;

public class NandiStoreManager : MonoBehaviour 
{
    [Header("Store Configuration")]
    public GameObject itemCardPrefab;
    public Transform itemGridContainer;
    public Transform bundleContainer;
    public CurrencyDisplay currencyDisplay;
    
    [Header("Nandi Integration")]
    public string nandiAppId = "your-app-id";
    private NandiAPI nandiAPI;
    
    void Start() 
    {
        nandiAPI = new NandiAPI(nandiAppId);
        InitializeStore();
    }
    
    public void InitializeStore() 
    {
        // Fetch dynamic store configuration from Nandi
        nandiAPI.GetStoreConfig(OnStoreConfigReceived);
    }
    
    private void OnStoreConfigReceived(StoreConfig config) 
    {
        RenderStoreItems(config.items);
        RenderBundles(config.bundles);
        UpdateCurrencyDisplay();
        
        // Track store view for analytics
        nandiAPI.TrackEvent("store_viewed", new Dictionary<string, object>
        {
            {"items_count", config.items.Count},
            {"bundles_count", config.bundles.Count}
        });
    }
}`
    },
    {
      name: 'StoreConfig.cs',
      path: '/Scripts/Store/StoreConfig.cs',
      content: `using System;
using System.Collections.Generic;

[Serializable]
public class StoreConfig
{
    public List<StoreItem> items;
    public List<Bundle> bundles;
    public CurrencyConfig currencies;
    public string storeTheme;
    public bool analyticsEnabled;
}

[Serializable]
public class StoreItem
{
    public string id;
    public string name;
    public string description;
    public string iconUrl;
    public Price price;
    public string category;
    public bool featured;
    public float discountPercentage;
}

[Serializable]
public class Bundle
{
    public string id;
    public string name;
    public List<BundleItem> items;
    public Price originalPrice;
    public Price bundlePrice;
    public string badgeText;
    public DateTime? expiryDate;
}

[Serializable]
public class Price
{
    public string currency;
    public float amount;
    public string displayText;
}`
    },
    {
      name: 'ItemCard.cs',
      path: '/Scripts/UI/ItemCard.cs',
      content: `using UnityEngine;
using UnityEngine.UI;
using TMPro;

public class ItemCard : MonoBehaviour
{
    [Header("UI Components")]
    public Image itemIcon;
    public TextMeshProUGUI itemName;
    public TextMeshProUGUI itemDescription;
    public TextMeshProUGUI priceText;
    public Button purchaseButton;
    public GameObject discountBadge;
    public TextMeshProUGUI discountText;
    
    private StoreItem storeItem;
    private NandiStoreManager storeManager;
    
    public void SetupItem(StoreItem item, NandiStoreManager manager)
    {
        storeItem = item;
        storeManager = manager;
        
        itemName.text = item.name;
        itemDescription.text = item.description;
        priceText.text = item.price.displayText;
        
        // Load item icon
        StartCoroutine(LoadIcon(item.iconUrl));
        
        // Setup discount
        if (item.discountPercentage > 0)
        {
            discountBadge.SetActive(true);
            discountText.text = $"-{item.discountPercentage}%";
        }
        
        purchaseButton.onClick.AddListener(OnPurchaseClicked);
    }
    
    private void OnPurchaseClicked()
    {
        storeManager.PurchaseItem(storeItem.id);
    }
}`
    }
  ];

  const [selectedFile, setSelectedFile] = useState(storeFiles[0]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isBuilding) return;
    
    const userMessage = {
      type: 'user',
      content: inputMessage,
      timestamp: new Date(),
      id: Date.now()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsBuilding(true);
    
    // Simulate building progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setBuildProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        setBuildProgress(0);
        setIsBuilding(false);
        
        // Add AI response
        const aiResponse = {
          type: 'assistant',
          content: generateAIResponse(userMessage.content),
          timestamp: new Date(),
          id: Date.now() + 1
        };
        setMessages(prev => [...prev, aiResponse]);
        
        // Update code based on user input
        updateCodeBasedOnInput(userMessage.content);
      }
    }, 150);
  };

  const generateAIResponse = (input: string) => {
    const lowerInput = input.toLowerCase();
    
    if (lowerInput.includes('bundle') || lowerInput.includes('package')) {
      return "Great! I've added bundle functionality to your store. The system now supports creating special offer bundles with discounted pricing. You can see the updated code with bundle management methods.";
    } else if (lowerInput.includes('currency') || lowerInput.includes('coin') || lowerInput.includes('gem')) {
      return "Perfect! I've enhanced the currency system with multi-currency support. Your store can now handle gems, coins, and any custom currencies you define. The currency display will update dynamically.";
    } else if (lowerInput.includes('analytics') || lowerInput.includes('track')) {
      return "Excellent idea! I've integrated analytics tracking throughout the store system. All purchases, views, and interactions will be automatically tracked for optimization insights.";
    } else if (lowerInput.includes('ui') || lowerInput.includes('design') || lowerInput.includes('layout')) {
      return "I've updated the store layout system! The UI is now more flexible with responsive design elements. You can customize the grid layout, card styling, and positioning through the inspector.";
    } else if (lowerInput.includes('payment') || lowerInput.includes('purchase')) {
      return "Payment processing has been enhanced! I've added secure payment handling with multiple payment providers and fraud protection. The system supports both in-app purchases and external payments.";
    } else {
      return "I've updated your store based on your request! The code has been modified to include the functionality you mentioned. You can see the changes in the preview panel.";
    }
  };

  const updateCodeBasedOnInput = (input: string) => {
    const lowerInput = input.toLowerCase();
    
    if (lowerInput.includes('bundle')) {
      setCurrentCode(prev => prev + `
    
    // Bundle System - Added based on your request
    private void RenderBundles(List<BundleConfig> bundles) 
    {
        foreach(Transform child in bundleContainer) 
        {
            Destroy(child.gameObject);
        }
        
        foreach(var bundle in bundles) 
        {
            GameObject bundleCard = Instantiate(bundlePrefab, bundleContainer);
            var bundleComponent = bundleCard.GetComponent<BundleCard>();
            bundleComponent.SetupBundle(bundle);
        }
    }
    
    public void PurchaseBundle(string bundleId) 
    {
        nandiAPI.PurchaseBundle(bundleId, OnBundlePurchased);
    }`);
    } else if (lowerInput.includes('currency')) {
      setCurrentCode(prev => prev + `
    
    // Enhanced Currency System
    public void UpdateCurrencyDisplay() 
    {
        currencyDisplay.UpdateGems(PlayerData.Gems);
        currencyDisplay.UpdateCoins(PlayerData.Coins);
        currencyDisplay.UpdateCustomCurrency(PlayerData.CustomCurrencies);
    }
    
    public void PurchaseCurrency(string currencyType, int amount) 
    {
        nandiAPI.PurchaseCurrency(currencyType, amount, OnCurrencyPurchased);
    }`);
    }
  };

  return (
    <div className="h-screen flex bg-gray-50">
      {/* Left Panel - Chat Interface */}
      <div className="w-1/3 bg-white border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="px-6 py-2 bg-purple-300">
          <h1 className="text-lg font-bold text-black">🤖 Store Builder</h1>
        </div>

        {/* Save Button */}
        <div className="flex justify-end px-6 py-2 border-b border-gray-200">
          <button 
            onClick={() => window.location.href = '/dashboard'}
            className="bg-black text-white px-4 py-2 rounded-lg font-bold hover:bg-gray-800 transition-colors border-2 border-black"
          >
            Save
          </button>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="space-y-4">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-sm px-4 py-3 rounded-xl ${
                  message.type === 'user' 
                    ? 'bg-purple-300 text-black' 
                    : 'bg-gray-100 text-black'
                }`}>
                  {message.type === 'assistant' ? (
                    <div className="text-sm prose prose-sm max-w-none prose-headings:text-black prose-headings:font-bold prose-headings:mb-2 prose-headings:mt-3 prose-p:mb-2 prose-ul:mb-2 prose-li:mb-1 prose-strong:font-bold prose-code:bg-gray-200 prose-code:px-1 prose-code:rounded prose-code:text-xs">
                      <ReactMarkdown>
                        {message.content}
                      </ReactMarkdown>
                    </div>
                  ) : (
                    <p className="text-sm">{message.content}</p>
                  )}
                </div>
              </div>
            ))}
            
            {isBuilding && (
              <div className="flex justify-start">
                <div className="bg-gray-100 text-black px-4 py-3 rounded-xl">
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-purple-300 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-sm">Building... {buildProgress}%</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>


        {/* Chat Input */}
        <div className="p-4 border-t border-gray-200">
          <div className="relative">
            <textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask Nandi..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm resize-none focus:outline-none focus:ring-1 focus:ring-purple-300 focus:border-purple-300 bg-white"
              rows={3}
              onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSendMessage())}
              disabled={isBuilding}
            />
            <div className="absolute bottom-3 right-3 flex items-center space-x-2">
              <button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isBuilding}
                className="bg-black text-white p-2 rounded-full hover:bg-gray-800 disabled:bg-gray-300 transition-colors"
              >
                <HiArrowUp className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Live Preview */}
      <div className="w-2/3 bg-white flex flex-col">
        {/* Header */}
        <div className="px-6 py-2 bg-purple-300">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-black">🚀 Live Preview</h2>
            
            <div className="flex items-center space-x-2">
              {/* Orientation Toggle - Only show in visual mode */}
              {previewMode === 'visual' && (
                <div className="flex bg-white rounded-md border border-black">
                  <button
                    onClick={() => setPhoneOrientation('portrait')}
                    className={`px-2 py-1 rounded-sm text-xs font-bold transition-colors ${
                      phoneOrientation === 'portrait' 
                        ? 'bg-purple-300 text-black' 
                        : 'text-black hover:bg-gray-100'
                    }`}
                  >
                    📱
                  </button>
                  <button
                    onClick={() => setPhoneOrientation('landscape')}
                    className={`px-2 py-1 rounded-sm text-xs font-bold transition-colors ${
                      phoneOrientation === 'landscape' 
                        ? 'bg-purple-300 text-black' 
                        : 'text-black hover:bg-gray-100'
                    }`}
                  >
                    📱↻
                  </button>
                </div>
              )}
              
              {/* Preview Mode Toggle */}
              <div className="flex bg-white rounded-md border border-black">
                <button
                  onClick={() => setPreviewMode('visual')}
                  className={`px-2 py-1 rounded-sm text-xs font-bold transition-colors ${
                    previewMode === 'visual' 
                      ? 'bg-purple-300 text-black' 
                      : 'text-black hover:bg-gray-100'
                  }`}
                >
                  Visual
                </button>
                <button
                  onClick={() => setPreviewMode('code')}
                  className={`px-2 py-1 rounded-sm text-xs font-bold transition-colors ${
                    previewMode === 'code' 
                      ? 'bg-purple-300 text-black' 
                      : 'text-black hover:bg-gray-100'
                  }`}
                >
                  Code
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Preview Content */}
        <div className="flex-1 overflow-hidden">
          {previewMode === 'visual' ? (
            /* Visual Store Preview with iPhone Frame */
            <div className="h-full p-6 bg-gray-50 flex items-center justify-center">
              <div className="bg-black p-8 rounded-2xl w-3/4">
                <img 
                  src="/mobile-game-store.png" 
                  alt="Mobile Game Store" 
                  className="w-full h-auto rounded-xl"
                />
              </div>
            </div>
          ) : (
            /* Code Browser - Similar to Entities Page */
            <div className="h-full flex bg-gray-50">
              {/* File Explorer */}
              <div className="w-64 border-r border-gray-300 bg-gray-50 overflow-y-auto">
                {/* Files Header */}
                <div className="px-3 py-2 border-b border-gray-300 bg-gray-100">
                  <div className="flex items-center space-x-2">
                    <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h2a2 2 0 012 2v2H8V5z" />
                    </svg>
                    <span className="text-sm font-medium text-gray-700">Files</span>
                  </div>
                </div>
                
                {/* File Tree */}
                <div className="p-2">
                  {/* Scripts Folder */}
                  <div className="mb-1">
                    <div className="flex items-center px-2 py-1 text-sm text-gray-700 font-medium">
                      <svg className="w-3 h-3 mr-1 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                      📁 Scripts
                    </div>
                    
                    {/* Store Folder */}
                    <div className="ml-4 mb-1">
                      <div className="flex items-center px-2 py-1 text-sm text-gray-700">
                        <svg className="w-3 h-3 mr-1 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                        📁 Store
                      </div>
                      {storeFiles.filter(file => file.path.includes('/Store/')).map((file) => (
                        <div
                          key={file.name}
                          onClick={() => setSelectedFile(file)}
                          className={`ml-4 flex items-center px-2 py-1 text-sm cursor-pointer rounded hover:bg-gray-200 ${
                            selectedFile.name === file.name ? 'bg-purple-300 text-black' : 'text-gray-700'
                          }`}
                        >
                          <svg className="w-3 h-3 mr-2 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                          </svg>
                          {file.name}
                        </div>
                      ))}
                    </div>
                    
                    {/* UI Folder */}
                    <div className="ml-4">
                      <div className="flex items-center px-2 py-1 text-sm text-gray-700">
                        <svg className="w-3 h-3 mr-1 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                        📁 UI
                      </div>
                      {storeFiles.filter(file => file.path.includes('/UI/')).map((file) => (
                        <div
                          key={file.name}
                          onClick={() => setSelectedFile(file)}
                          className={`ml-4 flex items-center px-2 py-1 text-sm cursor-pointer rounded hover:bg-gray-200 ${
                            selectedFile.name === file.name ? 'bg-purple-300 text-black' : 'text-gray-700'
                          }`}
                        >
                          <svg className="w-3 h-3 mr-2 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                          </svg>
                          {file.name}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Code Editor */}
              <div className="flex-1 flex flex-col bg-white">
                {/* Tab Bar */}
                <div className="border-b border-gray-300 bg-gray-50">
                  <div className="flex">
                    <div className="flex items-center px-4 py-2 border-r border-gray-300 bg-white text-sm">
                      <svg className="w-3 h-3 mr-2 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                      </svg>
                      {selectedFile.name}
                    </div>
                  </div>
                </div>
                
                {/* Code Content */}
                <div className="flex-1 relative overflow-hidden">
                  <div className="absolute top-3 right-3 z-10">
                    <button
                      onClick={() => navigator.clipboard.writeText(selectedFile.content)}
                      className="text-gray-400 hover:text-gray-600 transition-colors bg-gray-800 hover:bg-gray-700 p-1.5 rounded text-xs"
                      title="Copy code"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </button>
                  </div>
                  <SyntaxHighlighter
                    language="csharp"
                    style={tomorrow}
                    showLineNumbers={true}
                    customStyle={{
                      margin: 0,
                      borderRadius: 0,
                      fontSize: '14px',
                      lineHeight: '1.5',
                      height: '100%',
                      overflow: 'auto',
                    }}
                    codeTagProps={{
                      style: {
                        fontSize: '14px',
                        fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
                      }
                    }}
                  >
                    {selectedFile.content}
                  </SyntaxHighlighter>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}