'use client';

import { useState } from 'react';

interface OnboardingData {
  clientId: string;
  appName: string;
  googlePlayPackageName: string;
  appStoreBundleId: string;
}

interface ValidationStatus {
  platform: 'google_play' | 'app_store';
  hasAccess: boolean;
  validatedAt?: string;
  message?: string;
  error?: string;
  troubleshooting?: string[];
}

export default function TestOnboardingPage() {
  const [step, setStep] = useState<'form' | 'instructions' | 'validation'>('form');
  const [formData, setFormData] = useState<OnboardingData>({
    clientId: 'test_client_123',
    appName: 'Nandi API Test',
    googlePlayPackageName: 'com.yourname.nanditest', // Replace with your actual package name
    appStoreBundleId: '' // Leave empty for Google Play only testing
  });
  const [onboardingResult, setOnboardingResult] = useState<any>(null);
  const [validationResults, setValidationResults] = useState<ValidationStatus[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/clients/onboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      
      if (result.success) {
        setOnboardingResult(result.data);
        setStep('instructions');
      } else {
        alert('Error: ' + result.error);
      }
    } catch (error) {
      alert('Network error: ' + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleValidation = async (platform: 'google_play' | 'app_store') => {
    setLoading(true);

    try {
      const validationData = {
        appId: onboardingResult.app.id,
        platform,
        ...(platform === 'google_play' 
          ? { packageName: formData.googlePlayPackageName }
          : { bundleId: formData.appStoreBundleId }
        )
      };

      const response = await fetch('/api/clients/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(validationData),
      });

      const result = await response.json();
      
      if (result.success) {
        setValidationResults(prev => {
          const filtered = prev.filter(v => v.platform !== platform);
          return [...filtered, result.data];
        });
      } else {
        alert('Validation error: ' + result.error);
      }
    } catch (error) {
      alert('Network error: ' + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const createTestProduct = async () => {
    setLoading(true);

    try {
      const productData = {
        clientId: formData.clientId,
        appId: onboardingResult.app.id,
        product: {
          name: "Test Gold Pack",
          description: "1000 gold coins for testing",
          price: 4.99,
          currency: "USD",
          type: "consumable",
          isActive: false,
          bundleItems: [{ itemType: "gold", quantity: 1000 }],
          tags: ["test", "gold"]
        },
        targetStores: ["both"],
        publishImmediately: false
      };

      const response = await fetch('/api/store/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData),
      });

      const result = await response.json();
      
      if (result.success) {
        alert('✅ Test product created successfully!\n\nProduct ID: ' + result.data.id);
      } else {
        alert('❌ Product creation failed:\n' + JSON.stringify(result.errors, null, 2));
      }
    } catch (error) {
      alert('Network error: ' + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-6">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            🧪 Test Nandi Onboarding Flow
          </h1>

          {step === 'form' && (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Client ID
                </label>
                <input
                  type="text"
                  value={formData.clientId}
                  onChange={(e) => setFormData({...formData, clientId: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  App Name
                </label>
                <input
                  type="text"
                  value={formData.appName}
                  onChange={(e) => setFormData({...formData, appName: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Google Play Package Name
                </label>
                <input
                  type="text"
                  value={formData.googlePlayPackageName}
                  onChange={(e) => setFormData({...formData, googlePlayPackageName: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                  placeholder="com.yourcompany.yourgame"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  App Store Bundle ID
                </label>
                <input
                  type="text"
                  value={formData.appStoreBundleId}
                  onChange={(e) => setFormData({...formData, appStoreBundleId: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                  placeholder="com.yourcompany.yourgame"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-black text-white py-3 px-6 rounded-lg font-medium hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Setting up...' : 'Start Onboarding'}
              </button>
            </form>
          )}

          {step === 'instructions' && onboardingResult && (
            <div className="space-y-8">
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-green-800 mb-2">
                  ✅ App Registered Successfully!
                </h2>
                <p className="text-green-700">
                  App ID: <code className="bg-green-100 px-2 py-1 rounded">{onboardingResult.app.id}</code>
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {onboardingResult.instructions.googlePlay && (
                  <div className="border border-gray-200 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">
                        🤖 Google Play Setup
                      </h3>
                      <span className="text-sm text-gray-500">
                        {onboardingResult.instructions.googlePlay.estimatedTime}
                      </span>
                    </div>

                    <ol className="space-y-3 mb-6">
                      {onboardingResult.instructions.googlePlay.steps.map((step: any) => (
                        <li key={step.step} className="flex items-start space-x-3">
                          <span className="flex-shrink-0 w-6 h-6 bg-black text-white rounded-full flex items-center justify-center text-sm font-medium">
                            {step.step}
                          </span>
                          <div>
                            <p className="font-medium text-gray-900">{step.title}</p>
                            <p className="text-sm text-gray-600">{step.description}</p>
                            {step.serviceAccountEmail && (
                              <code className="block mt-1 text-xs bg-gray-100 px-2 py-1 rounded">
                                {step.serviceAccountEmail}
                              </code>
                            )}
                            {step.permissions && (
                              <ul className="mt-2 text-xs text-gray-500">
                                {step.permissions.map((perm: string, i: number) => (
                                  <li key={i}>• {perm}</li>
                                ))}
                              </ul>
                            )}
                          </div>
                        </li>
                      ))}
                    </ol>

                    <button
                      onClick={() => handleValidation('google_play')}
                      disabled={loading}
                      className="w-full bg-green-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-green-700 disabled:opacity-50"
                    >
                      {loading ? 'Verifying...' : 'Verify Google Play Connection'}
                    </button>

                    {validationResults.find(v => v.platform === 'google_play') && (
                      <div className={`mt-4 p-4 rounded-lg ${
                        validationResults.find(v => v.platform === 'google_play')?.hasAccess 
                          ? 'bg-green-50 border border-green-200' 
                          : 'bg-red-50 border border-red-200'
                      }`}>
                        {validationResults.find(v => v.platform === 'google_play')?.hasAccess ? (
                          <p className="text-green-800 font-medium">✅ Connected successfully!</p>
                        ) : (
                          <div className="text-red-800">
                            <p className="font-medium">❌ Connection failed</p>
                            <p className="text-sm mt-1">
                              {validationResults.find(v => v.platform === 'google_play')?.error}
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {onboardingResult.instructions.appStore && (
                  <div className="border border-gray-200 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">
                        🍎 App Store Setup
                      </h3>
                      <span className="text-sm text-gray-500">
                        {onboardingResult.instructions.appStore.estimatedTime}
                      </span>
                    </div>

                    <ol className="space-y-3 mb-6">
                      {onboardingResult.instructions.appStore.steps.map((step: any) => (
                        <li key={step.step} className="flex items-start space-x-3">
                          <span className="flex-shrink-0 w-6 h-6 bg-black text-white rounded-full flex items-center justify-center text-sm font-medium">
                            {step.step}
                          </span>
                          <div>
                            <p className="font-medium text-gray-900">{step.title}</p>
                            <p className="text-sm text-gray-600">{step.description}</p>
                            {step.nandiAppleId && (
                              <code className="block mt-1 text-xs bg-gray-100 px-2 py-1 rounded">
                                {step.nandiAppleId}
                              </code>
                            )}
                            {step.permissions && (
                              <ul className="mt-2 text-xs text-gray-500">
                                {step.permissions.map((perm: string, i: number) => (
                                  <li key={i}>• {perm}</li>
                                ))}
                              </ul>
                            )}
                          </div>
                        </li>
                      ))}
                    </ol>

                    <button
                      onClick={() => handleValidation('app_store')}
                      disabled={loading}
                      className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50"
                    >
                      {loading ? 'Verifying...' : 'Verify App Store Connection'}
                    </button>

                    {validationResults.find(v => v.platform === 'app_store') && (
                      <div className={`mt-4 p-4 rounded-lg ${
                        validationResults.find(v => v.platform === 'app_store')?.hasAccess 
                          ? 'bg-green-50 border border-green-200' 
                          : 'bg-red-50 border border-red-200'
                      }`}>
                        {validationResults.find(v => v.platform === 'app_store')?.hasAccess ? (
                          <p className="text-green-800 font-medium">✅ Connected successfully!</p>
                        ) : (
                          <div className="text-red-800">
                            <p className="font-medium">❌ Connection failed</p>
                            <p className="text-sm mt-1">
                              {validationResults.find(v => v.platform === 'app_store')?.error}
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {validationResults.some(v => v.hasAccess) && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-blue-800 mb-4">
                    🚀 Ready to Create Products!
                  </h3>
                  <p className="text-blue-700 mb-4">
                    You can now create products using Nandi's simplified API. Let's test it!
                  </p>
                  <button
                    onClick={createTestProduct}
                    disabled={loading}
                    className="bg-blue-600 text-white py-2 px-6 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50"
                  >
                    {loading ? 'Creating...' : 'Create Test Product'}
                  </button>
                </div>
              )}

              <div className="flex space-x-4">
                <button
                  onClick={() => setStep('form')}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  ← Back to Form
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}