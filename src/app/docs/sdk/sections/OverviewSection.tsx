import { InfoBox } from '../components/InfoBox';

export function OverviewSection() {
  return (
    <section id="overview" className="mb-12">
      <h2 className="text-3xl font-bold text-black mb-6">Overview</h2>
      
      <InfoBox type="info" title="What is Nandi SDK?" className="mb-6">
        <p>
          The Nandi SDK is a powerful JavaScript library that automatically optimizes your in-game store prices and quantities 
          through intelligent A/B testing. It uses advanced bandit algorithms to continuously learn which price points 
          and quantities drive the highest revenue and conversion rates for your game.
        </p>
      </InfoBox>
      
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-black">Key Features</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-2">🎯 Automatic Optimization</h4>
            <p className="text-sm text-gray-600">
              Real-time price optimization using Thompson Sampling bandit algorithms
            </p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-2">📊 Comprehensive Analytics</h4>
            <p className="text-sm text-gray-600">
              Track store views, item clicks, purchases, and conversion rates automatically
            </p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-2">🏪 Platform Support</h4>
            <p className="text-sm text-gray-600">
              Works seamlessly with iOS StoreKit, Android Play Billing, and Unity IAP
            </p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-2">🔒 Secure & Reliable</h4>
            <p className="text-sm text-gray-600">
              Server-side verification and secure API key authentication
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}