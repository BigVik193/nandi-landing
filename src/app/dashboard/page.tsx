'use client';

import { useState, useEffect } from 'react';
import { HiTrendingUp, HiTrendingDown, HiEye, HiCurrencyDollar, HiUsers, HiChartBar, HiPlay, HiPause, HiPlus, HiTrash, HiPencil, HiCheckCircle, HiXCircle, HiClock, HiCode, HiClipboard, HiKey, HiLogout } from 'react-icons/hi';
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

interface SkuVariant {
  id: string;
  app_store_product_id: string;
  price_cents: number;
  quantity: number;
  currency: string;
  platform: string;
}

interface ExperimentArm {
  id: string;
  name: string;
  traffic_weight: number;
  is_control: boolean;
  sku_variants: SkuVariant;
}

interface VirtualItem {
  id: string;
  name: string;
  type: string;
  subtype?: string;
}

interface Experiment {
  id: string;
  name: string;
  description?: string;
  status: 'draft' | 'running' | 'paused' | 'completed' | 'archived';
  traffic_allocation: number;
  start_date?: string;
  end_date?: string;
  created_at: string;
  updated_at: string;
  virtual_items: VirtualItem;
  experiment_arms?: ExperimentArm[];
}

interface ExperimentResult {
  armId: string;
  armName: string;
  isControl: boolean;
  trafficWeight: number;
  skuVariant: SkuVariant;
  impressions: number;
  views: number;
  purchases: number;
  revenue: number;
  conversionRate: number;
  averageRevenuePerUser: number;
  storeViews?: number;
  itemViews?: number;
  clickThroughRate?: number;
  viewToStoreConversion?: number;
}

export default function DashboardPage() {
  const { user, games, selectedGame, selectGame, signOut } = useAuth();
  const [experiments, setExperiments] = useState<Experiment[]>([]);
  const [selectedExperiment, setSelectedExperiment] = useState<string | null>(null);
  const [experimentResults, setExperimentResults] = useState<ExperimentResult[]>([]);
  const [loadingExperiments, setLoadingExperiments] = useState(true);
  const [loadingResults, setLoadingResults] = useState(false);
  const [timeframe, setTimeframe] = useState('7d');
  const [activeTab, setActiveTab] = useState<keyof typeof codeExamples>('unity');
  const [showSDKIntegration, setShowSDKIntegration] = useState(false);
  const [apiKeys, setApiKeys] = useState<any[]>([]);
  const [loadingApiKeys, setLoadingApiKeys] = useState(true);
  const [analytics, setAnalytics] = useState<any>(null);
  const [loadingAnalytics, setLoadingAnalytics] = useState(true);
  
  // Use the first API key for code examples, or fallback to mock
  const userApiKey = apiKeys.length > 0 ? apiKeys[0].key_prefix.replace('...', 'abc123def456') : "nandi_prod_2024_abc123def456";

  // Load experiments when selectedGame is available
  useEffect(() => {
    if (selectedGame) {
      loadExperiments(selectedGame.id);
    }
  }, [selectedGame]);

  // Fetch API keys
  useEffect(() => {
    const fetchApiKeys = async () => {
      if (!user || !selectedGame) return;
      
      try {
        const response = await fetch(`/api/api-keys?gameId=${selectedGame.id}`);
        
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
  }, [user, selectedGame]);

  // Fetch analytics data
  useEffect(() => {
    const fetchAnalytics = async () => {
      if (!selectedGame) return;
      
      setLoadingAnalytics(true);
      try {
        const response = await fetch(`/api/games/${selectedGame.id}/analytics?timeframe=${timeframe}`);
        
        if (response.ok) {
          const data = await response.json();
          setAnalytics(data.analytics);
        } else {
          console.error('Failed to fetch analytics:', response.statusText);
          setAnalytics(null);
        }
      } catch (error) {
        console.error('Failed to fetch analytics:', error);
        setAnalytics(null);
      } finally {
        setLoadingAnalytics(false);
      }
    };

    fetchAnalytics();
  }, [selectedGame, timeframe]);

  // Delete API key
  const handleDeleteApiKey = async (apiKeyId: string, name: string) => {
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

  const loadExperiments = async (gameId: string) => {
    setLoadingExperiments(true);
    try {
      const response = await fetch(`/api/experiments?gameId=${gameId}`);
      const data = await response.json();
      
      if (response.ok) {
        setExperiments(data.experiments || []);
        if (data.experiments?.length > 0) {
          setSelectedExperiment(data.experiments[0].id);
        }
      } else {
        console.error('Failed to load experiments:', data.error);
        setExperiments([]);
      }
    } catch (error) {
      console.error('Error loading experiments:', error);
      setExperiments([]);
    } finally {
      setLoadingExperiments(false);
    }
  };


  const loadExperimentResults = async (experimentId: string, timeframe: string) => {
    setLoadingResults(true);
    try {
      const response = await fetch(`/api/experiments/${experimentId}/results?timeframe=${timeframe}`);
      const data = await response.json();
      
      if (response.ok) {
        setExperimentResults(data.results || []);
      } else {
        console.error('Failed to load experiment results:', data.error);
        setExperimentResults([]);
      }
    } catch (error) {
      console.error('Error loading experiment results:', error);
      setExperimentResults([]);
    } finally {
      setLoadingResults(false);
    }
  };

  // Load results when selected experiment changes
  useEffect(() => {
    if (selectedExperiment) {
      loadExperimentResults(selectedExperiment, timeframe);
    } else {
      setExperimentResults([]);
    }
  }, [selectedExperiment, timeframe]);

  const updateExperimentStatus = async (experimentId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/experiments/${experimentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        // Reload experiments to get updated data
        if (selectedGame) {
          loadExperiments(selectedGame.id);
        }
      } else {
        const error = await response.json();
        alert('Error updating experiment: ' + error.error);
      }
    } catch (error) {
      console.error('Error updating experiment status:', error);
      alert('Error updating experiment');
    }
  };

  const deleteExperiment = async (experimentId: string) => {
    if (!confirm('Are you sure you want to delete this experiment? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`/api/experiments/${experimentId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Reload experiments
        if (selectedGame) {
          loadExperiments(selectedGame.id);
        }
        // Clear selection if this experiment was selected
        if (selectedExperiment === experimentId) {
          setSelectedExperiment(null);
        }
      } else {
        const error = await response.json();
        alert('Error deleting experiment: ' + error.error);
      }
    } catch (error) {
      console.error('Error deleting experiment:', error);
      alert('Error deleting experiment');
    }
  };

  const formatCurrency = (cents: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(cents / 100);
  };

  const formatPercent = (value: number) => {
    if (value === 0) return '0.0%';
    return `${value > 0 ? '+' : ''}${value.toFixed(1)}%`;
  };

  const getChangeColor = (value: number) => {
    if (value > 0) return 'text-green-500';
    if (value < 0) return 'text-red-500';
    return 'text-gray-500';
  };

  const getChangeIcon = (value: number) => {
    if (value > 0) return <HiTrendingUp className="w-4 h-4 text-green-500" />;
    if (value < 0) return <HiTrendingDown className="w-4 h-4 text-red-500" />;
    return <HiTrendingUp className="w-4 h-4 text-gray-500" />;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'running':
        return <HiPlay className="w-4 h-4 text-green-500" />;
      case 'paused':
        return <HiPause className="w-4 h-4 text-yellow-500" />;
      case 'completed':
        return <HiCheckCircle className="w-4 h-4 text-blue-500" />;
      case 'archived':
        return <HiXCircle className="w-4 h-4 text-gray-500" />;
      default:
        return <HiClock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running':
        return 'bg-green-100 text-green-700';
      case 'paused':
        return 'bg-yellow-100 text-yellow-700';
      case 'completed':
        return 'bg-blue-100 text-blue-700';
      case 'archived':
        return 'bg-gray-100 text-gray-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const calculateDuration = (startDate?: string, endDate?: string) => {
    if (!startDate) return 'Not started';
    
    const start = new Date(startDate);
    const end = endDate ? new Date(endDate) : new Date();
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays === 1 ? '1 day' : `${diffDays} days`;
  };

  const selectedExperimentData = experiments.find(exp => exp.id === selectedExperiment);

  // Use real analytics data or fallback to defaults
  const aggregateMetrics = analytics ? {
    revenue: analytics.overview.revenue,
    revenueChange: analytics.overview.revenueChange,
    conversionRate: analytics.overview.conversionRate,
    conversionRateChange: analytics.overview.conversionRateChange,
    users: analytics.overview.activeUsers,
    usersChange: analytics.overview.activeUsersChange,
    arpu: analytics.overview.arpu
  } : {
    revenue: 0,
    revenueChange: 0,
    conversionRate: 0,
    conversionRateChange: 0,
    users: 0,
    usersChange: 0,
    arpu: 0
  };

  // Recent activity data
  const recentActivity = analytics ? {
    storeViews: analytics.recentActivity.storeViews,
    storeViewsChange: analytics.recentActivity.storeViewsChange,
    itemViews: analytics.recentActivity.itemViews,
    itemViewsChange: analytics.recentActivity.itemViewsChange,
    activeExperiments: analytics.recentActivity.activeExperiments,
    purchases: analytics.recentActivity.purchases
  } : {
    storeViews: 0,
    storeViewsChange: 0,
    itemViews: 0,
    itemViewsChange: 0,
    activeExperiments: experiments.filter(exp => exp.status === 'running').length,
    purchases: 0
  };

  return (
    <div className="h-screen bg-gray-50 overflow-y-auto">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-3xl font-bold text-black">Dashboard</h1>
            <div className="flex items-center space-x-3">
              <select
                value={selectedGame?.id || ''}
                onChange={(e) => {
                  const gameId = e.target.value;
                  if (gameId === 'onboard') {
                    window.location.href = '/onboarding/project';
                  } else {
                    const game = games.find(g => g.id === gameId);
                    if (game) selectGame(game);
                  }
                }}
                className="px-4 py-3 border-2 border-gray-200 rounded-xl bg-white text-gray-900 font-medium shadow-sm hover:border-gray-300 focus:ring-2 focus:ring-black focus:border-black transition-all duration-200 min-w-56 appearance-none bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIiIGhlaWdodD0iOCIgdmlld0JveD0iMCAwIDEyIDgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGQ9Ik0xIDEuNUw2IDYuNUwxMSAxLjUiIHN0cm9rZT0iIzZCNzI4MCIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4KPC9zdmc+Cg==')] bg-no-repeat bg-[length:16px_10px] bg-[right_16px_center]"
              >
                {games.length === 0 ? (
                  <option value="" disabled className="text-gray-500">
                    No games yet
                  </option>
                ) : (
                  <option value="" disabled className="text-gray-500">
                    Select a game
                  </option>
                )}
                {games.map((game) => (
                  <option key={game.id} value={game.id} className="py-2">
                    🎮 {game.name}
                  </option>
                ))}
                <option value="onboard" className="font-semibold text-black py-2" style={{borderTop: '1px solid #e5e7eb'}}>
                  ✨ Add New Game
                </option>
              </select>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => window.location.href = '/docs/sdk'}
              className="bg-indigo-500 text-white px-4 py-2 rounded-lg font-bold hover:bg-indigo-600 transition-colors flex items-center space-x-2"
            >
              <HiCode className="w-4 h-4" />
              <span>SDK Docs</span>
            </button>
            <button 
              onClick={() => {
                if (selectedGame) {
                  window.location.href = `/games/${selectedGame.id}/virtual-items`;
                } else {
                  alert('Please select a game first');
                }
              }}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg font-bold hover:bg-blue-600 transition-colors"
            >
              Manage Virtual Items
            </button>
            <button 
              onClick={() => {
                if (selectedGame) {
                  window.location.href = `/games/${selectedGame.id}/store-config`;
                } else {
                  alert('Please select a game first');
                }
              }}
              className="bg-gray-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-gray-700 transition-colors flex items-center space-x-2"
            >
              <span>🏪</span>
              <span>Store Config</span>
            </button>
            <button 
              onClick={() => alert('Create experiment functionality will be added in the next iteration')}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-purple-700 transition-colors flex items-center space-x-2"
            >
              <HiPlus className="w-4 h-4" />
              <span>New Experiment</span>
            </button>
            <button 
              onClick={signOut}
              className="bg-gray-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-gray-700 transition-colors flex items-center space-x-2"
              title="Sign Out"
            >
              <HiLogout className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>

      {!selectedGame && games.length === 0 ? (
        <div className="p-6">
          <div className="bg-white rounded-lg p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Welcome to Nandi</h2>
            <p className="text-gray-600 mb-6">
              You don't have any games set up yet. Create a game during onboarding to start using the dashboard.
            </p>
            <button
              onClick={() => window.location.href = '/onboarding/project'}
              className="bg-purple-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-purple-700 transition-colors"
            >
              Start Onboarding
            </button>
          </div>
        </div>
      ) : !selectedGame ? (
        <div className="p-6">
          <div className="bg-white rounded-lg p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Loading...</h2>
            <p className="text-gray-600">Setting up your dashboard...</p>
          </div>
        </div>
      ) : (
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
                    <p className="text-2xl font-bold text-black">{formatCurrency(aggregateMetrics.revenue)}</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {getChangeIcon(aggregateMetrics.revenueChange)}
                <span className={`text-sm font-medium ${getChangeColor(aggregateMetrics.revenueChange)}`}>
                  {formatPercent(aggregateMetrics.revenueChange)} vs last period
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
                    <p className="text-sm text-gray-600 font-medium">Avg Conversion Rate</p>
                    <p className="text-2xl font-bold text-black">{aggregateMetrics.conversionRate.toFixed(1)}%</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {getChangeIcon(aggregateMetrics.conversionRateChange)}
                <span className={`text-sm font-medium ${getChangeColor(aggregateMetrics.conversionRateChange)}`}>
                  {formatPercent(aggregateMetrics.conversionRateChange)} vs last period
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
                    <p className="text-2xl font-bold text-black">{aggregateMetrics.users.toLocaleString()}</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {getChangeIcon(aggregateMetrics.usersChange)}
                <span className={`text-sm font-medium ${getChangeColor(aggregateMetrics.usersChange)}`}>
                  {formatPercent(aggregateMetrics.usersChange)} vs last period
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Events Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-black mb-6">Recent Activity</h2>
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-200">
              {/* Store Views */}
              <div className="p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="bg-blue-100 p-3 rounded-full">
                    <HiEye className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-black">Store Views</h3>
                    <p className="text-sm text-gray-600">Last {timeframe === '7d' ? '7 days' : timeframe === '30d' ? '30 days' : '90 days'}</p>
                  </div>
                </div>
                <p className="text-3xl font-bold text-black mb-2">{recentActivity.storeViews.toLocaleString()}</p>
                <div className="flex items-center space-x-1">
                  {getChangeIcon(recentActivity.storeViewsChange)}
                  <span className={`text-sm font-medium ${getChangeColor(recentActivity.storeViewsChange)}`}>
                    {formatPercent(recentActivity.storeViewsChange)}
                  </span>
                  <span className="text-sm text-gray-500">vs previous period</span>
                </div>
              </div>

              {/* Item Views */}
              <div className="p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="bg-purple-100 p-3 rounded-full">
                    <HiChartBar className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-black">Item Views</h3>
                    <p className="text-sm text-gray-600">Last {timeframe === '7d' ? '7 days' : timeframe === '30d' ? '30 days' : '90 days'}</p>
                  </div>
                </div>
                <p className="text-3xl font-bold text-black mb-2">{recentActivity.itemViews.toLocaleString()}</p>
                <div className="flex items-center space-x-1">
                  {getChangeIcon(recentActivity.itemViewsChange)}
                  <span className={`text-sm font-medium ${getChangeColor(recentActivity.itemViewsChange)}`}>
                    {formatPercent(recentActivity.itemViewsChange)}
                  </span>
                  <span className="text-sm text-gray-500">vs previous period</span>
                </div>
              </div>

              {/* Active Experiments */}
              <div className="p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="bg-green-100 p-3 rounded-full">
                    <HiPlay className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-black">Active Tests</h3>
                    <p className="text-sm text-gray-600">Currently running</p>
                  </div>
                </div>
                <p className="text-3xl font-bold text-black mb-2">
                  {recentActivity.activeExperiments}
                </p>
                <p className="text-sm text-gray-500">
                  {experiments.length} total experiments
                </p>
              </div>
            </div>
          </div>
        </div>


        {/* Experiments Section */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-black">Experiments</h2>
            <div className="flex items-center space-x-3">
              <select
                value={timeframe}
                onChange={(e) => setTimeframe(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
                <option value="all">All time</option>
              </select>
            </div>
          </div>

          {!selectedGame ? (
            <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-100 text-center">
              <HiChartBar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-gray-600 mb-2">Complete Setup First</h3>
              <p className="text-sm text-gray-500 mb-4">Finish your onboarding to start creating experiments.</p>
              <button 
                onClick={() => window.location.href = '/onboarding/project'}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-purple-700 transition-colors inline-flex items-center space-x-2"
              >
                <span>Complete Setup</span>
              </button>
            </div>
          ) : loadingExperiments ? (
            <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-100 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading experiments...</p>
            </div>
          ) : experiments.length === 0 ? (
            <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-100 text-center">
              <HiChartBar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-gray-600 mb-2">No Experiments Yet</h3>
              <p className="text-sm text-gray-500 mb-4">Create your first experiment to start optimizing your virtual items.</p>
              <button 
                onClick={() => alert('Create experiment functionality will be added in the next iteration')}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-purple-700 transition-colors inline-flex items-center space-x-2"
              >
                <HiPlus className="w-4 h-4" />
                <span>Create First Experiment</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Experiments List */}
              <div className="space-y-4">
                {experiments.map((experiment) => (
                  <div 
                    key={experiment.id}
                    onClick={() => setSelectedExperiment(selectedExperiment === experiment.id ? null : experiment.id)}
                    className={`bg-white rounded-lg p-6 shadow-sm border cursor-pointer hover:shadow-md transition-all ${
                      selectedExperiment === experiment.id ? 'border-purple-300 bg-purple-50 shadow-md' : 'border-gray-100 hover:border-gray-200'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${
                          experiment.status === 'running' ? 'bg-green-500' : 
                          experiment.status === 'completed' ? 'bg-blue-500' : 
                          experiment.status === 'paused' ? 'bg-yellow-500' : 'bg-gray-400'
                        }`}></div>
                        <h3 className="font-bold text-black text-lg">{experiment.name}</h3>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(experiment.status)}
                        <span className={`text-xs font-bold px-2 py-1 rounded-full ${getStatusColor(experiment.status)}`}>
                          {experiment.status.toUpperCase()}
                        </span>
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-4">
                      {experiment.description || `Testing variations of ${experiment.virtual_items?.name}`}
                    </p>
                    
                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div>
                        <p className="text-xs text-gray-500 font-medium">Virtual Item</p>
                        <p className="text-sm font-bold text-black">{experiment.virtual_items?.name}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 font-medium">Duration</p>
                        <p className="text-sm font-bold text-black">{calculateDuration(experiment.start_date, experiment.end_date)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 font-medium">Traffic</p>
                        <p className="text-sm font-bold text-black">{experiment.traffic_allocation}%</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                      <span className="text-xs text-gray-500">
                        Arms: {experiment.experiment_arms?.length || 0}
                      </span>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteExperiment(experiment.id);
                          }}
                          className="text-red-400 hover:text-red-600 p-1 rounded hover:bg-red-50"
                          title="Delete experiment"
                        >
                          <HiTrash className="w-4 h-4" />
                        </button>
                        <span className="text-xs text-purple-600 font-medium">Click for details →</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Experiment Details */}
              <div className="space-y-4">
                {selectedExperimentData ? (
                  <div className="bg-white rounded-lg p-6 shadow-sm border border-purple-200">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-bold text-black">{selectedExperimentData.name}</h3>
                      <div className="flex items-center space-x-2">
                        {selectedExperimentData.status === 'running' && (
                          <button
                            onClick={() => updateExperimentStatus(selectedExperimentData.id, 'paused')}
                            className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-lg text-sm font-medium hover:bg-yellow-200 transition-colors"
                          >
                            Pause
                          </button>
                        )}
                        {selectedExperimentData.status === 'paused' && (
                          <button
                            onClick={() => updateExperimentStatus(selectedExperimentData.id, 'running')}
                            className="bg-green-100 text-green-700 px-3 py-1 rounded-lg text-sm font-medium hover:bg-green-200 transition-colors"
                          >
                            Resume
                          </button>
                        )}
                        {(selectedExperimentData.status === 'running' || selectedExperimentData.status === 'paused') && (
                          <button
                            onClick={() => updateExperimentStatus(selectedExperimentData.id, 'completed')}
                            className="bg-blue-100 text-blue-700 px-3 py-1 rounded-lg text-sm font-medium hover:bg-blue-200 transition-colors"
                          >
                            Complete
                          </button>
                        )}
                      </div>
                    </div>

                    {loadingResults ? (
                      <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading results...</p>
                      </div>
                    ) : experimentResults.length === 0 ? (
                      <div className="text-center py-8">
                        <HiChartBar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <h4 className="text-lg font-bold text-gray-600 mb-2">No Results Yet</h4>
                        <p className="text-sm text-gray-500">Results will appear here once the experiment starts collecting data.</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <h4 className="font-bold text-black mb-4">Experiment Arms Performance</h4>
                        {experimentResults.map((result) => (
                          <div 
                            key={result.armId} 
                            className={`rounded-lg p-5 border ${
                              result.isControl ? 'bg-gray-50 border-gray-200' : 'bg-green-50 border-green-200'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-4">
                              <div>
                                <h5 className="font-bold text-black text-lg">{result.armName}</h5>
                                <p className="text-sm text-gray-600 mt-1">
                                  {formatCurrency(result.skuVariant?.price_cents || 0)} • 
                                  {result.skuVariant?.quantity || 1}x • 
                                  Traffic: {result.trafficWeight}%
                                </p>
                              </div>
                              <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                                result.isControl ? 'bg-gray-200 text-gray-700' : 'bg-green-200 text-green-700'
                              }`}>
                                {result.isControl ? 'CONTROL' : 'VARIANT'}
                              </span>
                            </div>

                            {/* Core Metrics */}
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                              <div className="text-center p-3 bg-white rounded-lg border">
                                <p className="text-xs text-gray-500 font-medium">Store Views</p>
                                <p className="text-xl font-bold text-black">{(result.storeViews || result.impressions || 0).toLocaleString()}</p>
                              </div>
                              <div className="text-center p-3 bg-white rounded-lg border">
                                <p className="text-xs text-gray-500 font-medium">Item Views</p>
                                <p className="text-xl font-bold text-black">{(result.itemViews || result.views || 0).toLocaleString()}</p>
                              </div>
                              <div className="text-center p-3 bg-white rounded-lg border">
                                <p className="text-xs text-gray-500 font-medium">Purchases</p>
                                <p className="text-xl font-bold text-black">{result.purchases.toLocaleString()}</p>
                              </div>
                              <div className="text-center p-3 bg-white rounded-lg border">
                                <p className="text-xs text-gray-500 font-medium">Revenue</p>
                                <p className="text-xl font-bold text-black">{formatCurrency(result.revenue)}</p>
                              </div>
                            </div>

                            {/* Conversion Metrics */}
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                              <div className="text-center p-3 bg-blue-50 rounded-lg border border-blue-200">
                                <p className="text-xs text-blue-600 font-medium">Store → Item Rate</p>
                                <p className="text-lg font-bold text-blue-700">
                                  {result.viewToStoreConversion 
                                    ? `${result.viewToStoreConversion.toFixed(1)}%`
                                    : result.impressions > 0 
                                      ? `${(((result.itemViews || result.views) / result.impressions) * 100).toFixed(1)}%`
                                      : '0.0%'
                                  }
                                </p>
                              </div>
                              <div className="text-center p-3 bg-purple-50 rounded-lg border border-purple-200">
                                <p className="text-xs text-purple-600 font-medium">Purchase Rate</p>
                                <p className="text-lg font-bold text-purple-700">{(result.conversionRate || 0).toFixed(1)}%</p>
                              </div>
                              <div className="text-center p-3 bg-green-50 rounded-lg border border-green-200">
                                <p className="text-xs text-green-600 font-medium">ARPU</p>
                                <p className="text-lg font-bold text-green-700">
                                  {formatCurrency(result.averageRevenuePerUser || 0)}
                                </p>
                              </div>
                            </div>

                            {/* Performance indicator */}
                            {!result.isControl && (
                              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                                <div className="flex items-center space-x-2">
                                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                                  <p className="text-sm text-yellow-700 font-medium">
                                    {result.conversionRate > (experimentResults.find(r => r.isControl)?.conversionRate || 0)
                                      ? `⬆️ ${(result.conversionRate - (experimentResults.find(r => r.isControl)?.conversionRate || 0)).toFixed(1)}% better than control`
                                      : `⬇️ ${(Math.abs(result.conversionRate - (experimentResults.find(r => r.isControl)?.conversionRate || 0))).toFixed(1)}% below control`
                                    }
                                  </p>
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-100 text-center">
                    <HiEye className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-gray-600 mb-2">Select an Experiment</h3>
                    <p className="text-sm text-gray-500">Click on any experiment to view detailed results and performance metrics.</p>
                  </div>
                )}
              </div>
            </div>
          )}
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
      )}
    </div>
  );
}