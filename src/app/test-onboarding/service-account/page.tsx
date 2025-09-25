'use client';

import { useState } from 'react';

interface ServiceAccountData {
  gameId: string;
  credentialName: string;
  googlePlayPackageName: string;
  appStoreBundleId: string;
  serviceAccountJson: string;
}

interface ValidationStatus {
  platform: 'google_play' | 'app_store';
  hasAccess: boolean;
  validatedAt?: string;
  message?: string;
  error?: string;
  troubleshooting?: string[];
}

export default function ServiceAccountOnboardingPage() {
  const [step, setStep] = useState<'setup' | 'validation' | 'success'>('setup');
  const [formData, setFormData] = useState<ServiceAccountData>({
    gameId: "2a193504-52ed-4412-bec1-ad1d9af88f79", // Using the game you just created
    credentialName: 'Google Play Service Account',
    googlePlayPackageName: 'com.hbellala.nandi',
    appStoreBundleId: 'com.hbellala.nandi',
    serviceAccountJson: ''
  });
  const [validationResults, setValidationResults] = useState<ValidationStatus[]>([]);
  const [loading, setLoading] = useState(false);
  const [jsonError, setJsonError] = useState<string>('');

  const handleJsonUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          // Validate JSON
          JSON.parse(content);
          setFormData({...formData, serviceAccountJson: content});
          setJsonError('');
        } catch (error) {
          setJsonError('Invalid JSON file. Please upload a valid service account key.');
        }
      };
      reader.readAsText(file);
    }
  };

  const handleJsonPaste = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const content = event.target.value;
    try {
      if (content.trim()) {
        JSON.parse(content);
        setJsonError('');
      }
      setFormData({...formData, serviceAccountJson: content});
    } catch (error) {
      setJsonError('Invalid JSON format.');
    }
  };

  const handleSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.serviceAccountJson) {
      setJsonError('Please upload or paste your service account JSON.');
      return;
    }

    setLoading(true);

    try {
      // Register the app with service account credentials
      const response = await fetch('/api/clients/service-account', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      
      if (result.success) {
        setStep('validation');
        // Automatically test validation
        await testValidation();
      } else {
        alert('Error: ' + result.error);
      }
    } catch (error) {
      alert('Network error: ' + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const testValidation = async () => {
    setLoading(true);

    try {
      const validationData = {
        gameId: formData.gameId,
      };

      const response = await fetch('/api/clients/validate-service-account', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(validationData),
      });

      const result = await response.json();
      
      if (result.success) {
        setValidationResults(result.data.validations || []);
        if (result.data.validations?.some((v: ValidationStatus) => v.hasAccess)) {
          setStep('success');
        }
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
        targetStores: ["google_play"],
        publishImmediately: false,
        // Include service account for direct API calls
        serviceAccountJson: formData.serviceAccountJson,
        packageName: formData.googlePlayPackageName,
      };

      const response = await fetch('/api/store/products/service-account', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData),
      });

      const result = await response.json();
      
      if (result.success) {
        alert('✅ Test product created successfully!\n\nProduct ID: ' + result.data.id + '\nGoogle Play SKU: ' + result.data.googlePlaySku);
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🚀 Nandi Store Integration
          </h1>
          <p className="text-gray-600 mb-8">
            Connect your Google Play Store account to start creating optimized products
          </p>

          {step === 'setup' && (
            <form onSubmit={handleSetup} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Credential Name
                  </label>
                  <input
                    type="text"
                    value={formData.credentialName}
                    onChange={(e) => setFormData({...formData, credentialName: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                    placeholder="Google Play Service Account"
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                    placeholder="com.yourcompany.yourgame"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    This will be specified in your app's build.gradle
                  </p>
                </div>
              </div>

              {/* Service Account Upload Section - Similar to RevenueCat */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Service Account Credentials
                  </h3>
                  <div className="flex items-center text-blue-600">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    <a href="https://developers.google.com/android-publisher/getting_started" target="_blank" className="text-sm hover:underline">
                      Setup Guide
                    </a>
                  </div>
                </div>
                
                <p className="text-sm text-gray-600 mb-4">
                  Nandi requires service account credentials to validate transactions and manage products.
                </p>

                {/* File Upload */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload JSON File
                  </label>
                  <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                    <div className="flex flex-col items-center">
                      <svg className="w-12 h-12 text-blue-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      <p className="text-blue-600 font-medium mb-1">
                        Drop a file here, or click to select
                      </p>
                      <p className="text-sm text-gray-500">
                        Service account JSON file from Google Cloud Console
                      </p>
                      <input
                        type="file"
                        accept=".json"
                        onChange={handleJsonUpload}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                    </div>
                  </div>
                </div>

                {/* Or paste JSON */}
                <div className="border-t pt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Or paste JSON content
                  </label>
                  <textarea
                    value={formData.serviceAccountJson}
                    onChange={handleJsonPaste}
                    placeholder='Paste your service account JSON here...'
                    className="w-full h-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent font-mono text-sm"
                  />
                </div>

                {jsonError && (
                  <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-800 text-sm">{jsonError}</p>
                  </div>
                )}

                {formData.serviceAccountJson && !jsonError && (
                  <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-green-800 text-sm">✅ Valid JSON detected</p>
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={loading || !formData.serviceAccountJson || !!jsonError}
                className="w-full bg-black text-white py-3 px-6 rounded-lg font-medium hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? 'Connecting...' : 'Connect Google Play Store'}
              </button>
            </form>
          )}

          {step === 'validation' && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                  Testing Connection...
                </h2>
                <p className="text-gray-600">
                  Validating your service account credentials
                </p>
              </div>

              {validationResults.map((result, index) => (
                <div key={index} className={`p-6 rounded-lg border ${
                  result.hasAccess 
                    ? 'bg-green-50 border-green-200' 
                    : 'bg-red-50 border-red-200'
                }`}>
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">
                      {result.platform === 'google_play' ? '🤖 Google Play Store' : '🍎 App Store'}
                    </h3>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      result.hasAccess
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {result.hasAccess ? 'Connected' : 'Failed'}
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-600 mt-2">
                    {result.message || result.error}
                  </p>

                  {result.troubleshooting && (
                    <div className="mt-3">
                      <p className="text-sm font-medium text-gray-700 mb-1">Troubleshooting:</p>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {result.troubleshooting.map((tip, i) => (
                          <li key={i}>• {tip}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}

              <div className="flex space-x-4">
                <button
                  onClick={() => setStep('setup')}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  ← Back to Setup
                </button>
                <button
                  onClick={testValidation}
                  disabled={loading}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {loading ? 'Testing...' : 'Retry Validation'}
                </button>
              </div>
            </div>
          )}

          {step === 'success' && (
            <div className="text-center space-y-6">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
                <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              
              <h2 className="text-3xl font-semibold text-gray-900">
                🎉 Successfully Connected!
              </h2>
              
              <p className="text-gray-600 text-lg">
                Your Google Play Store is now connected to Nandi. You can start creating and optimizing products.
              </p>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-left">
                <h3 className="font-semibold text-blue-800 mb-3">Ready to test product creation?</h3>
                <p className="text-blue-700 text-sm mb-4">
                  Let's create a test product to make sure everything is working correctly.
                </p>
                <button
                  onClick={createTestProduct}
                  disabled={loading}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {loading ? 'Creating Product...' : 'Create Test Product'}
                </button>
              </div>

              <button
                onClick={() => setStep('setup')}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Setup Another App
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}