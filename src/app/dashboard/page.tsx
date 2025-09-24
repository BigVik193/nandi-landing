'use client';

import { useState, useEffect } from 'react';
import { HiTrendingUp, HiTrendingDown, HiEye, HiCurrencyDollar, HiUsers, HiChartBar, HiCog, HiPlay, HiPause, HiPlus, HiCode, HiClipboard, HiKey, HiTrash } from 'react-icons/hi';
import { useAuth } from '@/contexts/AuthContext';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';

const codeExamples = {
  unity: {
    title: 'Unity (C#)',
    language: 'csharp',
    code: `using Nandi;

public class NandiBootstrap : MonoBehaviour
{
    void Start()
    {
        NandiSDK.Init("YOUR_API_KEY");
    }

    public void OnLevelComplete()
    {
        NandiSDK.PresentUpsell(new NandiUpsellOptions { Trigger = "level_complete" });
    }
}`
  },
  unreal: {
    title: 'Unreal Engine (C++)',
    language: 'cpp',
    code: `#include "NandiSDK.h"

void UMyGameInstance::Init()
{
    UNandiSDK::Init(TEXT("YOUR_API_KEY"));
}

void AMyGameMode::HandleLevelComplete()
{
    FNandiUpsellOptions Opts;
    Opts.Trigger = TEXT("level_complete");
    UNandiSDK::PresentUpsell(Opts);
}`
  },
  godot: {
    title: 'Godot (GDScript)',
    language: 'python',
    code: `extends Node

func _ready():
    Nandi.init("YOUR_API_KEY")

func on_level_complete():
    Nandi.present_upsell({"trigger": "level_complete"})`
  },
  ios: {
    title: 'Native iOS (Swift)',
    language: 'swift',
    code: `import NandiSDK

@main
class AppDelegate: UIResponder, UIApplicationDelegate {
  func application(_ application: UIApplication,
                   didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
    NandiSDK.init(apiKey: "YOUR_API_KEY")
    return true
  }
}

func onLevelComplete() {
  NandiSDK.presentUpsell(NandiUpsellOptions(trigger: "level_complete"))
}`
  },
  android: {
    title: 'Native Android (Kotlin)',
    language: 'kotlin',
    code: `import com.nandi.sdk.NandiSDK
import com.nandi.sdk.NandiUpsellOptions

class App : Application() {
    override fun onCreate() {
        super.onCreate()
        NandiSDK.init("YOUR_API_KEY")
    }
}

fun onLevelComplete() {
    NandiSDK.presentUpsell(NandiUpsellOptions(trigger = "level_complete"))
}`
  }
};

export default function DashboardPage() {
  const { user } = useAuth();
  const [selectedTest, setSelectedTest] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<keyof typeof codeExamples>('unity');
  const [showSDKIntegration, setShowSDKIntegration] = useState(false);
  const [apiKeys, setApiKeys] = useState<any[]>([]);
  const [loadingApiKeys, setLoadingApiKeys] = useState(true);
  
  // Use the first API key for code examples, or fallback to mock
  const userApiKey = apiKeys.length > 0 ? apiKeys[0].key_prefix.replace('...', 'abc123def456') : "nandi_prod_2024_abc123def456";

  // Function to redact API key (show first 12 chars + ...)
  const redactApiKey = (key: string) => {
    return key.substring(0, 12) + '...';
  };

  // Fetch API keys
  useEffect(() => {
    const fetchApiKeys = async () => {
      if (!user) return;
      
      try {
        // TODO: Get actual game ID from user's games - for now using mock ID
        const gameId = 1; // This should come from user's selected game
        const response = await fetch(`/api/api-keys?gameId=${gameId}`);
        
        if (response.ok) {
          const data = await response.json();
          setApiKeys(data.apiKeys || []);
        } else if (response.status === 404) {
          // Game not found or no access - this is expected for new users
          setApiKeys([]);
        } else {
          console.error('Failed to fetch API keys:', response.statusText);
          setApiKeys([]);
        }
      } catch (error) {
        console.error('Failed to fetch API keys:', error);
        setApiKeys([]);
      } finally {
        setLoadingApiKeys(false);
      }
    };

    fetchApiKeys();
  }, [user]);

  // Delete API key
  const handleDeleteApiKey = async (apiKeyId: number, name: string) => {
    if (!confirm(`Are you sure you want to delete the API key "${name}"? This action cannot be undone.`)) {
      return;
    }

    try {
      const response = await fetch(`/api/api-keys/${apiKeyId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setApiKeys(prev => prev.filter(key => key.id !== apiKeyId));
      } else {
        alert('Failed to delete API key. Please try again.');
      }
    } catch (error) {
      console.error('Failed to delete API key:', error);
      alert('Failed to delete API key. Please try again.');
    }
  };

  // Mock data for analytics
  const analytics = {
    revenue: {
      current: 24750,
      previous: 18200,
      change: 36.0
    },
    conversionRate: {
      current: 8.4,
      previous: 6.1,
      change: 37.7
    },
    totalUsers: {
      current: 12543,
      previous: 11200,
      change: 12.0
    }
  };

  // Mock data for running tests
  const runningTests = [
    {
      id: 'test-1',
      name: 'Premium Bundle Pricing',
      status: 'running',
      duration: '5 days',
      conversionLift: '+24.3%',
      revenueImpact: '+$1,250',
      description: 'Testing $9.99 vs $12.99 for premium gem bundle',
      participants: 2340,
      variants: {
        control: { name: 'Current Price ($9.99)', conversion: 6.2, revenue: 850 },
        variant: { name: 'Higher Price ($12.99)', conversion: 7.7, revenue: 1100 }
      }
    },
    {
      id: 'test-2', 
      name: 'Store Layout A/B Test',
      status: 'running',
      duration: '3 days',
      conversionLift: '+18.5%',
      revenueImpact: '+$890',
      description: 'Testing grid vs carousel layout for featured items',
      participants: 1850,
      variants: {
        control: { name: 'Grid Layout', conversion: 5.8, revenue: 720 },
        variant: { name: 'Carousel Layout', conversion: 6.9, revenue: 950 }
      }
    },
    {
      id: 'test-3',
      name: 'Limited Time Offers',
      status: 'completed',
      duration: '7 days',
      conversionLift: '+42.1%',
      revenueImpact: '+$2,150',
      description: 'Testing urgency messaging on special offers',
      participants: 3200,
      variants: {
        control: { name: 'Standard Offers', conversion: 4.2, revenue: 1200 },
        variant: { name: 'Limited Time Offers', conversion: 6.0, revenue: 1850 }
      }
    }
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatPercent = (value: number) => {
    return `${value > 0 ? '+' : ''}${value.toFixed(1)}%`;
  };

  return (
    <div className="h-screen bg-gray-50 overflow-y-auto">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-black">Nandi Dashboard</h1>
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => window.location.href = '/entities'}
              className="bg-purple-300 text-black px-4 py-2 rounded-lg font-bold hover:bg-purple-400 transition-colors"
            >
              Manage Entities
            </button>
            {/* REMOVED: Store Builder button
            <button 
              onClick={() => window.location.href = '/build'}
              className="bg-black text-white px-4 py-2 rounded-lg font-bold hover:bg-gray-800 transition-colors"
            >
              Store Builder
            </button>
            */}
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Analytics Overview */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-black mb-6">Analytics Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Revenue Card */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="bg-green-100 p-3 rounded-full">
                    <HiCurrencyDollar className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 font-medium">Total Revenue</p>
                    <p className="text-2xl font-bold text-black">{formatCurrency(analytics.revenue.current)}</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {analytics.revenue.change > 0 ? (
                  <HiTrendingUp className="w-4 h-4 text-green-500" />
                ) : (
                  <HiTrendingDown className="w-4 h-4 text-red-500" />
                )}
                <span className={`text-sm font-medium ${analytics.revenue.change > 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {formatPercent(analytics.revenue.change)} vs last month
                </span>
              </div>
            </div>

            {/* Conversion Rate Card */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-100 p-3 rounded-full">
                    <HiChartBar className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 font-medium">Conversion Rate</p>
                    <p className="text-2xl font-bold text-black">{analytics.conversionRate.current}%</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {analytics.conversionRate.change > 0 ? (
                  <HiTrendingUp className="w-4 h-4 text-green-500" />
                ) : (
                  <HiTrendingDown className="w-4 h-4 text-red-500" />
                )}
                <span className={`text-sm font-medium ${analytics.conversionRate.change > 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {formatPercent(analytics.conversionRate.change)} vs last month
                </span>
              </div>
            </div>

            {/* Users Card */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="bg-purple-100 p-3 rounded-full">
                    <HiUsers className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 font-medium">Active Users</p>
                    <p className="text-2xl font-bold text-black">{analytics.totalUsers.current.toLocaleString()}</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {analytics.totalUsers.change > 0 ? (
                  <HiTrendingUp className="w-4 h-4 text-green-500" />
                ) : (
                  <HiTrendingDown className="w-4 h-4 text-red-500" />
                )}
                <span className={`text-sm font-medium ${analytics.totalUsers.change > 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {formatPercent(analytics.totalUsers.change)} vs last month
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Running Tests */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-black">A/B Tests</h2>
            <button className="bg-purple-300 text-black px-4 py-2 rounded-lg font-bold hover:bg-purple-400 transition-colors flex items-center space-x-2">
              <HiPlus className="w-4 h-4" />
              <span>New Test</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Tests List */}
            <div className="space-y-4">
              {runningTests.map((test) => (
                <div 
                  key={test.id}
                  onClick={() => setSelectedTest(selectedTest === test.id ? null : test.id)}
                  className={`bg-white rounded-lg p-6 shadow-sm border cursor-pointer hover:shadow-md transition-all ${
                    selectedTest === test.id ? 'border-purple-300 bg-purple-50 shadow-md' : 'border-gray-100 hover:border-gray-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${
                        test.status === 'running' ? 'bg-green-500' : 
                        test.status === 'completed' ? 'bg-blue-500' : 'bg-gray-400'
                      }`}></div>
                      <h3 className="font-bold text-black text-lg">{test.name}</h3>
                    </div>
                    <div className="flex items-center space-x-2">
                      {test.status === 'running' ? (
                        <HiPlay className="w-4 h-4 text-green-500" />
                      ) : (
                        <HiPause className="w-4 h-4 text-gray-500" />
                      )}
                      <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                        test.status === 'running' ? 'bg-green-100 text-green-700' :
                        test.status === 'completed' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
                      }`}>
                        {test.status.toUpperCase()}
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-4">{test.description}</p>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-xs text-gray-500 font-medium">Duration</p>
                      <p className="text-sm font-bold text-black">{test.duration}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-medium">Conversion Lift</p>
                      <p className="text-sm font-bold text-green-600">{test.conversionLift}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-medium">Revenue Impact</p>
                      <p className="text-sm font-bold text-green-600">{test.revenueImpact}</p>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">Participants: {test.participants.toLocaleString()}</span>
                      <span className="text-xs text-purple-600 font-medium">Click to view details →</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Test Details */}
            <div className="space-y-4">
              {selectedTest ? (
                <div className="bg-white rounded-lg p-6 shadow-sm border border-purple-200">
                  {(() => {
                    const test = runningTests.find(t => t.id === selectedTest);
                    if (!test) return null;
                    
                    return (
                      <>
                        <h3 className="text-xl font-bold text-black mb-4">Test Results: {test.name}</h3>
                        
                        {/* Visual Comparison */}
                        <div className="mb-6 bg-gray-50 rounded-lg p-4 border border-gray-200">
                          <h4 className="font-bold text-black mb-4 text-center">Visual Comparison</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Before Image */}
                            <div className="text-center">
                              <h5 className="text-sm font-bold text-gray-700 mb-3">BEFORE (Control)</h5>
                              <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-200">
                                <img 
                                  src="/ab-before.png" 
                                  alt="Control version - before optimization"
                                  className="w-full max-w-[120px] mx-auto rounded-lg shadow-sm"
                                />
                              </div>
                            </div>
                            
                            {/* After Image */}
                            <div className="text-center">
                              <h5 className="text-sm font-bold text-gray-700 mb-3">AFTER (Variant)</h5>
                              <div className="bg-white rounded-lg p-3 shadow-sm border border-green-200">
                                <img 
                                  src="/ab-after.png" 
                                  alt="Variant version - after optimization"
                                  className="w-full max-w-[120px] mx-auto rounded-lg shadow-sm"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-4">
                          {/* Control Variant */}
                          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                            <div className="flex items-center justify-between mb-3">
                              <h4 className="font-bold text-black">Control</h4>
                              <span className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded-full">BASELINE</span>
                            </div>
                            <p className="text-sm text-gray-600 mb-3">{test.variants.control.name}</p>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <p className="text-xs text-gray-500">Conversion Rate</p>
                                <p className="text-lg font-bold text-black">{test.variants.control.conversion}%</p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500">Revenue</p>
                                <p className="text-lg font-bold text-black">{formatCurrency(test.variants.control.revenue)}</p>
                              </div>
                            </div>
                          </div>

                          {/* Test Variant */}
                          <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                            <div className="flex items-center justify-between mb-3">
                              <h4 className="font-bold text-black">Variant</h4>
                              <span className="text-xs bg-green-200 text-green-700 px-2 py-1 rounded-full">WINNER</span>
                            </div>
                            <p className="text-sm text-gray-600 mb-3">{test.variants.variant.name}</p>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <p className="text-xs text-gray-500">Conversion Rate</p>
                                <p className="text-lg font-bold text-black">{test.variants.variant.conversion}%</p>
                                <p className="text-xs text-green-600 font-medium">
                                  +{((test.variants.variant.conversion / test.variants.control.conversion - 1) * 100).toFixed(1)}%
                                </p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500">Revenue</p>
                                <p className="text-lg font-bold text-black">{formatCurrency(test.variants.variant.revenue)}</p>
                                <p className="text-xs text-green-600 font-medium">
                                  +{formatCurrency(test.variants.variant.revenue - test.variants.control.revenue)}
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex space-x-3 pt-4">
                            {test.status === 'running' ? (
                              <>
                                <button className="bg-red-100 text-red-700 px-4 py-2 rounded-lg font-bold hover:bg-red-200 transition-colors flex-1">
                                  Stop Test
                                </button>
                                <button className="bg-green-100 text-green-700 px-4 py-2 rounded-lg font-bold hover:bg-green-200 transition-colors flex-1">
                                  Apply Winner
                                </button>
                              </>
                            ) : (
                              <button className="bg-purple-300 text-black px-4 py-2 rounded-lg font-bold hover:bg-purple-400 transition-colors w-full">
                                View Full Report
                              </button>
                            )}
                          </div>
                        </div>
                      </>
                    );
                  })()}
                </div>
              ) : (
                <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-100 text-center">
                  <HiEye className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-bold text-gray-600 mb-2">Select a Test</h3>
                  <p className="text-sm text-gray-500">Click on any test to view detailed results and performance metrics.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* SDK Integration Section */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-black">SDK Integration</h2>
            <button 
              onClick={() => setShowSDKIntegration(!showSDKIntegration)}
              className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-bold hover:bg-gray-200 transition-colors flex items-center space-x-2"
            >
              <HiCode className="w-4 h-4" />
              <span>{showSDKIntegration ? 'Hide' : 'Show'} Integration Code</span>
            </button>
          </div>

          {showSDKIntegration && (
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
              {/* Your API Key */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-black mb-3">Your API Key</h3>
                <div className="flex items-center space-x-2">
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 font-mono text-sm flex-1 break-all">
                    {userApiKey}
                  </div>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(userApiKey);
                    }}
                    className="bg-amber-600 hover:bg-amber-700 text-white px-3 py-2 rounded-lg font-medium transition-colors flex items-center space-x-1"
                    title="Copy API key"
                  >
                    <HiClipboard className="w-4 h-4" />
                    <span>Copy</span>
                  </button>
                </div>
              </div>

              {/* Integration Code */}
              <div>
                <h3 className="text-lg font-semibold text-black mb-3">Integration Code</h3>
                
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                  {/* Tab Navigation */}
                  <div className="border-b border-gray-200 bg-gray-50">
                    <div className="flex flex-wrap">
                      {Object.entries(codeExamples).map(([key, example]) => (
                        <button
                          key={key}
                          onClick={() => setActiveTab(key as keyof typeof codeExamples)}
                          className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                            activeTab === key
                              ? 'border-purple-500 text-purple-600 bg-white'
                              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                          }`}
                        >
                          {example.title}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Code Content */}
                  <div className="p-0">
                    <div className="relative">
                      <div className="absolute top-4 right-4 z-10">
                        <button
                          onClick={() => navigator.clipboard.writeText(
                            codeExamples[activeTab].code.replace('YOUR_API_KEY', userApiKey)
                          )}
                          className="text-gray-400 hover:text-gray-600 transition-colors bg-gray-800 hover:bg-gray-700 p-2 rounded"
                          title="Copy code"
                        >
                          <HiClipboard className="w-4 h-4" />
                        </button>
                      </div>
                      <SyntaxHighlighter
                        language={codeExamples[activeTab].language}
                        style={tomorrow}
                        customStyle={{
                          margin: 0,
                          borderRadius: 0,
                          fontSize: '14px',
                          lineHeight: '1.5',
                        }}
                        codeTagProps={{
                          style: {
                            fontSize: '14px',
                            fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
                          }
                        }}
                      >
                        {codeExamples[activeTab].code.replace('YOUR_API_KEY', userApiKey)}
                      </SyntaxHighlighter>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* API Key Management */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-black">API Key Management</h2>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
            {loadingApiKeys ? (
              <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
                <p className="text-gray-600 mt-2">Loading API keys...</p>
              </div>
            ) : apiKeys.length === 0 ? (
              <div className="p-8 text-center">
                <HiKey className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-gray-600 mb-2">No API Keys</h3>
                <p className="text-sm text-gray-500">Create your first API key in the onboarding flow.</p>
              </div>
            ) : (
              <>
                {/* Table Header */}
                <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
                  <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray-700">
                    <div className="col-span-3">Name</div>
                    <div className="col-span-4">Key</div>
                    <div className="col-span-2">Created</div>
                    <div className="col-span-2">Status</div>
                    <div className="col-span-1">Actions</div>
                  </div>
                </div>

                {/* Table Body */}
                <div className="divide-y divide-gray-200">
                  {apiKeys.map((apiKey) => (
                    <div key={apiKey.id} className="px-6 py-4 hover:bg-gray-50">
                      <div className="grid grid-cols-12 gap-4 items-center">
                        {/* Name */}
                        <div className="col-span-3">
                          <div className="flex items-center space-x-2">
                            <HiKey className="w-4 h-4 text-gray-400" />
                            <span className="font-medium text-gray-900">{apiKey.name}</span>
                          </div>
                        </div>

                        {/* Key (Redacted) */}
                        <div className="col-span-4">
                          <div className="flex items-center space-x-2">
                            <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono text-gray-700">
                              {apiKey.key_prefix}
                            </code>
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(apiKey.key_prefix);
                                // Could add a toast notification here
                                alert('Redacted key copied! Full keys are only shown once during creation.');
                              }}
                              className="text-gray-400 hover:text-gray-600 transition-colors"
                              title="Copy redacted key"
                            >
                              <HiClipboard className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* Created Date */}
                        <div className="col-span-2">
                          <span className="text-sm text-gray-600">
                            {new Date(apiKey.created_at).toLocaleDateString()}
                          </span>
                        </div>

                        {/* Status */}
                        <div className="col-span-2">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            apiKey.is_active 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {apiKey.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </div>

                        {/* Actions */}
                        <div className="col-span-1">
                          <button
                            onClick={() => handleDeleteApiKey(apiKey.id, apiKey.name)}
                            className="text-red-400 hover:text-red-600 transition-colors p-1 rounded hover:bg-red-50"
                            title="Delete API key"
                          >
                            <HiTrash className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}