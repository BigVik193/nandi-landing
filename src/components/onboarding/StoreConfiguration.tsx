'use client';

import { useState, useEffect } from 'react';
import { HiCheck, HiX, HiUpload, HiExclamation, HiInformationCircle, HiShoppingCart, HiTrash } from 'react-icons/hi';
import { useAuth } from '@/contexts/AuthContext';

interface StoreConfigurationProps {
  onNext: (data: any) => void;
  onBack: () => void;
  userData: any;
  isStandalone?: boolean;
}

interface AppleStoreCredentials {
  app_name: string;
  bundle_id: string;
  p8_key_content: string;
  key_id: string;
  issuer_id: string;
}

export default function StoreConfiguration({ onNext, onBack, userData, isStandalone = false }: StoreConfigurationProps) {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'apple' | 'google'>('apple');
  const [isValidating, setIsValidating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [validationResult, setValidationResult] = useState<{ 
    valid: boolean; 
    error?: string; 
    apps?: any[]; 
    matched_app?: { id: string; name: string; bundleId: string; sku?: string };
    total_apps_in_account?: number;
  } | null>(null);
  const [existingCredentials, setExistingCredentials] = useState<any>(null);
  const [showForm, setShowForm] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [storeCredentials, setStoreCredentials] = useState<AppleStoreCredentials>({
    app_name: userData?.gameTitle || '',
    bundle_id: userData?.bundleId || '',
    p8_key_content: '',
    key_id: '',
    issuer_id: ''
  });

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setStoreCredentials(prev => ({ ...prev, p8_key_content: content }));
    };
    reader.readAsText(file);
  };

  const validateCredentials = async () => {
    if (!storeCredentials.app_name || !storeCredentials.bundle_id || 
        !storeCredentials.p8_key_content || !storeCredentials.key_id || 
        !storeCredentials.issuer_id) {
      setValidationResult({ valid: false, error: 'Please fill in all required fields' });
      return;
    }

    setIsValidating(true);
    setValidationResult(null);

    try {
      const response = await fetch('/api/store-credentials/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(storeCredentials),
      });

      const result = await response.json();

      if (response.ok && result.valid) {
        console.log('[Validation] Success result:', result);
        setValidationResult({ 
          valid: true, 
          apps: result.apps,
          matched_app: result.matched_app,
          total_apps_in_account: result.total_apps_in_account
        });
      } else {
        setValidationResult({ 
          valid: false, 
          error: result.error || 'Validation failed' 
        });
      }
    } catch (error) {
      console.error('Validation error:', error);
      setValidationResult({ 
        valid: false, 
        error: 'Network error. Please check your connection and try again.' 
      });
    } finally {
      setIsValidating(false);
    }
  };

  // Load existing credentials when component mounts
  useEffect(() => {
    if (userData?.gameId && isStandalone) {
      loadExistingCredentials();
    }
  }, [userData?.gameId, isStandalone]);

  const loadExistingCredentials = async () => {
    try {
      const response = await fetch(`/api/games/${userData.gameId}/store-credentials?store_type=app_store`);
      if (response.ok) {
        const data = await response.json();
        if (data.credentials && data.credentials.length > 0) {
          setExistingCredentials(data.credentials[0]);
          // Show that credentials exist without populating sensitive data
          setValidationResult({ valid: true, apps: [] });
          // Hide form and show existing credentials view
          setShowForm(false);
        } else {
          setShowForm(true);
        }
      }
    } catch (error) {
      console.error('Failed to load existing credentials:', error);
    }
  };

  const saveAndContinue = async () => {
    if (!validationResult?.valid) {
      setValidationResult({ valid: false, error: 'Please validate your credentials first' });
      return;
    }

    if (!userData?.gameId || !user?.id) {
      setValidationResult({ valid: false, error: 'Missing game or developer information. Please go back and complete the previous steps.' });
      return;
    }

    setIsSaving(true);
    try {
      const response = await fetch(`/api/games/${userData.gameId}/store-credentials`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(storeCredentials),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        // Store the credential ID for future reference
        if (isStandalone) {
          // Refresh credentials and reset form
          await loadExistingCredentials();
          // Reset form but keep validation
          setStoreCredentials({
            app_name: userData?.gameTitle || '',
            bundle_id: userData?.bundleId || '',
            p8_key_content: '',
            key_id: '',
            issuer_id: ''
          });
        } else {
          onNext({ 
            appleStoreCredentialId: result.credential_id,
            appleStoreConnected: true
          });
        }
      } else {
        setValidationResult({ valid: false, error: 'Failed to save credentials: ' + (result.error || 'Unknown error') });
      }
    } catch (error) {
      console.error('Save error:', error);
      setValidationResult({ valid: false, error: 'Network error. Please try again.' });
    } finally {
      setIsSaving(false);
    }
  };

  const skipForNow = () => {
    if (isStandalone) {
      onBack(); // In standalone mode, just go back
    } else {
      onNext({ appleStoreConnected: false });
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center">
            <HiShoppingCart className="w-8 h-8" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Connect Your App Stores
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Connect your Apple App Store and Google Play Store accounts so Nandi can automatically create and manage your in-app purchase products.
        </p>
      </div>

      {/* Store Tabs */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="flex">
            <button
              onClick={() => setActiveTab('apple')}
              className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
                activeTab === 'apple'
                  ? 'bg-black text-white'
                  : 'bg-gray-50 text-gray-600 hover:text-gray-900'
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <span>🍎</span>
                <span>Apple App Store</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('google')}
              className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
                activeTab === 'google'
                  ? 'bg-black text-white'
                  : 'bg-gray-50 text-gray-600 hover:text-gray-900'
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <span>🤖</span>
                <span>Google Play Store</span>
              </div>
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'apple' && (
            <div className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <HiInformationCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-blue-900">Apple App Store Connect API</h3>
                    <p className="text-sm text-blue-700 mt-1">
                      You'll need to create an API key in App Store Connect. This allows Nandi to automatically create and manage your in-app purchase products.
                    </p>
                  </div>
                </div>
              </div>

              {/* Existing Credentials */}
              {existingCredentials && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <HiCheck className="w-5 h-5 text-green-600 mt-0.5" />
                    <div>
                      <h3 className="font-medium text-green-900">Store Credentials Connected</h3>
                      <p className="text-sm text-green-700 mt-1">
                        You have existing Apple Store credentials for "{existingCredentials.credential_name}". 
                        You can update them below or add new credentials.
                      </p>
                      <p className="text-xs text-green-600 mt-2">
                        Status: {existingCredentials.validation_status === 'valid' ? '✓ Valid' : '⚠ Needs Validation'} • 
                        Last updated: {new Date(existingCredentials.updated_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Form Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    App Name *
                  </label>
                  <input
                    type="text"
                    value={storeCredentials.app_name}
                    onChange={(e) => setStoreCredentials(prev => ({ ...prev, app_name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black"
                    placeholder="My Awesome Game"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bundle ID *
                  </label>
                  <input
                    type="text"
                    value={storeCredentials.bundle_id}
                    onChange={(e) => setStoreCredentials(prev => ({ ...prev, bundle_id: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black"
                    placeholder="com.yourcompany.yourgame"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Key ID *
                  </label>
                  <input
                    type="text"
                    value={storeCredentials.key_id}
                    onChange={(e) => setStoreCredentials(prev => ({ ...prev, key_id: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black"
                    placeholder="ABC123DEF4"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Issuer ID *
                  </label>
                  <input
                    type="text"
                    value={storeCredentials.issuer_id}
                    onChange={(e) => setStoreCredentials(prev => ({ ...prev, issuer_id: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black"
                    placeholder="12345678-1234-1234-1234-123456789012"
                  />
                </div>
              </div>

              {/* P8 Key File Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  P8 Private Key File *
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <input
                    type="file"
                    accept=".p8"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="p8-upload"
                  />
                  <label htmlFor="p8-upload" className="cursor-pointer">
                    <HiUpload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">
                      {storeCredentials.p8_key_content ? (
                        <span className="text-green-600 font-medium">✓ P8 key loaded</span>
                      ) : (
                        <>Click to upload your .p8 private key file</>
                      )}
                    </p>
                  </label>
                </div>
              </div>

              {/* Validation */}
              <div className="border-t border-gray-200 pt-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Validate Credentials</h3>
                  <button
                    onClick={validateCredentials}
                    disabled={isValidating}
                    className="bg-black text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isValidating ? 'Validating...' : 'Test Connection'}
                  </button>
                </div>

                {validationResult && (
                  <div className={`p-4 rounded-lg ${
                    validationResult.valid 
                      ? 'bg-green-50 border border-green-200' 
                      : 'bg-red-50 border border-red-200'
                  }`}>
                    <div className="flex items-start space-x-3">
                      {validationResult.valid ? (
                        <HiCheck className="w-5 h-5 text-green-600 mt-0.5" />
                      ) : (
                        <HiX className="w-5 h-5 text-red-600 mt-0.5" />
                      )}
                      <div>
                        <h4 className={`font-medium ${
                          validationResult.valid ? 'text-green-900' : 'text-red-900'
                        }`}>
                          {validationResult.valid ? 'Connection Successful!' : 'Connection Failed'}
                        </h4>
                        <div className={`text-sm mt-1 ${
                          validationResult.valid ? 'text-green-700' : 'text-red-700'
                        }`}>
                          {validationResult.valid ? (
                            <div className="space-y-3">
                              <p>Successfully connected to your Apple Developer account!</p>
                              {validationResult.matched_app ? (
                                <div className="bg-white border border-green-300 rounded-lg p-3">
                                  <div className="flex items-center space-x-2 mb-2">
                                    <HiShoppingCart className="w-4 h-4 text-green-600" />
                                    <span className="font-medium text-gray-900">Connected App</span>
                                  </div>
                                  <div className="space-y-1 text-xs">
                                    <p><span className="font-medium">App Name:</span> {validationResult.matched_app.name || 'Unknown'}</p>
                                    <p><span className="font-medium">Bundle ID:</span> {validationResult.matched_app.bundleId}</p>
                                    <p><span className="font-medium">App ID:</span> {validationResult.matched_app.id}</p>
                                    {validationResult.matched_app.sku && (
                                      <p><span className="font-medium">SKU:</span> {validationResult.matched_app.sku}</p>
                                    )}
                                  </div>
                                </div>
                              ) : (
                                <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-3">
                                  <div className="flex items-center space-x-2 mb-1">
                                    <HiInformationCircle className="w-4 h-4 text-yellow-600" />
                                    <span className="font-medium text-yellow-900">App Connection</span>
                                  </div>
                                  <p className="text-xs text-yellow-700">
                                    Credentials validated, but could not find specific app details. 
                                    Found {validationResult.total_apps_in_account || 0} apps in your account.
                                  </p>
                                </div>
                              )}
                              {validationResult.total_apps_in_account && validationResult.total_apps_in_account > 1 && (
                                <p className="text-xs text-green-600">
                                  Note: Your Apple Developer account contains {validationResult.total_apps_in_account} total apps. 
                                  Nandi will only manage SKUs for the app shown above.
                                </p>
                              )}
                            </div>
                          ) : (
                            validationResult.error
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'google' && (
            <div className="text-center py-8">
              <div className="bg-gray-100 rounded-lg p-6">
                <HiExclamation className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Coming Soon</h3>
                <p className="text-gray-600">
                  Google Play Store integration will be available in a future update.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between pt-6">
        <button
          onClick={onBack}
          className="px-6 py-3 text-gray-600 font-medium hover:text-gray-900 transition-colors"
        >
          ← Back
        </button>
        
        <div className="flex space-x-3">
          {!isStandalone && (
            <button
              onClick={skipForNow}
              className="px-6 py-3 text-gray-600 font-medium hover:text-gray-900 transition-colors"
            >
              Skip for Now
            </button>
          )}
          
          {activeTab === 'apple' && (
            <button
              onClick={saveAndContinue}
              disabled={!validationResult?.valid || isSaving}
              className="bg-black text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSaving ? 'Saving...' : (isStandalone ? 'Save Configuration' : 'Save & Continue →')}
            </button>
          )}
          
          {activeTab === 'google' && (
            <button
              onClick={skipForNow}
              className="bg-black text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors"
            >
              {isStandalone ? 'Back' : 'Continue →'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}