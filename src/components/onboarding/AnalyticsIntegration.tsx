'use client';

import { useState } from 'react';
import { HiCheckCircle, HiExternalLink, HiChartBar } from 'react-icons/hi';

interface AnalyticsIntegrationProps {
  onNext: (data: any) => void;
  onBack: () => void;
  userData: any;
}

export default function AnalyticsIntegration({ onNext, onBack, userData }: AnalyticsIntegrationProps) {
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'connecting' | 'connected' | 'skipped'>('idle');

  const analyticsPlatforms = [
    {
      id: 'unity-analytics',
      name: 'Unity Analytics',
      description: 'Native Unity analytics and monetization insights',
      icon: '🎮',
      color: 'bg-gray-900 text-white',
      popular: true
    },
    {
      id: 'gameanalytics',
      name: 'GameAnalytics',
      description: 'Comprehensive game analytics and player behavior tracking',
      icon: '📊',
      color: 'bg-blue-600 text-white',
      popular: true
    },
    {
      id: 'firebase',
      name: 'Google Analytics for Firebase',
      description: 'Mobile app analytics with Google ecosystem integration',
      icon: '🔥',
      color: 'bg-orange-500 text-white',
      popular: false
    },
    {
      id: 'amplitude',
      name: 'Amplitude',
      description: 'Product analytics for user journey optimization',
      icon: '📈',
      color: 'bg-purple-600 text-white',
      popular: false
    },
    {
      id: 'mixpanel',
      name: 'Mixpanel',
      description: 'Event tracking and user analytics platform',
      icon: '🎯',
      color: 'bg-indigo-600 text-white',
      popular: false
    }
  ];

  const handleConnect = async (platformId: string) => {
    setSelectedPlatform(platformId);
    setConnectionStatus('connecting');
    
    // Simulate connection process
    setTimeout(() => {
      setConnectionStatus('connected');
    }, 2000);
  };

  const handleSkip = () => {
    setConnectionStatus('skipped');
    onNext({ analyticsSkipped: true });
  };

  const handleContinue = () => {
    onNext({ 
      analyticsConnected: true, 
      analyticsPlatform: selectedPlatform 
    });
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 max-w-2xl mx-auto">
      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
        <HiChartBar className="w-6 h-6 text-gray-600" />
      </div>
      <h2 className="text-2xl font-bold mb-6 text-center text-black">Connect Your Analytics</h2>
      <p className="text-gray-600 text-center mb-8">
        Connect your existing analytics platform to unlock deeper insights and optimize your store performance. 
        This helps us understand your player behavior and revenue patterns.
      </p>

      {connectionStatus === 'connected' ? (
        // Success State
        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <HiCheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-2xl font-bold text-black mb-2">Successfully Connected!</h3>
          <p className="text-gray-600 mb-6">
            Your {analyticsPlatforms.find(p => p.id === selectedPlatform)?.name} account is now connected. 
            We'll use this data to optimize your in-game store performance.
          </p>
          <div className="flex justify-between pt-6">
            <button
              type="button"
              onClick={onBack}
              className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              Back
            </button>
            <button
              onClick={handleContinue}
              className="bg-black text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-800 transition-colors"
            >
              Continue Setup
            </button>
          </div>
        </div>
      ) : connectionStatus === 'connecting' ? (
        // Connecting State
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
          <h3 className="text-2xl font-bold text-black mb-2">Connecting...</h3>
          <p className="text-gray-600 mb-6">
            Establishing connection with {analyticsPlatforms.find(p => p.id === selectedPlatform)?.name}
          </p>
        </div>
      ) : (
        // Platform Selection
        <div className="space-y-6">
          {/* Popular Platforms */}
          <div>
            <h3 className="text-lg font-bold text-black mb-4 flex items-center">
              <span className="mr-2">⭐</span>
              Most Popular
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {analyticsPlatforms.filter(p => p.popular).map((platform) => (
                <div
                  key={platform.id}
                  className="bg-white rounded-xl p-6 border-2 border-gray-300 cursor-pointer hover:border-purple-300 hover:shadow-lg transition-all"
                  onClick={() => handleConnect(platform.id)}
                >
                  <div className="flex items-start space-x-4">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${platform.color}`}>
                      <span className="text-2xl">{platform.icon}</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-black text-lg mb-1">{platform.name}</h4>
                      <p className="text-gray-600 text-sm mb-3">{platform.description}</p>
                      <div className="flex items-center text-purple-600 text-sm font-medium">
                        <span>Connect Account</span>
                        <HiExternalLink className="w-4 h-4 ml-1" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Other Platforms */}
          <div>
            <h3 className="text-lg font-bold text-black mb-4">Other Platforms</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {analyticsPlatforms.filter(p => !p.popular).map((platform) => (
                <div
                  key={platform.id}
                  className="bg-white rounded-xl p-4 border-2 border-gray-300 cursor-pointer hover:border-purple-300 hover:shadow-lg transition-all"
                  onClick={() => handleConnect(platform.id)}
                >
                  <div className="text-center">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${platform.color} mx-auto mb-3`}>
                      <span className="text-xl">{platform.icon}</span>
                    </div>
                    <h4 className="font-bold text-black text-sm mb-1">{platform.name}</h4>
                    <p className="text-gray-600 text-xs mb-2">{platform.description}</p>
                    <div className="text-purple-600 text-xs font-medium">
                      Connect
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Skip Option and Navigation */}
          <div className="pt-8 border-t border-gray-200">
            <div className="text-center mb-6">
              <p className="text-gray-600 mb-4">
                Don't have analytics set up yet? No problem!
              </p>
              <button
                onClick={handleSkip}
                className="bg-white text-black px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors border-2 border-gray-300"
              >
                Skip for Now
              </button>
              <p className="text-xs text-gray-500 mt-2">
                You can always connect your analytics later from the dashboard settings.
              </p>
            </div>
            
            <div className="flex justify-between">
              <button
                type="button"
                onClick={onBack}
                className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                Back
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}