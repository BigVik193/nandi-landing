'use client';

import { useState } from 'react';
import { HiClipboardList } from 'react-icons/hi';
import { useAuth } from '@/contexts/AuthContext';

interface ProjectIntakeProps {
  onNext: (data: any) => void;
  onBack: () => void;
  userData: any;
}

export default function ProjectIntake({ onNext, onBack, userData }: ProjectIntakeProps) {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    gameTitle: userData.gameProjectName || '',
    genre: '',
    artStyle: '',
    pegiRegion: '',
    monetizationModel: '',
    platforms: [] as string[],
    techStack: '',
    bundleId: '',
    developmentStage: '',
    monthlyActiveUsers: '',
    currentRevenue: '',
    gameEngineVersion: ''
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

  // Supported versions for each tech stack (last 5 years)
  const getSupportedVersions = (techStack: string): string[] => {
    const supportedVersions: Record<string, string[]> = {
      'Unity': [
        '2024.1',
        '2023.3 LTS',
        '2022.3 LTS',
        '2021.3 LTS',
        '2020.3 LTS'
      ],
      'Unreal Engine': [
        '5.5',
        '5.4',
        '5.3',
        '5.2',
        '5.1',
        '5.0',
        '4.27',
        '4.26',
        '4.25'
      ],
      'Godot': [
        '4.5',
        '4.4',
        '4.3',
        '4.2',
        '4.1',
        '4.0',
        '3.6',
        '3.5',
        '3.4',
        '3.2'
      ],
      'Native iOS': [
        'iOS 18 / Xcode 16',
        'iOS 17 / Xcode 15',
        'iOS 16 / Xcode 14',
        'iOS 15 / Xcode 13',
        'iOS 14 / Xcode 12',
        'iOS 13 / Xcode 11'
      ],
      'Native Android': [
        'API 35 / Android 15',
        'API 34 / Android 14',
        'API 33 / Android 13',
        'API 32 / Android 12L',
        'API 31 / Android 12',
        'API 30 / Android 11',
        'API 29 / Android 10'
      ],
      'Flutter': [
        '3.24',
        '3.16',
        '3.10',
        '3.0',
        '2.10',
        '2.8',
        '2.5',
        '2.0',
        '1.22',
        '1.20',
        '1.17'
      ],
      'React Native': [
        '0.75',
        '0.74',
        '0.73',
        '0.72',
        '0.71',
        '0.70',
        '0.69',
        '0.68',
        '0.67',
        '0.66',
        '0.65',
        '0.64',
        '0.63',
        '0.62',
        '0.61',
        '0.60'
      ]
    };
    return supportedVersions[techStack] || [];
  };

  const handlePlatformChange = (platform: string) => {
    setFormData(prev => ({
      ...prev,
      platforms: prev.platforms.includes(platform)
        ? prev.platforms.filter(p => p !== platform)
        : [...prev.platforms, platform]
    }));
  };

  const handleTechStackChange = (techStack: string) => {
    console.log('handleTechStackChange called with:', techStack);
    const versions = getSupportedVersions(techStack);
    console.log('versions found:', versions);
    setFormData(prev => {
      console.log('previous formData:', prev);
      const newData = {
        ...prev,
        techStack,
        gameEngineVersion: versions[0] || ''
      };
      console.log('new formData:', newData);
      return newData;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate user is authenticated
    if (!user?.id) {
      alert('You must be logged in to create a game project.');
      return;
    }
    
    try {
      const response = await fetch('/api/games', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          developerId: user?.id
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to save project configuration');
      }

      // Pass the game ID and form data to the next step
      onNext({
        ...formData,
        gameId: data.gameId,
        developerId: user?.id
      });
    } catch (error) {
      console.error('Error saving project:', error);
      alert(error instanceof Error ? error.message : 'An error occurred. Please try again.');
    }
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 max-w-2xl mx-auto">
      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
        <HiClipboardList className="w-6 h-6 text-gray-600" />
      </div>
      <h2 className="text-2xl font-bold mb-6 text-center text-black">Configure Your Game</h2>
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
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
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
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tech Stack
              </label>
              <select
                required
                value={formData.techStack}
                onChange={(e) => handleTechStackChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
              >
                <option value="">Choose your development platform</option>
                {techStacks.map(stack => (
                  <option key={stack} value={stack}>{stack}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Game Engine Version
                {formData.techStack && (
                  <span className="text-gray-500 text-xs block mt-1">
                    Select the version you're using - Current tech stack: {formData.techStack}
                  </span>
                )}
              </label>
              {formData.techStack ? (
                <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto border border-gray-300 rounded-lg p-3">
                  {getSupportedVersions(formData.techStack).map((version) => (
                    <label
                      key={version}
                      className="flex items-center p-2 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                    >
                      <input
                        type="radio"
                        name="gameEngineVersion"
                        value={version}
                        checked={formData.gameEngineVersion === version}
                        onChange={(e) => setFormData(prev => ({ ...prev, gameEngineVersion: e.target.value }))}
                        className="mr-2 w-4 h-4 text-purple-600 border-gray-300 focus:ring-purple-500"
                      />
                      <span className="text-sm text-gray-700">{version}</span>
                    </label>
                  ))}
                </div>
              ) : (
                <div className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500">
                  Select a tech stack first
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Store Configuration */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-black border-b-2 border-black pb-2">Store Setup</h3>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bundle ID / Package Name
                <span className="text-gray-500 text-xs block mt-1">
                  The unique identifier for your app (iOS: Bundle ID, Android: Package Name)
                </span>
              </label>
              <input
                type="text"
                value={formData.bundleId}
                onChange={(e) => setFormData(prev => ({ ...prev, bundleId: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                placeholder="com.yourcompany.yourgame"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Development Stage
              </label>
              <select
                value={formData.developmentStage}
                onChange={(e) => setFormData(prev => ({ ...prev, developmentStage: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
              >
                <option value="">Select development stage</option>
                <option value="concept">Concept</option>
                <option value="alpha">Alpha</option>
                <option value="beta">Beta</option>
                <option value="live">Live</option>
              </select>
            </div>
          </div>

          {formData.developmentStage === 'live' && (
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Monthly Active Users
                </label>
                <select
                  value={formData.monthlyActiveUsers}
                  onChange={(e) => setFormData(prev => ({ ...prev, monthlyActiveUsers: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                >
                  <option value="">Select user count</option>
                  <option value="0-1000">0 - 1,000</option>
                  <option value="1000-10000">1,000 - 10,000</option>
                  <option value="10000-100000">10,000 - 100,000</option>
                  <option value="100000-1000000">100,000 - 1,000,000</option>
                  <option value="1000000+">1,000,000+</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Monthly Revenue
                </label>
                <select
                  value={formData.currentRevenue}
                  onChange={(e) => setFormData(prev => ({ ...prev, currentRevenue: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                >
                  <option value="">Select revenue range</option>
                  <option value="0-1000">$0 - $1,000</option>
                  <option value="1000-10000">$1,000 - $10,000</option>
                  <option value="10000-50000">$10,000 - $50,000</option>
                  <option value="50000-100000">$50,000 - $100,000</option>
                  <option value="100000+">$100,000+</option>
                </select>
              </div>
            </div>
          )}

          
        </div>


        {/* Navigation Buttons */}
        <div className="flex justify-between pt-6">
          <button
            type="button"
            onClick={onBack}
            className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors"
          >
            Back
          </button>
          <button
            type="submit"
            className="bg-black text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-800 transition-colors ring-4 ring-orange-300 ring-offset-2"
          >
            Continue to Integration
          </button>
        </div>
      </form>
    </div>
  );
}