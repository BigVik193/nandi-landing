'use client';

import { useState } from 'react';
import { HiCode, HiCheck, HiClipboard } from 'react-icons/hi';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';

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
        NandiSDK.Init(new NandiConfig { AppId = "YOUR_APP_ID" });
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
    FNandiConfig Config;
    Config.AppId = TEXT("YOUR_APP_ID");
    UNandiSDK::Init(Config);
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
    Nandi.init({"appId": "YOUR_APP_ID"})

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
    NandiSDK.init(config: NandiConfig(appId: "YOUR_APP_ID"))
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
import com.nandi.sdk.NandiConfig
import com.nandi.sdk.NandiUpsellOptions

class App : Application() {
    override fun onCreate() {
        super.onCreate()
        NandiSDK.init(NandiConfig(appId = "YOUR_APP_ID"))
    }
}

fun onLevelComplete() {
    NandiSDK.presentUpsell(NandiUpsellOptions(trigger = "level_complete"))
}`
  }
};

export default function SDKInstallation({ onNext, onBack, userData }: SDKInstallationProps) {
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
    appId: `${userData.gameProjectName?.toLowerCase().replace(/\s+/g, '-') || 'demo-game'}-${Date.now()}`,
    diagnosticsComplete: false,
    configPulled: false,
    telemetryPosted: false
  });

  const [isRunningDiagnostics, setIsRunningDiagnostics] = useState(false);

  const runDiagnostics = async () => {
    setIsRunningDiagnostics(true);
    
    // Quick realistic loading for demo
    setTimeout(() => {
      setFormData(prev => ({ ...prev, configPulled: true }));
    }, 300);
    
    setTimeout(() => {
      setFormData(prev => ({ ...prev, telemetryPosted: true }));
    }, 600);
    
    setTimeout(() => {
      setFormData(prev => ({ ...prev, diagnosticsComplete: true }));
      setIsRunningDiagnostics(false);
    }, 1000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.diagnosticsComplete) {
      alert('Please test the integration first to continue.');
      return;
    }
    onNext(formData);
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
        {/* Step 1: SDK Selection */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-black border-b-2 border-black pb-2">
            Step 1: SDK Package
          </h3>
          <p className="text-gray-600">
            We've selected the right SDK for your platform: <strong>{userData.techStack}</strong>
          </p>
          
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="font-medium">Ready to install:</span>
              <span className="text-gray-700">Nandi SDK for {userData.techStack}</span>
            </div>
          </div>
        </div>

        {/* Step 2: App Registration */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-black border-b-2 border-black pb-2">
            Step 2: Your App Credentials
          </h3>
          <p className="text-gray-600">
            Your unique App ID and security credentials for connecting to Nandi's servers
          </p>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your App ID
            </label>
            <input
              type="text"
              value={formData.appId}
              onChange={(e) => setFormData(prev => ({ ...prev, appId: e.target.value }))}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent font-mono text-sm"
              placeholder="Your unique app identifier"
            />
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="font-medium">Security Keys Ready</span>
            </div>
            <div className="text-sm text-gray-600 font-mono bg-white p-2 rounded border">
              Public Key: pub_nandi_prod_2025_{formData.appId.slice(-8)}...
            </div>
          </div>
        </div>

        {/* Step 3: Code Integration */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-black border-b-2 border-black pb-2">
            Step 3: Integration Code
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
                      codeExamples[activeTab].code.replace('YOUR_APP_ID', formData.appId)
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
                  {codeExamples[activeTab].code.replace('YOUR_APP_ID', formData.appId)}
                </SyntaxHighlighter>
              </div>
            </div>
          </div>
        </div>

        {/* Step 4: Diagnostics */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-black border-b-2 border-black pb-2">
            Step 4: Run Diagnostics
          </h3>
          <p className="text-gray-600">
            Test that your app can pull store configuration and post telemetry
          </p>

          <div className="space-y-3">
            <div className={`flex items-center space-x-3 p-3 rounded-lg ${
              formData.configPulled ? 'bg-green-50 border border-green-200' : 'bg-gray-50 border border-gray-200'
            }`}>
              <div className={`w-4 h-4 rounded-full ${
                formData.configPulled ? 'bg-green-500' : 'bg-gray-300'
              }`}>
                {formData.configPulled && (
                  <HiCheck className="w-4 h-4 text-white" />
                )}
              </div>
              <span className={formData.configPulled ? 'text-green-800' : 'text-gray-600'}>
                Pull sample server-driven store config
              </span>
            </div>

            <div className={`flex items-center space-x-3 p-3 rounded-lg ${
              formData.telemetryPosted ? 'bg-green-50 border border-green-200' : 'bg-gray-50 border border-gray-200'
            }`}>
              <div className={`w-4 h-4 rounded-full ${
                formData.telemetryPosted ? 'bg-green-500' : 'bg-gray-300'
              }`}>
                {formData.telemetryPosted && (
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              <span className={formData.telemetryPosted ? 'text-green-800' : 'text-gray-600'}>
                Post non-PII telemetry events
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={runDiagnostics}
            disabled={isRunningDiagnostics || formData.diagnosticsComplete}
            className={`w-full py-3 px-6 rounded-lg font-medium transition-colors ${
              formData.diagnosticsComplete
                ? 'bg-green-500 text-white cursor-not-allowed'
                : isRunningDiagnostics
                ? 'bg-gray-400 text-white cursor-not-allowed'
                : 'bg-purple-500 text-white hover:bg-purple-600'
            }`}
          >
            {formData.diagnosticsComplete ? 'Diagnostics Complete ✓' : 
             isRunningDiagnostics ? 'Running Diagnostics...' : 
             'Run Diagnostics Test'}
          </button>

          {formData.diagnosticsComplete && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                  <HiCheck className="w-3 h-3 text-white" />
                </div>
                <p className="text-green-800 font-medium">Integration Successful!</p>
              </div>
              <p className="text-green-700 text-sm mt-2">
                Your game can now receive store configuration from Nandi and report experiment events. 
                No visual changes are live yet - that comes in the next steps.
              </p>
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
            className="bg-black text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-800 transition-colors"
          >
            Continue Setup
          </button>
        </div>
      </form>
    </div>
  );
}