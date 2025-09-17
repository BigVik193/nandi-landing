'use client';

import { useState } from 'react';
import { HiCheck, HiCog, HiColorSwatch, HiCurrencyDollar, HiPhotograph, HiPencil } from 'react-icons/hi';

interface StorePermissionsProps {
  onNext: (data: any) => void;
  onBack: () => void;
  userData: any;
}

export default function StorePermissions({ onNext, onBack, userData }: StorePermissionsProps) {
  const [selectedAreas, setSelectedAreas] = useState<{[key: string]: string[]}>({});
  
  // Mock store areas that can be controlled
  const storeAreas = [
    {
      id: 'main_store',
      name: 'Main Store Panel',
      description: 'Primary store interface with item grid',
      position: { top: '10%', left: '10%', width: '35%', height: '40%' },
      permissions: ['colors', 'layout', 'pricing', 'featured_items']
    },
    {
      id: 'currency_display', 
      name: 'Currency Display',
      description: 'Shows player currencies (gems, coins)',
      position: { top: '5%', right: '10%', width: '25%', height: '15%' },
      permissions: ['colors', 'icons', 'positioning']
    },
    {
      id: 'featured_bundle',
      name: 'Featured Bundle',
      description: 'Highlighted special offer section',
      position: { top: '15%', right: '10%', width: '25%', height: '35%' },
      permissions: ['colors', 'pricing', 'wording', 'icons', 'layout']
    },
    {
      id: 'item_details',
      name: 'Item Details Popup',
      description: 'Modal showing individual item information',
      position: { bottom: '15%', left: '20%', width: '60%', height: '30%' },
      permissions: ['colors', 'wording', 'pricing', 'icons']
    },
    {
      id: 'navigation_tabs',
      name: 'Store Navigation',
      description: 'Tabs for different store categories',
      position: { bottom: '5%', left: '10%', width: '80%', height: '10%' },
      permissions: ['colors', 'wording', 'layout']
    }
  ];

  const permissionTypes = {
    colors: { name: 'Colors & Themes', icon: HiColorSwatch, color: 'bg-red-100 text-red-800 border-red-300' },
    pricing: { name: 'Pricing & Offers', icon: HiCurrencyDollar, color: 'bg-green-100 text-green-800 border-green-300' },
    wording: { name: 'Text & Copy', icon: HiPencil, color: 'bg-blue-100 text-blue-800 border-blue-300' },
    icons: { name: 'Icons & Assets', icon: HiPhotograph, color: 'bg-purple-100 text-purple-800 border-purple-300' },
    layout: { name: 'Layout & Position', icon: HiCog, color: 'bg-gray-100 text-gray-800 border-gray-300' },
    featured_items: { name: 'Featured Items', icon: HiCheck, color: 'bg-yellow-100 text-yellow-800 border-yellow-300' },
    positioning: { name: 'Positioning', icon: HiCog, color: 'bg-indigo-100 text-indigo-800 border-indigo-300' }
  };

  const handlePermissionToggle = (areaId: string, permission: string) => {
    setSelectedAreas(prev => {
      const areaPermissions = prev[areaId] || [];
      const newPermissions = areaPermissions.includes(permission)
        ? areaPermissions.filter(p => p !== permission)
        : [...areaPermissions, permission];
      
      return {
        ...prev,
        [areaId]: newPermissions
      };
    });
  };

  const getAreaPermissionCount = (areaId: string) => {
    return selectedAreas[areaId]?.length || 0;
  };

  const getTotalSelectedAreas = () => {
    return Object.keys(selectedAreas).filter(areaId => selectedAreas[areaId]?.length > 0).length;
  };

  const handleFinalize = () => {
    onNext({
      storePermissions: selectedAreas,
      permissionsComplete: true
    });
  };

  return (
    <div className="min-h-screen bg-hero">
      {/* Header */}
      <div className="pt-8 pb-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <h1 className="text-3xl font-bold text-center text-black mb-2">
            Store Permissions
          </h1>
          <p className="text-gray-600 text-center">
            Select which parts of your store Nandi can optimize and the permissions for each area
          </p>
        </div>
      </div>

      {/* Main Interface */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 pb-8">
        <div className="grid lg:grid-cols-3 gap-6">
          
          {/* Store Preview */}
          <div className="lg:col-span-2">
            <div className="bg-section rounded-2xl border-2 border-black p-6">
              <div className="mb-4">
                <h2 className="font-semibold text-lg mb-2">Live Store Preview</h2>
                <p className="text-sm text-gray-600">
                  Click on areas to grant Nandi permissions for optimization
                </p>
              </div>
              
              {/* Mock Store Interface */}
              <div className="relative bg-gradient-to-br from-blue-900 to-purple-900 rounded-xl h-96 overflow-hidden">
                {/* Background pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div className="grid grid-cols-8 grid-rows-6 h-full">
                    {Array.from({ length: 48 }).map((_, i) => (
                      <div key={i} className="border border-white border-opacity-20"></div>
                    ))}
                  </div>
                </div>

                {/* Clickable Store Areas */}
                {storeAreas.map((area) => {
                  const permissionCount = getAreaPermissionCount(area.id);
                  const hasPermissions = permissionCount > 0;
                  
                  return (
                    <div
                      key={area.id}
                      className={`absolute cursor-pointer transition-all duration-200 ${
                        hasPermissions 
                          ? 'bg-green-400 bg-opacity-20 border-2 border-green-400' 
                          : 'bg-white bg-opacity-10 border-2 border-white border-opacity-30 hover:bg-opacity-20'
                      }`}
                      style={{
                        top: area.position.top,
                        left: area.position.left,
                        right: area.position.right,
                        bottom: area.position.bottom,
                        width: area.position.width,
                        height: area.position.height
                      }}
                    >
                      <div className="p-2 h-full flex flex-col justify-center items-center text-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${
                          hasPermissions ? 'bg-green-500' : 'bg-white bg-opacity-30'
                        }`}>
                          {hasPermissions ? (
                            <HiCheck className="w-4 h-4 text-white" />
                          ) : (
                            <HiCog className="w-4 h-4 text-white" />
                          )}
                        </div>
                        <p className="text-white text-xs font-medium">{area.name}</p>
                        {hasPermissions && (
                          <p className="text-green-200 text-xs mt-1">
                            {permissionCount} permission{permissionCount !== 1 ? 's' : ''}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Permissions Panel */}
          <div className="bg-section rounded-2xl border-2 border-black flex flex-col">
            <div className="p-6 border-b border-gray-200">
              <h2 className="font-semibold text-lg mb-2">Area Permissions</h2>
              <p className="text-sm text-gray-600">
                {getTotalSelectedAreas()} of {storeAreas.length} areas configured
              </p>
            </div>

            <div className="flex-1 p-6 overflow-y-auto space-y-6">
              {storeAreas.map((area) => (
                <div key={area.id} className="border-2 border-gray-200 rounded-lg p-4">
                  <div className="mb-3">
                    <h3 className="font-semibold text-sm">{area.name}</h3>
                    <p className="text-xs text-gray-600">{area.description}</p>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-gray-700 mb-2">Grant permissions for:</p>
                    {area.permissions.map((permission) => {
                      const permType = permissionTypes[permission as keyof typeof permissionTypes];
                      const isSelected = selectedAreas[area.id]?.includes(permission);
                      
                      return (
                        <label
                          key={permission}
                          className="flex items-center space-x-2 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handlePermissionToggle(area.id, permission)}
                            className="w-3 h-3 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                          />
                          <div className={`px-2 py-1 rounded text-xs border ${permType.color}`}>
                            <div className="flex items-center space-x-1">
                              <permType.icon className="w-3 h-3" />
                              <span>{permType.name}</span>
                            </div>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="p-6 border-t border-gray-200 bg-gray-50">
              <h3 className="font-semibold text-sm mb-2">Permissions Summary</h3>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span>Areas configured:</span>
                  <span className="font-medium">{getTotalSelectedAreas()}/{storeAreas.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total permissions:</span>
                  <span className="font-medium">
                    {Object.values(selectedAreas).reduce((sum, perms) => sum + perms.length, 0)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Completion Summary */}
        {getTotalSelectedAreas() > 0 && (
          <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-6">
            <h3 className="font-semibold text-green-800 mb-3">🎉 Permissions Configured!</h3>
            <p className="text-green-700 mb-4">
              Nandi now has permission to optimize {getTotalSelectedAreas()} areas of your store with{' '}
              {Object.values(selectedAreas).reduce((sum, perms) => sum + perms.length, 0)} total permissions.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(selectedAreas)
                .filter(([_, perms]) => perms.length > 0)
                .map(([areaId, permissions]) => {
                  const area = storeAreas.find(a => a.id === areaId);
                  return (
                    <div key={areaId} className="bg-white rounded-lg p-3 border border-green-200">
                      <h4 className="font-medium text-sm text-green-800">{area?.name}</h4>
                      <p className="text-xs text-green-600 mt-1">
                        {permissions.length} permission{permissions.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                  );
                })}
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between pt-6">
          <button
            onClick={onBack}
            className="border-2 border-black text-black px-8 py-4 rounded-full font-medium text-lg hover:bg-black hover:text-white transition-colors"
          >
            Back
          </button>
          
          <button
            onClick={handleFinalize}
            disabled={getTotalSelectedAreas() === 0}
            className={`px-8 py-4 rounded-full font-medium text-lg transition-colors ring-4 ring-orange-300 ring-offset-2 ${
              getTotalSelectedAreas() > 0
                ? 'bg-black text-white hover:bg-gray-800'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Launch Your Optimized Store
          </button>
        </div>
      </div>
    </div>
  );
}