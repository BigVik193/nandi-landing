import { ChatOpenAI } from '@langchain/openai';
import { PromptTemplate } from '@langchain/core/prompts';
import { z } from 'zod';
import { generateStrategicPricePoints, type ExperimentHypothesis, type ExperimentArm } from '@/lib/apple-price-tiers';

// Re-export types for other modules
export type { ExperimentHypothesis, ExperimentArm } from '@/lib/apple-price-tiers';

// Zod schema for validating AI response
const ExperimentArmSchema = z.object({
  price_cents: z.number().min(29).max(100000),
  quantity: z.number().min(1).max(1000),
  name: z.string().min(1).max(100),
  reasoning: z.string().min(10).max(500)
});

const ExperimentHypothesisSchema = z.object({
  hypothesis: z.string().min(20).max(500),
  reasoning: z.string().min(50).max(1000),
  recommended_arms: z.array(ExperimentArmSchema).min(2).max(4),
  expected_winner: z.string().min(1).max(100),
  test_duration_days: z.number().min(7).max(60)
});

interface VirtualItemData {
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

interface GameContext {
  name: string;
  genre?: string;
  monetization_model?: string;
  target_region?: string;
  development_stage?: string;
  platform: string;
}

export class ExperimentHypothesisAI {
  private llm: ChatOpenAI;

  constructor() {
    this.llm = new ChatOpenAI({
      modelName: 'gpt-4',
      temperature: 0.3,
      openAIApiKey: process.env.OPENAI_API_KEY,
    });
  }

  async generateExperimentHypothesis(
    virtualItem: VirtualItemData,
    gameContext: GameContext
  ): Promise<ExperimentHypothesis> {
    const prompt = this.createHypothesisPrompt();
    
    const response = await prompt.pipe(this.llm).invoke({
      item_name: virtualItem.name,
      item_description: virtualItem.description || 'No description provided',
      item_type: virtualItem.type,
      item_subtype: virtualItem.subtype || 'not specified',
      item_category: virtualItem.category || 'general',
      min_price_cents: virtualItem.min_price_cents || 99,
      max_price_cents: virtualItem.max_price_cents || 999,
      current_price_tier: virtualItem.price_tier || 'not set',
      tags: virtualItem.tags?.join(', ') || 'none',
      game_name: gameContext.name,
      game_genre: gameContext.genre || 'mobile game',
      monetization_model: gameContext.monetization_model || 'freemium',
      target_region: gameContext.target_region || 'global',
      development_stage: gameContext.development_stage || 'live',
      platform: gameContext.platform,
      metadata: JSON.stringify(virtualItem.metadata || {})
    });

    try {
      // Parse the JSON response
      const parsedResponse = JSON.parse(response.content as string);
      
      // Validate and clean up the response
      const validatedHypothesis = ExperimentHypothesisSchema.parse(parsedResponse);
      
      // Ensure price points are Apple-compliant
      const adjustedArms = validatedHypothesis.recommended_arms.map(arm => ({
        ...arm,
        price_cents: this.adjustToApplePrice(arm.price_cents)
      }));

      return {
        ...validatedHypothesis,
        recommended_arms: adjustedArms
      };
    } catch (error) {
      console.error('Failed to parse AI response:', error);
      console.error('Raw response:', response.content);
      
      // Fallback to rule-based generation
      return this.generateFallbackHypothesis(virtualItem, gameContext);
    }
  }

  private createHypothesisPrompt(): PromptTemplate {
    return PromptTemplate.fromTemplate(`
You are an expert mobile game monetization analyst and A/B testing specialist. Your job is to analyze a virtual item and create a data-driven experiment hypothesis with strategic price and quantity recommendations.

VIRTUAL ITEM DETAILS:
- Name: {item_name}
- Description: {item_description}
- Type: {item_type}
- Subtype: {item_subtype}
- Category: {item_category}
- Current Price Range: {min_price_cents} - {max_price_cents} cents
- Price Tier: {current_price_tier}
- Tags: {tags}

GAME CONTEXT:
- Game: {game_name}
- Genre: {game_genre}
- Monetization: {monetization_model}
- Region: {target_region}
- Stage: {development_stage}
- Platform: {platform}

TASK: Generate a strategic A/B testing hypothesis with 2-4 experiment arms. Consider:

1. **Price Psychology**: Psychological pricing points, price anchoring, perceived value
2. **Quantity Bundling**: How quantity affects perceived value and purchase intent
3. **Market Positioning**: Premium vs value positioning based on item type and game genre
4. **Player Behavior**: Different player segments (whales, dolphins, minnows)
5. **Competition**: Standard pricing in the genre
6. **Platform Considerations**: iOS vs Android spending patterns

CONSTRAINTS:
- All prices must be in cents (integers)
- Quantities must be reasonable for the item type
- Maximum 4 experiment arms
- Each arm needs a clear strategic rationale
- Test duration should be realistic (7-60 days)

RESPONSE FORMAT (valid JSON only):
{{
  "hypothesis": "Clear, testable hypothesis about what you expect to find",
  "reasoning": "Detailed explanation of the market research and psychology behind this hypothesis",
  "recommended_arms": [
    {{
      "price_cents": 99,
      "quantity": 1,
      "name": "Control - Current Price",
      "reasoning": "Strategic reasoning for this price/quantity combination"
    }},
    {{
      "price_cents": 199,
      "quantity": 1,
      "name": "Premium Test",
      "reasoning": "Strategic reasoning for this variation"
    }}
  ],
  "expected_winner": "Which arm you predict will perform best and why",
  "test_duration_days": 14
}}

Focus on creating arms that test different strategic hypotheses (e.g., premium positioning vs value play, single vs bundle, psychological pricing effects).
`);
  }

  private adjustToApplePrice(targetCents: number): number {
    // Import here to avoid circular dependency issues
    return generateStrategicPricePoints(targetCents, targetCents, targetCents, 1)[0] || targetCents;
  }

  private generateFallbackHypothesis(
    virtualItem: VirtualItemData,
    gameContext: GameContext
  ): ExperimentHypothesis {
    const basePriceCents = virtualItem.min_price_cents || 99;
    const maxPriceCents = virtualItem.max_price_cents || basePriceCents * 3;
    
    const pricePoints = generateStrategicPricePoints(
      basePriceCents,
      virtualItem.min_price_cents,
      maxPriceCents,
      4
    );

    const arms: ExperimentArm[] = pricePoints.map((price, index) => ({
      price_cents: price,
      quantity: this.getRecommendedQuantity(virtualItem.type, index),
      name: index === 0 ? 'Control - Current Price' : `Variant ${index} - $${(price / 100).toFixed(2)}`,
      reasoning: this.getFallbackReasoning(price, index, virtualItem.type)
    }));

    return {
      hypothesis: `Testing different price points for ${virtualItem.name} to optimize revenue and conversion rate`,
      reasoning: `Based on the item type (${virtualItem.type}) and price range, we're testing strategic price points to find the optimal balance between conversion rate and revenue per user.`,
      recommended_arms: arms,
      expected_winner: arms[1]?.name || arms[0].name,
      test_duration_days: 14
    };
  }

  private getRecommendedQuantity(itemType: string, armIndex: number): number {
    switch (itemType) {
      case 'consumable':
        return armIndex === 0 ? 1 : Math.min(armIndex * 2, 10);
      case 'subscription':
        return 1; // Subscriptions are always quantity 1
      case 'non_consumable':
        return 1; // Non-consumables are typically quantity 1
      default:
        return 1;
    }
  }

  private getFallbackReasoning(priceCents: number, index: number, itemType: string): string {
    const price = priceCents / 100;
    
    if (index === 0) {
      return 'Baseline control to measure current performance';
    } else if (price < 1.0) {
      return 'Low-friction impulse purchase targeting broad audience';
    } else if (price < 3.0) {
      return 'Sweet spot pricing for committed players';
    } else if (price < 10.0) {
      return 'Premium pricing targeting engaged spenders';
    } else {
      return 'High-value positioning for whale segment';
    }
  }
}

export async function generateExperimentForVirtualItem(
  virtualItem: VirtualItemData,
  gameContext: GameContext
): Promise<ExperimentHypothesis> {
  const ai = new ExperimentHypothesisAI();
  return ai.generateExperimentHypothesis(virtualItem, gameContext);
}