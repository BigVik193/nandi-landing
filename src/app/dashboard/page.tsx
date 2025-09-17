'use client';

import { useState } from 'react';
import { HiTrendingUp, HiTrendingDown, HiEye, HiCurrencyDollar, HiUsers, HiChartBar, HiCog, HiPlay, HiPause, HiPlus } from 'react-icons/hi';

export default function DashboardPage() {
  const [selectedTest, setSelectedTest] = useState<string | null>(null);

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
            <button 
              onClick={() => window.location.href = '/build'}
              className="bg-black text-white px-4 py-2 rounded-lg font-bold hover:bg-gray-800 transition-colors"
            >
              Store Builder
            </button>
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
      </div>
    </div>
  );
}