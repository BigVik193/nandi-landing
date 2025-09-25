import { BanditService } from './bandit-service';

export async function exampleUsage() {
  const banditService = new BanditService();

  console.log('=== Bandit Algorithm Usage Examples ===\n');

  try {
    // Example 1: Select a variant for a user
    console.log('1. Selecting variant for user in experiment:');
    const experimentId = 'example-experiment-id';
    const userId = 'user-123';
    
    const selectedVariant = await banditService.selectVariantForUser(experimentId, userId);
    console.log(`Selected variant: ${selectedVariant}\n`);

    // Example 2: Get current metrics for an experiment
    console.log('2. Getting experiment metrics:');
    const metrics = await banditService.getArmMetrics(experimentId);
    console.log('Metrics:', JSON.stringify(metrics, null, 2));
    console.log();

    // Example 3: Update traffic weights based on performance
    console.log('3. Updating traffic weights:');
    const updates = await banditService.updateTrafficWeights(experimentId);
    console.log('Traffic weight updates:', JSON.stringify(updates, null, 2));
    console.log();

    // Example 4: Check if experiment should be stopped
    console.log('4. Checking if experiment should be stopped:');
    const shouldStop = await banditService.shouldStopExperiment(experimentId);
    console.log(`Should stop experiment: ${shouldStop}\n`);

    // Example 5: Update all running experiments
    console.log('5. Updating all running experiments:');
    const allUpdates = await banditService.updateAllRunningExperiments();
    console.log(`Updated ${Object.keys(allUpdates).length} experiments`);
    console.log();

  } catch (error) {
    console.error('Error in bandit usage example:', error);
  }
}

export async function simulateBanditFlow() {
  console.log('=== Simulated Bandit Flow ===\n');
  
  // This would typically be called by your game client when showing store items
  const selectVariantForStore = async (experimentId: string, userId: string) => {
    try {
      const response = await fetch(`/api/experiments/${experimentId}/select-variant`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log(`User ${userId} assigned to variant: ${data.selectedArmId}`);
      return data.selectedArmId;
    } catch (error) {
      console.error('Error selecting variant:', error);
      return null;
    }
  };

  // This would be called periodically (e.g., every hour) to update traffic weights
  const updateTrafficWeights = async (experimentId: string) => {
    try {
      const response = await fetch(`/api/experiments/${experimentId}/update-traffic`, {
        method: 'POST'
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Traffic weights updated:', data.updates);
      return data.updates;
    } catch (error) {
      console.error('Error updating traffic weights:', error);
      return null;
    }
  };

  // This would be called by a cron job (e.g., every 6 hours)
  const updateAllExperiments = async () => {
    try {
      const response = await fetch('/api/bandit/update-all', {
        method: 'POST'
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log(`Bulk update completed: ${data.successfulUpdates}/${data.totalExperiments} experiments updated`);
      return data;
    } catch (error) {
      console.error('Error in bulk update:', error);
      return null;
    }
  };

  // Example usage in sequence
  const experimentId = 'experiment-123';
  
  console.log('Step 1: Game clients request variants');
  await selectVariantForStore(experimentId, 'user-1');
  await selectVariantForStore(experimentId, 'user-2');
  await selectVariantForStore(experimentId, 'user-3');
  console.log();

  console.log('Step 2: Update traffic weights for specific experiment');
  await updateTrafficWeights(experimentId);
  console.log();

  console.log('Step 3: Bulk update all running experiments (cron job)');
  await updateAllExperiments();
}

// Explanation of the flow:
console.log(`
=== How the Bandit Algorithm Works ===

1. INITIALIZATION:
   - Experiments start with equal traffic allocation across all arms
   - Each arm tracks successes (purchases) and trials (store views)

2. REAL-TIME VARIANT SELECTION:
   - When a user opens the store, the SDK calls /api/experiments/{id}/select-variant
   - Thompson Sampling algorithm samples from each arm's Beta distribution
   - The arm with the highest sample is selected
   - User sees the corresponding price/quantity variant

3. DATA COLLECTION:
   - Store views are logged as 'store_view' events
   - Purchases are logged in the purchases table
   - Both are linked to the experiment_arm_id

4. TRAFFIC WEIGHT UPDATES:
   - Periodically (hourly/daily), traffic weights are recalculated
   - Arms with higher conversion rates get more traffic
   - Control arm always maintains minimum traffic allocation

5. CONVERGENCE:
   - Over time, most traffic flows to the best-performing variant
   - Statistical significance testing determines when to stop

6. AUTOMATION:
   - Cron job updates all experiments automatically
   - No manual intervention required once experiments are running
`);