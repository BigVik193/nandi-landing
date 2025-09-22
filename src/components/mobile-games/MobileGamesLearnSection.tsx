'use client';

import { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';

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
  cocos_ts: {
    title: 'Cocos Creator (TypeScript)',
    language: 'typescript',
    code: `import { _decorator, Component } from 'cc';
import { Nandi } from 'nandi-sdk';

const { ccclass } = _decorator;

@ccclass('NandiBootstrap')
export class NandiBootstrap extends Component {
  start() {
    Nandi.init({ appId: 'YOUR_APP_ID' });
  }

  onLevelComplete() {
    Nandi.presentUpsell({ trigger: 'level_complete' });
  }
}`
  },
  cocos_cpp: {
    title: 'Cocos2d-x (C++)',
    language: 'cpp',
    code: `#include "NandiSDK.hpp"

bool AppDelegate::applicationDidFinishLaunching() {
    Nandi::Config cfg; cfg.appId = "YOUR_APP_ID";
    Nandi::SDK::Init(cfg);
    return true;
}

void GameScene::onLevelComplete() {
    Nandi::UpsellOptions o; o.trigger = "level_complete";
    Nandi::SDK::PresentUpsell(o);
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

export default function LearnSection() {
  const [activeTab, setActiveTab] = useState<keyof typeof codeExamples>('unity');

  return (
    <section id="installation" className="bg-section py-12 sm:py-16 lg:py-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-start">
          {/* Left Side - Text Content */}
          <div className="lg:col-span-1 space-y-6 min-w-0">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-medium text-black leading-tight font-title break-words">
              Deploy your in-game store in minutes
            </h2>
            
            <p className="text-lg sm:text-xl text-gray-700 leading-relaxed">
              Get up and running in minutes, not days. Nandi integrates seamlessly with all major game engines and platforms. Just a few lines of code and you're ready to start optimizing your IAP revenue with AI-powered testing.
            </p>

            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                <span className="text-gray-700">Drop-in SDK for all major engines</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                <span className="text-gray-700">Lightweight and performant</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                <span className="text-gray-700">Works with existing analytics</span>
              </div>
            </div>
          </div>

          {/* Right Side - Code Examples with Tabs */}
          <div className="lg:col-span-1 min-w-0 w-full">
            {/* Early Access Notice */}
            <div className="mb-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
              <div className="flex items-center space-x-2">
                <div className="w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-orange-800 font-medium">Early Access Preview</p>
              </div>
              <p className="text-orange-700 text-sm mt-2">
                The Nandi SDK is currently in private beta. The installation code shown below is for demonstration purposes only and won't work until you receive early access.
              </p>
            </div>
            
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden w-full">
              {/* Tab Navigation */}
              <div className="border-b border-gray-200 bg-gray-50 overflow-x-auto">
                <div className="flex min-w-max">
                  {Object.entries(codeExamples).map(([key, example]) => (
                    <button
                      key={key}
                      onClick={() => setActiveTab(key as keyof typeof codeExamples)}
                      className={`px-3 sm:px-4 py-3 text-xs sm:text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                        activeTab === key
                          ? 'border-blue-500 text-blue-600 bg-white'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      {example.title}
                    </button>
                  ))}
                </div>
              </div>

              {/* Code Content */}
              <div className="relative overflow-hidden">
                <div className="absolute top-4 right-4 z-10">
                  <button
                    onClick={() => navigator.clipboard.writeText(codeExamples[activeTab].code)}
                    className="text-gray-400 hover:text-gray-600 transition-colors bg-gray-800 hover:bg-gray-700 p-2 rounded"
                    title="Copy code"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </button>
                </div>
                <div className="overflow-x-auto max-w-full">
                  <SyntaxHighlighter
                    language={codeExamples[activeTab].language}
                    style={tomorrow}
                    customStyle={{
                      margin: 0,
                      borderRadius: 0,
                      fontSize: '11px',
                      lineHeight: '1.4',
                      padding: '1rem',
                      maxWidth: '100%',
                      overflowX: 'auto',
                    }}
                    codeTagProps={{
                      style: {
                        fontSize: '11px',
                        fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
                        whiteSpace: 'pre',
                      }
                    }}
                  >
                    {codeExamples[activeTab].code}
                  </SyntaxHighlighter>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}