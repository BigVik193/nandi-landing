'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useParams } from 'next/navigation';
import { HiLogout, HiArrowLeft } from 'react-icons/hi';
import StoreConfiguration from '@/components/onboarding/StoreConfiguration';

export default function StoreConfigPage() {
  const { user, loading, signOut } = useAuth();
  const params = useParams();
  const gameId = params.id as string;
  
  const [gameData, setGameData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [existingCredentials, setExistingCredentials] = useState<any>(null);
  const [isRevoking, setIsRevoking] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      window.location.href = '/auth/signin';
      return;
    }

    if (user && gameId) {
      fetchGameData();
    }
  }, [user, loading, gameId]);

  const fetchGameData = async () => {
    try {
      // Get specific game data
      const gameResponse = await fetch(`/api/games/${gameId}`);
      const gameData = await gameResponse.json();
      
      if (gameResponse.ok) {
        // Verify the game belongs to the current user
        if (gameData.game.developer_id !== user?.id) {
          alert('You do not have access to this game');
          window.location.href = '/dashboard';
          return;
        }
        setGameData(gameData.game);

        // Fetch existing store credentials
        const credentialsResponse = await fetch(`/api/games/${gameId}/store-credentials?store_type=app_store`);
        if (credentialsResponse.ok) {
          const credentialsData = await credentialsResponse.json();
          if (credentialsData.credentials && credentialsData.credentials.length > 0) {
            setExistingCredentials(credentialsData.credentials[0]);
          }
        }
      } else {
        alert('Game not found');
        window.location.href = '/dashboard';
      }
    } catch (error) {
      console.error('Error fetching game data:', error);
      alert('Error loading game');
      window.location.href = '/dashboard';
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = (data: any) => {
    // Success is handled by the StoreConfiguration component
    console.log('Store configuration saved:', data);
    // Refetch data to show the new credential
    fetchGameData();
  };

  const handleBack = () => {
    window.location.href = `/games/${gameId}/virtual-items`;
  };

  const handleRevoke = async () => {
    if (!existingCredentials) return;
    
    const confirmed = window.confirm(`Are you sure you want to revoke the Apple Store configuration for "${existingCredentials.credential_name}"? This cannot be undone.`);
    if (!confirmed) return;

    setIsRevoking(true);
    try {
      const response = await fetch(`/api/games/${gameId}/store-credentials?sku_id=${existingCredentials.id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        alert('Apple Store configuration revoked successfully');
        setExistingCredentials(null);
      } else {
        const error = await response.json();
        alert(`Failed to revoke configuration: ${error.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error revoking credentials:', error);
      alert('Error revoking configuration');
    } finally {
      setIsRevoking(false);
    }
  };

  if (loading || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!gameData) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center max-w-md mx-auto px-6">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🎮</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Game Not Found</h2>
            <p className="text-gray-600 mb-6">
              The game you're looking for doesn't exist or you don't have access to it.
            </p>
            <button
              onClick={() => window.location.href = '/dashboard'}
              className="bg-black text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="pt-8 pb-8">
        <div className="max-w-7xl mx-auto px-6">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => window.location.href = '/dashboard'}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <HiArrowLeft className="w-5 h-5 text-gray-600" />
                </button>
                <div>
                  <h1 className="text-3xl font-bold text-black">Store Configuration</h1>
                  <p className="text-gray-600 mt-1">
                    Connect your app stores for game: <span className="font-medium">{gameData.name}</span>
                  </p>
                </div>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => window.location.href = '/dashboard'}
                  className="px-4 py-2 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
                >
                  Dashboard
                </button>
                <button
                  onClick={signOut}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg font-medium hover:bg-gray-700 transition-colors flex items-center space-x-2"
                >
                  <HiLogout className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          </div>

          {/* Content */}
          <div>
            {existingCredentials ? (
              <div className="max-w-2xl mx-auto">
                <div className="bg-white rounded-xl border border-gray-200 p-8">
                  <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl">✅</span>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Apple Store Connected</h2>
                    <p className="text-gray-600">
                      Your game is connected to the App Store and ready for price optimization
                    </p>
                  </div>

                  <div className="space-y-4 mb-8">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h3 className="font-semibold text-gray-900 mb-3">Configuration Details</h3>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Credential Name:</span>
                          <p className="font-medium text-gray-900">{existingCredentials.credential_name}</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Store Type:</span>
                          <p className="font-medium text-gray-900">Apple App Store</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Status:</span>
                          <div className="flex items-center space-x-2">
                            <div className={`w-2 h-2 rounded-full ${
                              existingCredentials.validation_status === 'valid' ? 'bg-green-500' : 'bg-red-500'
                            }`}></div>
                            <span className={`font-medium ${
                              existingCredentials.validation_status === 'valid' ? 'text-green-700' : 'text-red-700'
                            }`}>
                              {existingCredentials.validation_status === 'valid' ? 'Valid' : 'Invalid'}
                            </span>
                          </div>
                        </div>
                        <div>
                          <span className="text-gray-600">Last Validated:</span>
                          <p className="font-medium text-gray-900">
                            {existingCredentials.last_validated_at 
                              ? new Date(existingCredentials.last_validated_at).toLocaleDateString()
                              : 'Never'
                            }
                          </p>
                        </div>
                      </div>
                    </div>

                    {existingCredentials.metadata?.apps_count && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="text-blue-600">ℹ️</span>
                          <span className="font-medium text-blue-900">Account Information</span>
                        </div>
                        <p className="text-sm text-blue-700">
                          Found {existingCredentials.metadata.apps_count} apps in your Apple Developer account
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                    <button
                      onClick={handleBack}
                      className="px-6 py-3 text-gray-600 font-medium hover:text-gray-900 transition-colors"
                    >
                      ← Back
                    </button>
                    
                    <button
                      onClick={handleRevoke}
                      disabled={isRevoking}
                      className="px-6 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isRevoking ? 'Revoking...' : 'Revoke Configuration'}
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <StoreConfiguration 
                onNext={handleSave} 
                onBack={handleBack} 
                userData={{
                  gameTitle: gameData.name,
                  bundleId: gameData.bundle_id,
                  gameId: gameData.id
                }}
                isStandalone={true}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}