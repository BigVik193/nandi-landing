import { supabaseAdmin } from '@/lib/supabase/server';
import { generateExperimentForVirtualItem, type ExperimentHypothesis } from './experiment-hypothesis';
import { findClosestApplePrice } from '@/lib/apple-price-tiers';

interface VirtualItemData {
  id: string;
  game_id: string;
  item_id: string;
  name: string;
  description?: string;
  type: 'consumable' | 'non_consumable' | 'subscription';
  subtype?: 'currency' | 'item' | 'resource' | 'other';
  category?: string;
  min_price_cents?: number;
  max_price_cents?: number;
  price_tier?: number;
  tags?: string[];
  metadata?: Record<string, any>;
}

interface GameData {
  id: string;
  name: string;
  bundle_id?: string;
  platform: string;
  genre?: string;
  monetization_model?: string;
  target_region?: string;
  development_stage?: string;
}

export class AutoExperimentCreator {
  
  /**
   * Main function to create an experiment for a newly created virtual item
   */
  async createExperimentForVirtualItem(virtualItemId: string): Promise<{
    success: boolean;
    experimentId?: string;
    error?: string;
    hypothesis?: ExperimentHypothesis;
    skuVariantsCreated?: number;
  }> {
    try {
      console.log(`[AutoExperiment] Starting experiment creation for virtual item: ${virtualItemId}`);

      // Get virtual item data
      const virtualItem = await this.getVirtualItemData(virtualItemId);
      if (!virtualItem) {
        return { success: false, error: 'Virtual item not found' };
      }

      // Get game context
      const gameData = await this.getGameData(virtualItem.game_id);
      if (!gameData) {
        return { success: false, error: 'Game not found' };
      }

      // Check if experiment already exists for this virtual item
      const existingExperiment = await this.checkExistingExperiment(virtualItemId);
      if (existingExperiment) {
        console.log(`[AutoExperiment] Experiment already exists for virtual item: ${virtualItemId}`);
        return { 
          success: false, 
          error: 'Experiment already exists for this virtual item' 
        };
      }

      // Generate AI hypothesis
      console.log(`[AutoExperiment] Generating AI hypothesis for ${virtualItem.name}`);
      const hypothesis = await generateExperimentForVirtualItem(virtualItem, gameData);
      
      // Create SKU variants for each recommended arm
      console.log(`[AutoExperiment] Creating ${hypothesis.recommended_arms.length} SKU variants`);
      const skuVariants = await this.createSKUVariants(virtualItem, hypothesis);
      
      if (skuVariants.length === 0) {
        return { success: false, error: 'Failed to create any SKU variants' };
      }

      // Create experiment
      console.log(`[AutoExperiment] Creating experiment: ${virtualItem.name} Price Optimization`);
      const experiment = await this.createExperiment(virtualItem, gameData, hypothesis);
      
      if (!experiment) {
        return { success: false, error: 'Failed to create experiment' };
      }

      // Create experiment arms
      console.log(`[AutoExperiment] Creating experiment arms`);
      const arms = await this.createExperimentArms(experiment.id, hypothesis, skuVariants);
      
      if (arms.length === 0) {
        // Cleanup: delete experiment if no arms were created
        await supabaseAdmin.from('experiments').delete().eq('id', experiment.id);
        return { success: false, error: 'Failed to create experiment arms' };
      }

      console.log(`[AutoExperiment] Successfully created experiment ${experiment.id} with ${arms.length} arms`);

      return {
        success: true,
        experimentId: experiment.id,
        hypothesis,
        skuVariantsCreated: skuVariants.length
      };

    } catch (error) {
      console.error('[AutoExperiment] Error creating experiment:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  private async getVirtualItemData(virtualItemId: string): Promise<VirtualItemData | null> {
    const { data, error } = await supabaseAdmin
      .from('virtual_items')
      .select('*')
      .eq('id', virtualItemId)
      .eq('status', 'active')
      .single();

    if (error) {
      console.error('[AutoExperiment] Error fetching virtual item:', error);
      return null;
    }

    return data;
  }

  private async getGameData(gameId: string): Promise<GameData | null> {
    const { data, error } = await supabaseAdmin
      .from('games')
      .select('*')
      .eq('id', gameId)
      .single();

    if (error) {
      console.error('[AutoExperiment] Error fetching game:', error);
      return null;
    }

    return data;
  }

  private async checkExistingExperiment(virtualItemId: string): Promise<boolean> {
    const { data } = await supabaseAdmin
      .from('experiments')
      .select('id')
      .eq('virtual_item_id', virtualItemId)
      .in('status', ['draft', 'running', 'paused'])
      .maybeSingle();

    return !!data;
  }

  private async createSKUVariants(
    virtualItem: VirtualItemData, 
    hypothesis: ExperimentHypothesis
  ): Promise<any[]> {
    const createdVariants = [];

    for (const [index, arm] of hypothesis.recommended_arms.entries()) {
      // Ensure price is Apple-compliant
      const adjustedPriceCents = findClosestApplePrice(arm.price_cents);
      
      // Generate unique product ID
      const productId = `${virtualItem.item_id}_v${index + 1}_${adjustedPriceCents}c_${arm.quantity}q`;
      
      const skuData = {
        virtual_item_id: virtualItem.id,
        app_store_product_id: productId,
        price_cents: adjustedPriceCents,
        quantity: arm.quantity,
        currency: 'USD',
        platform: 'ios', // Start with iOS, could extend to Android
        product_type: virtualItem.type === 'subscription' ? 'auto_renewable_subscription' : 
                     virtualItem.type === 'non_consumable' ? 'non_consumable' : 'consumable',
        name: arm.name,
        metadata: {
          auto_generated: true,
          experiment_hypothesis: hypothesis.hypothesis,
          arm_reasoning: arm.reasoning,
          original_price_cents: arm.price_cents,
          adjusted_price_cents: adjustedPriceCents,
          created_by: 'ai_experiment_creator'
        }
      };

      const { data: skuVariant, error } = await supabaseAdmin
        .from('sku_variants')
        .insert(skuData)
        .select()
        .single();

      if (error) {
        console.error(`[AutoExperiment] Error creating SKU variant for arm ${index + 1}:`, error);
        continue;
      }

      createdVariants.push(skuVariant);
    }

    return createdVariants;
  }

  private async createExperiment(
    virtualItem: VirtualItemData,
    gameData: GameData,
    hypothesis: ExperimentHypothesis
  ): Promise<any | null> {
    const experimentData = {
      game_id: virtualItem.game_id,
      virtual_item_id: virtualItem.id,
      name: `${virtualItem.name} - AI Price Optimization`,
      description: `${hypothesis.hypothesis}\n\nReasoning: ${hypothesis.reasoning}\n\nExpected Winner: ${hypothesis.expected_winner}`,
      status: 'running',
      traffic_allocation: 100,
      start_date: new Date().toISOString(),
      end_date: null, // Let bandit algorithm decide when to stop
      metadata: {
        auto_generated: true,
        ai_hypothesis: hypothesis.hypothesis,
        ai_reasoning: hypothesis.reasoning,
        expected_winner: hypothesis.expected_winner,
        test_duration_days: hypothesis.test_duration_days,
        created_by: 'ai_experiment_creator',
        virtual_item_name: virtualItem.name,
        game_name: gameData.name
      }
    };

    const { data: experiment, error } = await supabaseAdmin
      .from('experiments')
      .insert(experimentData)
      .select()
      .single();

    if (error) {
      console.error('[AutoExperiment] Error creating experiment:', error);
      return null;
    }

    return experiment;
  }

  private async createExperimentArms(
    experimentId: string,
    hypothesis: ExperimentHypothesis,
    skuVariants: any[]
  ): Promise<any[]> {
    const createdArms = [];
    const equalTrafficWeight = 100 / hypothesis.recommended_arms.length;

    for (const [index, arm] of hypothesis.recommended_arms.entries()) {
      const skuVariant = skuVariants[index];
      if (!skuVariant) {
        console.error(`[AutoExperiment] No SKU variant found for arm ${index + 1}`);
        continue;
      }

      const armData = {
        experiment_id: experimentId,
        sku_variant_id: skuVariant.id,
        name: arm.name,
        traffic_weight: equalTrafficWeight,
        is_control: index === 0, // First arm is control
        metadata: {
          auto_generated: true,
          ai_reasoning: arm.reasoning,
          price_dollars: arm.price_cents / 100,
          quantity: arm.quantity,
          arm_index: index,
          is_expected_winner: arm.name === hypothesis.expected_winner
        }
      };

      const { data: experimentArm, error } = await supabaseAdmin
        .from('experiment_arms')
        .insert(armData)
        .select()
        .single();

      if (error) {
        console.error(`[AutoExperiment] Error creating experiment arm ${index + 1}:`, error);
        continue;
      }

      createdArms.push(experimentArm);
    }

    return createdArms;
  }
}

/**
 * Convenience function to trigger experiment creation for a virtual item
 */
export async function createExperimentForVirtualItem(virtualItemId: string) {
  const creator = new AutoExperimentCreator();
  return creator.createExperimentForVirtualItem(virtualItemId);
}