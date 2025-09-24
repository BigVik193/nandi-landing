'use client';

import { useState } from 'react';
import { HiCode, HiCheck, HiClipboard } from 'react-icons/hi';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useAuth } from '@/contexts/AuthContext';

interface SDKInstallationProps {
  onNext: (data: any) => void;
  onBack: () => void;
  userData: any;
}

const codeExamples = {
  unity: {
    title: 'Unity (C#)',
    language: 'csharp',
    code: `using Nandi;

public class NandiBootstrap : MonoBehaviour
{
    void Start()
    {
        NandiSDK.Init("YOUR_API_KEY");
    }

    public void OnLevelComplete()
    {
        NandiSDK.PresentUpsell(new NandiUpsellOptions { Trigger = "level_complete" });
    }
}`
  },
  unreal: {
    title: 'Unreal Engine (C++)',
    language: 'cpp',
    code: `#include "NandiSDK.h"

void UMyGameInstance::Init()
{
    UNandiSDK::Init(TEXT("YOUR_API_KEY"));
}

void AMyGameMode::HandleLevelComplete()
{
    FNandiUpsellOptions Opts;
    Opts.Trigger = TEXT("level_complete");
    UNandiSDK::PresentUpsell(Opts);
}`
  },
  godot: {
    title: 'Godot (GDScript)',
    language: 'python',
    code: `extends Node

func _ready():
    Nandi.init("YOUR_API_KEY")

func on_level_complete():
    Nandi.present_upsell({"trigger": "level_complete"})`
  },
  ios: {
    title: 'Native iOS (Swift)',
    language: 'swift',
    code: `import NandiSDK

@main
class AppDelegate: UIResponder, UIApplicationDelegate {
  func application(_ application: UIApplication,
                   didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
    NandiSDK.init(apiKey: "YOUR_API_KEY")
    return true
  }
}

func onLevelComplete() {
  NandiSDK.presentUpsell(NandiUpsellOptions(trigger: "level_complete"))
}`
  },
  android: {
    title: 'Native Android (Kotlin)',
    language: 'kotlin',
    code: `import com.nandi.sdk.NandiSDK
import com.nandi.sdk.NandiUpsellOptions

class App : Application() {
    override fun onCreate() {
        super.onCreate()
        NandiSDK.init("YOUR_API_KEY")
    }
}

fun onLevelComplete() {
    NandiSDK.presentUpsell(NandiUpsellOptions(trigger = "level_complete"))
}`
  }
};

export default function SDKInstallation({ onNext, onBack, userData }: SDKInstallationProps) {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<keyof typeof codeExamples>(
    userData.techStack?.toLowerCase().includes('unity') ? 'unity' :
    userData.techStack?.toLowerCase().includes('unreal') ? 'unreal' :
    userData.techStack?.toLowerCase().includes('godot') ? 'godot' :
    userData.techStack?.toLowerCase().includes('ios') ? 'ios' :
    userData.techStack?.toLowerCase().includes('android') ? 'android' :
    'unity'
  );
  
  const [formData, setFormData] = useState({
    selectedSDK: userData.techStack || '',
  });
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [isGeneratingApiKey, setIsGeneratingApiKey] = useState(false);
  const [apiKeyName, setApiKeyName] = useState('');

  const generateApiKey = async () => {
    if (!userData.gameId) {
      alert('Game ID not found. Please go back and complete project setup first.');
      return;
    }

    if (!apiKeyName.trim()) {
      alert('Please enter a name for your API key.');
      return;
    }

    setIsGeneratingApiKey(true);
    
    try {
      const response = await fetch('/api/api-keys', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          gameId: userData.gameId,
          name: apiKeyName.trim(),
          permissions: { read: true, write: true }
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate API key');
      }

      setApiKey(data.apiKey.key);
    } catch (error) {
      console.error('Error generating API key:', error);
      alert(error instanceof Error ? error.message : 'Failed to generate API key');
    } finally {
      setIsGeneratingApiKey(false);
    }
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKey) {
      alert('Please generate an API key first.');
      return;
    }
    
    // Pass the form data to the next step
    onNext({
      ...formData,
      apiKey,
      developerId: userData.developerId,
      gameId: userData.gameId
    });
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 max-w-3xl mx-auto">
      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
        <HiCode className="w-6 h-6 text-gray-600" />
      </div>
      <h2 className="text-2xl font-bold mb-6 text-center text-black">Integrate Nandi SDK</h2>
      <p className="text-gray-600 text-center mb-8">
        Add Nandi to your game and test the connection
      </p>
      
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Step 1: API Key Generation */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-black border-b-2 border-black pb-2">
            Step 1: Generate API Key
          </h3>
          <p className="text-gray-600">
            Generate a secure API key for your game: <strong>{userData.gameProjectName}</strong>
          </p>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                API Key Name
              </label>
              <div className="flex items-end space-x-4">
                <div className="flex-1">
                  <input
                    type="text"
                    value={apiKeyName}
                    onChange={(e) => setApiKeyName(e.target.value)}
                    disabled={!!apiKey}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                    placeholder="e.g., Production SDK Key, Development Key, etc."
                  />
                </div>
                <button
                  type="button"
                  onClick={generateApiKey}
                  disabled={isGeneratingApiKey || !!apiKey}
                  className={`px-6 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
                    apiKey
                      ? 'bg-green-500 text-white cursor-not-allowed'
                      : isGeneratingApiKey
                      ? 'bg-gray-400 text-white cursor-not-allowed'
                      : 'bg-purple-500 text-white hover:bg-purple-600'
                  }`}
                >
                  {apiKey ? 'Generated ✓' : 
                   isGeneratingApiKey ? 'Generating...' : 
                   'Generate'}
                </button>
              </div>
            </div>
          </div>

          {apiKey && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <p className="text-amber-800 font-medium mb-2">Your API Key (save this securely):</p>
              <div className="flex items-center space-x-2">
                <div className="bg-white p-3 rounded border border-amber-300 font-mono text-sm break-all flex-1">
                  {apiKey}
                </div>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(apiKey);
                    // Optional: Show a brief "Copied!" message
                  }}
                  className="bg-amber-600 hover:bg-amber-700 text-white px-3 py-2 rounded font-medium transition-colors flex items-center space-x-1"
                  title="Copy API key"
                >
                  <HiClipboard className="w-4 h-4" />
                  <span>Copy</span>
                </button>
              </div>
              <p className="text-amber-700 text-xs mt-2">
                This key won't be shown again. Copy it now and store it securely.
              </p>
            </div>
          )}
        </div>

        {/* Step 2: Code Integration */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-black border-b-2 border-black pb-2">
            Step 2: Integration Code
          </h3>
          <p className="text-gray-600">
            Add this code to your project to initialize the Nandi SDK
          </p>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
            {/* Tab Navigation */}
            <div className="border-b border-gray-200 bg-gray-50">
              <div className="flex flex-wrap">
                {Object.entries(codeExamples).map(([key, example]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setActiveTab(key as keyof typeof codeExamples)}
                    className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                      activeTab === key
                        ? 'border-purple-500 text-purple-600 bg-white'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    {example.title}
                  </button>
                ))}
              </div>
            </div>

            {/* Code Content */}
            <div className="p-0">
              <div className="relative">
                <div className="absolute top-4 right-4 z-10">
                  <button
                    type="button"
                    onClick={() => navigator.clipboard.writeText(
                      codeExamples[activeTab].code.replace('YOUR_API_KEY', apiKey || 'YOUR_API_KEY')
                    )}
                    className="text-gray-400 hover:text-gray-600 transition-colors bg-gray-800 hover:bg-gray-700 p-2 rounded"
                    title="Copy code"
                  >
                    <HiClipboard className="w-4 h-4" />
                  </button>
                </div>
                <SyntaxHighlighter
                  language={codeExamples[activeTab].language}
                  style={tomorrow}
                  customStyle={{
                    margin: 0,
                    borderRadius: 0,
                    fontSize: '14px',
                    lineHeight: '1.5',
                  }}
                  codeTagProps={{
                    style: {
                      fontSize: '14px',
                      fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
                    }
                  }}
                >
                  {codeExamples[activeTab].code.replace('YOUR_API_KEY', apiKey || 'YOUR_API_KEY')}
                </SyntaxHighlighter>
              </div>
            </div>
          </div>
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
            className="bg-black text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-800 transition-colors"
          >
            Continue Setup
          </button>
        </div>
      </form>
    </div>
  );
}