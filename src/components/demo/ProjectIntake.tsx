'use client';

import { useState } from 'react';
import { HiClipboardList } from 'react-icons/hi';

interface ProjectIntakeProps {
  onNext: (data: any) => void;
  onBack: () => void;
  userData: any;
}

export default function ProjectIntake({ onNext, onBack, userData }: ProjectIntakeProps) {
  const [formData, setFormData] = useState({
    gameTitle: userData.gameProjectName || '',
    genre: '',
    artStyle: '',
    pegiRegion: '',
    monetizationModel: '',
    platforms: [] as string[],
    techStack: '',
    currentStoreState: '',
    storeSurfaces: '',
    targetMetrics: {
      firstPurchaseRate: '',
      sevenDayPayerRate: '',
      arppu: ''
    }
  });

  const genres = [
    'Action', 'Adventure', 'RPG', 'Strategy', 'Puzzle', 'Simulation', 
    'Sports', 'Racing', 'Shooter', 'Platformer', 'Casual', 'Arcade'
  ];

  const artStyles = [
    '2D Cartoon', '3D Cartoon', 'Realistic', 'Pixel Art', 'Low Poly', 
    'Minimalist', 'Hand-drawn', 'Stylized'
  ];

  const pegiRegions = [
    'Global', 'North America', 'Europe', 'Asia Pacific', 'Latin America'
  ];

  const monetizationModels = [
    'Free-to-Play with IAP', 'Premium (Paid)', 'Freemium', 'Subscription', 
    'Ad-Supported', 'Hybrid'
  ];

  const platforms = ['iOS', 'Android'];

  const techStacks = ['Unity', 'Unreal Engine', 'Godot', 'Native iOS', 'Native Android', 'Flutter', 'React Native'];

  const handlePlatformChange = (platform: string) => {
    setFormData(prev => ({
      ...prev,
      platforms: prev.platforms.includes(platform)
        ? prev.platforms.filter(p => p !== platform)
        : [...prev.platforms, platform]
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext(formData);
  };

  return (
    <div className="bg-section rounded-2xl p-8 border-2 border-black shadow-lg">
      <div className="w-14 h-14 bg-purple-300 rounded-full flex items-center justify-center mb-6 mx-auto">
        <HiClipboardList className="w-7 h-7 text-purple-900" />
      </div>
      <h2 className="text-3xl font-bold mb-6 text-center text-black">Configure Your Game</h2>
      <p className="text-gray-600 text-center mb-8">
        Help us understand your game to optimize store performance and set up analytics
      </p>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Game Basics */}
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-black border-b-2 border-black pb-2">Game Information</h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Game Title
            </label>
            <input
              type="text"
              required
              value={formData.gameTitle}
              onChange={(e) => setFormData(prev => ({ ...prev, gameTitle: e.target.value }))}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="e.g., Mystic Legends RPG"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Genre
              </label>
              <select
                required
                value={formData.genre}
                onChange={(e) => setFormData(prev => ({ ...prev, genre: e.target.value }))}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="">Choose your game's genre</option>
                {genres.map(genre => (
                  <option key={genre} value={genre}>{genre}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Art Style
              </label>
              <select
                required
                value={formData.artStyle}
                onChange={(e) => setFormData(prev => ({ ...prev, artStyle: e.target.value }))}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="">Choose your art style</option>
                {artStyles.map(style => (
                  <option key={style} value={style}>{style}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                PEGI/ESRB Region Set
              </label>
              <select
                required
                value={formData.pegiRegion}
                onChange={(e) => setFormData(prev => ({ ...prev, pegiRegion: e.target.value }))}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="">Choose your target region</option>
                {pegiRegions.map(region => (
                  <option key={region} value={region}>{region}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Monetization Model
              </label>
              <select
                required
                value={formData.monetizationModel}
                onChange={(e) => setFormData(prev => ({ ...prev, monetizationModel: e.target.value }))}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="">Choose your monetization model</option>
                {monetizationModels.map(model => (
                  <option key={model} value={model}>{model}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Platforms */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-black border-b-2 border-black pb-2">Platforms</h3>
          <div className="flex gap-4">
            {platforms.map(platform => (
              <label key={platform} className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.platforms.includes(platform)}
                  onChange={() => handlePlatformChange(platform)}
                  className="mr-2 w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                />
                <span className="text-gray-700">{platform}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Tech Stack */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-black border-b-2 border-black pb-2">Technology</h3>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tech Stack
            </label>
            <select
              required
              value={formData.techStack}
              onChange={(e) => setFormData(prev => ({ ...prev, techStack: e.target.value }))}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="">Choose your development platform</option>
              {techStacks.map(stack => (
                <option key={stack} value={stack}>{stack}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Store Configuration */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-black border-b-2 border-black pb-2">Store Setup</h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Current Store State
            </label>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="currentStoreState"
                  value="augment"
                  checked={formData.currentStoreState === 'augment'}
                  onChange={(e) => setFormData(prev => ({ ...prev, currentStoreState: e.target.value }))}
                  className="mr-2 w-4 h-4 text-purple-600 border-gray-300 focus:ring-purple-500"
                />
                <span className="text-gray-700">I have an existing in-app store to enhance</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="currentStoreState"
                  value="create"
                  checked={formData.currentStoreState === 'create'}
                  onChange={(e) => setFormData(prev => ({ ...prev, currentStoreState: e.target.value }))}
                  className="mr-2 w-4 h-4 text-purple-600 border-gray-300 focus:ring-purple-500"
                />
                <span className="text-gray-700">I need to build a store from scratch</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Store Surfaces
            </label>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="storeSurfaces"
                  value="inapp"
                  checked={formData.storeSurfaces === 'inapp'}
                  onChange={(e) => setFormData(prev => ({ ...prev, storeSurfaces: e.target.value }))}
                  className="mr-2 w-4 h-4 text-purple-600 border-gray-300 focus:ring-purple-500"
                />
                <span className="text-gray-700">In-game store only</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="storeSurfaces"
                  value="both"
                  checked={formData.storeSurfaces === 'both'}
                  onChange={(e) => setFormData(prev => ({ ...prev, storeSurfaces: e.target.value }))}
                  className="mr-2 w-4 h-4 text-purple-600 border-gray-300 focus:ring-purple-500"
                />
                <span className="text-gray-700">In-game store with web storefront</span>
              </label>
            </div>
          </div>
        </div>

        {/* Success Goals */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-black border-b-2 border-black pb-2">Revenue Goals</h3>
          <p className="text-sm text-gray-600">Set your target metrics so we can optimize towards your goals</p>
          
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                First Purchase Rate (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={formData.targetMetrics.firstPurchaseRate}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  targetMetrics: { ...prev.targetMetrics, firstPurchaseRate: e.target.value }
                }))}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="e.g., 5.2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                7-Day Payer Rate (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={formData.targetMetrics.sevenDayPayerRate}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  targetMetrics: { ...prev.targetMetrics, sevenDayPayerRate: e.target.value }
                }))}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="e.g., 12.5"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ARPPU ($)
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={formData.targetMetrics.arppu}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  targetMetrics: { ...prev.targetMetrics, arppu: e.target.value }
                }))}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="e.g., 25.00"
              />
            </div>
          </div>
        </div>

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
            type="submit"
            className="bg-black text-white px-8 py-4 rounded-full font-medium text-lg hover:bg-gray-800 transition-colors ring-4 ring-orange-300 ring-offset-2"
          >
            Continue to Integration
          </button>
        </div>
      </form>
    </div>
  );
}