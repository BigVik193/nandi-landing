'use client';

import { HiArrowRight } from 'react-icons/hi';

interface PathSelectionProps {
  onNext: (data: any) => void;
  onBack: () => void;
  userData: any;
}

export default function PathSelection({ onNext, onBack, userData }: PathSelectionProps) {
  const handlePathSelection = (path: 'existing' | 'new') => {
    onNext({ 
      storePath: path,
      redirectToEntities: true
    });
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 max-w-2xl mx-auto">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
          <span className="text-xl">🛤️</span>
        </div>
        <h2 className="text-2xl font-bold text-black mb-4">Choose Your Path</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Tell us about your current store setup to get started with the right approach for your game.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {/* Existing Store Path */}
        <div 
          className="bg-white border-2 border-gray-300 rounded-2xl p-8 cursor-pointer transition-all hover:border-purple-300 hover:shadow-lg group"
          onClick={() => handlePathSelection('existing')}
        >
          <div className="w-16 h-16 bg-green-300 rounded-full flex items-center justify-center mb-6 mx-auto">
            <span className="text-2xl">🏪</span>
          </div>
          <h3 className="font-bold text-xl mb-4 text-center">I already have a dynamic in-game store</h3>
          <p className="text-gray-600 text-center mb-6">
            You have server-driven store config, remote config, or cloud content delivery already set up.
          </p>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-700">Map entities to your codebase</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-700">Start A/B testing immediately</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-700">Access live dashboard</span>
            </div>
          </div>
          <div className="mt-6 text-center">
            <div className="inline-flex items-center text-green-600 font-medium group-hover:text-green-700">
              <span>Continue with existing store</span>
              <HiArrowRight className="w-4 h-4 ml-2" />
            </div>
          </div>
        </div>

        {/* New Store Path */}
        <div 
          className="bg-white border-2 border-gray-300 rounded-2xl p-8 cursor-pointer transition-all hover:border-purple-300 hover:shadow-lg group"
          onClick={() => handlePathSelection('new')}
        >
          <div className="w-16 h-16 bg-blue-300 rounded-full flex items-center justify-center mb-6 mx-auto">
            <span className="text-2xl">✨</span>
          </div>
          <h3 className="font-bold text-xl mb-4 text-center">I need a new in-game store from scratch</h3>
          <p className="text-gray-600 text-center mb-6">
            Build a dynamic store system with AI assistance using our intelligent store builder.
          </p>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-sm text-gray-700">Define game entities first</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-sm text-gray-700">AI-powered store development</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-sm text-gray-700">Custom store builder</span>
            </div>
          </div>
          <div className="mt-6 text-center">
            <div className="inline-flex items-center text-blue-600 font-medium group-hover:text-blue-700">
              <span>Build new store</span>
              <HiArrowRight className="w-4 h-4 ml-2" />
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between pt-6">
        <button
          type="button"
          onClick={onBack}
          className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors"
        >
          Back
        </button>
      </div>
    </div>
  );
}