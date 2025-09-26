import { InfoBox } from '../components/InfoBox';

export function TroubleshootingSection() {
  const issues = [
    {
      title: 'API Key Invalid',
      error: '"Invalid API key" or 401 Unauthorized',
      solution: 'Verify your API key in the dashboard. Make sure you\'re using the correct key for your environment (development vs. production).'
    },
    {
      title: 'Virtual Item Not Found',
      error: '"Virtual item \'item_name\' not found"',
      solution: 'Ensure the virtual item exists in your dashboard and is active. Check that you\'re using the correct item ID or name.'
    },
    {
      title: 'No SKU Variants Available',
      error: '"No SKU variants found for this item"',
      solution: 'Create SKU variants for your virtual items in the dashboard. Make sure they\'re properly configured for your target platform.'
    },
    {
      title: 'SDK Not Initialized',
      error: '"SDK must be initialized before tracking events"',
      solution: 'Call nandi.initialize() before making any other SDK calls. Wait for the promise to resolve before proceeding.'
    },
    {
      title: 'Network Timeout',
      error: 'Network request timeout or connection errors',
      solution: 'Implement retry logic and fallback pricing. Cache variant data locally to handle temporary network issues.'
    }
  ];

  return (
    <section id="troubleshooting" className="mb-12">
      <h2 className="text-3xl font-bold text-black mb-6">Troubleshooting</h2>

      <div className="space-y-4">
        {issues.map((issue, index) => (
          <InfoBox key={index} type="error" title={issue.title}>
            <p className="mb-2">
              <strong>Error:</strong> {issue.error}
            </p>
            <p>
              <strong>Solution:</strong> {issue.solution}
            </p>
          </InfoBox>
        ))}

        <InfoBox type="warning" title="Debug Mode" className="mt-6">
          <p className="mb-2">
            Enable debug mode to see detailed logs: <code className="bg-yellow-100 px-1 rounded">new NandiSDK({`{ debug: true }`})</code>
          </p>
          <p>
            This will log all SDK operations, API calls, and responses to the console.
          </p>
        </InfoBox>
      </div>

      <div className="mt-8 bg-gray-100 border border-gray-300 rounded-lg p-4">
        <h3 className="font-semibold text-gray-900 mb-2">Need More Help?</h3>
        <p className="text-sm text-gray-700 mb-3">
          If you're still experiencing issues, please contact our support team:
        </p>
        <ul className="text-sm text-gray-700 space-y-1">
          <li>• Email: <a href="mailto:support@nandi.dev" className="text-indigo-600 hover:text-indigo-700">support@nandi.dev</a></li>
          <li>• Discord: <a href="https://discord.gg/nandi" className="text-indigo-600 hover:text-indigo-700">discord.gg/nandi</a></li>
          <li>• Documentation: <a href="https://docs.nandi.dev" className="text-indigo-600 hover:text-indigo-700">docs.nandi.dev</a></li>
        </ul>
      </div>
    </section>
  );
}