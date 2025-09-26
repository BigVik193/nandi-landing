import { CodeBlock } from '../components/CodeBlock';
import { InfoBox } from '../components/InfoBox';

export function CoreConceptsSection() {
  return (
    <section id="core-concepts" className="mb-12">
      <h2 className="text-3xl font-bold text-black mb-6">Core Concepts</h2>

      <div id="variant-selection" className="mb-8">
        <h3 className="text-xl font-semibold text-black mb-4">Variant Selection</h3>
        <p className="text-gray-600 mb-4">
          The SDK automatically selects the optimal price and quantity combination for each item 
          based on real-time performance data. This process happens transparently when you request 
          an item variant.
        </p>
        <CodeBlock
          language="javascript"
          code={`// Get the optimized variant for a virtual item
const variant = await nandi.getItemVariant('coins_pack');

// The variant contains all necessary information
console.log(variant.variant.productId);     // App Store/Play Store product ID
console.log(variant.variant.price.formatted); // "$0.99"
console.log(variant.variant.quantity);       // 100
console.log(variant.experimentId);          // Current experiment ID if active
console.log(variant.isExperiment);          // true if part of A/B test`}
          id="variant-selection"
        />
      </div>

      <div id="ab-testing" className="mb-8">
        <h3 className="text-xl font-semibold text-black mb-4">A/B Testing</h3>
        <p className="text-gray-600 mb-4">
          Nandi automatically runs A/B tests on your virtual items, testing different price points 
          and quantities to find the optimal combination. The SDK handles all the complexity:
        </p>
        <ul className="list-disc list-inside text-gray-600 space-y-2 mb-4">
          <li>Automatic user assignment to test groups</li>
          <li>Consistent experience for each user</li>
          <li>Real-time performance tracking</li>
          <li>Statistical significance calculation</li>
          <li>Automatic winner selection</li>
        </ul>
      </div>

      <div id="bandit-algorithms" className="mb-8">
        <h3 className="text-xl font-semibold text-black mb-4">Bandit Algorithms</h3>
        <p className="text-gray-600 mb-4">
          Nandi uses Thompson Sampling, a sophisticated bandit algorithm that balances exploration 
          (trying new variants) with exploitation (using proven winners). This approach:
        </p>
        <InfoBox type="success">
          <ul className="space-y-2">
            <li className="flex items-start">
              <span className="text-green-600 mr-2">✓</span>
              <span>Reduces opportunity cost compared to traditional A/B testing</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-600 mr-2">✓</span>
              <span>Adapts in real-time to user behavior</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-600 mr-2">✓</span>
              <span>Automatically allocates more traffic to winning variants</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-600 mr-2">✓</span>
              <span>Continues to explore new opportunities while exploiting winners</span>
            </li>
          </ul>
        </InfoBox>
      </div>
    </section>
  );
}