import { CodeBlock } from '../components/CodeBlock';
import { InfoBox } from '../components/InfoBox';

export function GettingStartedSection() {
  return (
    <section id="getting-started" className="mb-12">
      <h2 className="text-3xl font-bold text-black mb-6">Getting Started</h2>
      
      <div id="installation" className="mb-8">
        <h3 className="text-xl font-semibold text-black mb-4">Installation</h3>
        <div className="space-y-4">
          <div>
            <p className="text-gray-600 mb-3">Install the Nandi SDK using npm or yarn:</p>
            <CodeBlock
              language="bash"
              code="npm install @nandi/sdk"
              id="install-npm"
            />
          </div>
          <div>
            <p className="text-gray-600 mb-3">Or using yarn:</p>
            <CodeBlock
              language="bash"
              code="yarn add @nandi/sdk"
              id="install-yarn"
            />
          </div>
        </div>
      </div>

      <div id="initialization" className="mb-8">
        <h3 className="text-xl font-semibold text-black mb-4">Initialization</h3>
        <p className="text-gray-600 mb-3">Initialize the SDK with your API key and game configuration:</p>
        <CodeBlock
          language="javascript"
          code={`import NandiSDK from '@nandi/sdk';

const nandi = new NandiSDK({
  apiKey: 'your_api_key_here',
  gameId: 'your_game_id',
  baseUrl: 'https://api.nandi.dev', // Optional: defaults to production
  debug: true // Optional: enables debug logging
});

// Initialize with player identification
await nandi.initialize('player_123', {
  level: 42,
  vip: false,
  country: 'US'
});`}
          id="init-code"
        />
      </div>

      <div id="authentication" className="mb-8">
        <h3 className="text-xl font-semibold text-black mb-4">Authentication</h3>
        
        <InfoBox type="warning" title="Important: Secure Your API Key" className="mb-4">
          <p>
            Never expose your API key in client-side code for web games. For mobile games, 
            use environment variables or secure storage mechanisms.
          </p>
        </InfoBox>
        
        <p className="text-gray-600 mb-3">
          Your API key authenticates your game with the Nandi backend. You can find it in your 
          dashboard under API Key Management.
        </p>
      </div>
    </section>
  );
}