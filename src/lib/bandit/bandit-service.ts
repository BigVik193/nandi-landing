import { supabaseAdmin } from '@/lib/supabase/server';
import { ThompsonSamplingBandit, type ExperimentArm, type BanditUpdate } from './thompson-sampling';

export interface ExperimentData {
  id: string;
  gameId: string;
  virtualItemId: string;
  status: string;
  arms: {
    id: string;
    name: string;
    trafficWeight: number;
    isControl: boolean;
    skuVariantId: string;
  }[];
}

export interface ArmMetrics {
  armId: string;
  storeViews: number;
  purchases: number;
}

export class BanditService {
  private bandit: ThompsonSamplingBandit;

  constructor() {
    this.bandit = new ThompsonSamplingBandit();
  }

  async getRunningExperiments(gameId?: string): Promise<ExperimentData[]> {
    let query = supabaseAdmin
      .from('experiments')
      .select(`
        id,
        game_id,
        virtual_item_id,
        status,
        experiment_arms (
          id,
          name,
          traffic_weight,
          is_control,
          sku_variant_id
        )
      `)
      .eq('status', 'running')
      .not('experiment_arms', 'is', null);

    if (gameId) {
      query = query.eq('game_id', gameId);
    }

    const { data: experiments, error } = await query;

    if (error) {
      throw new Error(`Failed to fetch running experiments: ${error.message}`);
    }

    return (experiments || []).map(exp => ({
      id: exp.id,
      gameId: exp.game_id,
      virtualItemId: exp.virtual_item_id,
      status: exp.status,
      arms: (exp.experiment_arms || []).map((arm: any) => ({
        id: arm.id,
        name: arm.name,
        trafficWeight: arm.traffic_weight,
        isControl: arm.is_control,
        skuVariantId: arm.sku_variant_id
      }))
    }));
  }

  async getAssignmentCounts(experimentId: string): Promise<Record<string, number>> {
    const { data: assignments, error } = await supabaseAdmin
      .from('assignments')
      .select('experiment_arm_id')
      .eq('experiment_id', experimentId);

    if (error) {
      throw new Error(`Failed to fetch assignments: ${error.message}`);
    }

    return (assignments || []).reduce((acc: Record<string, number>, assignment) => {
      if (assignment.experiment_arm_id) {
        acc[assignment.experiment_arm_id] = (acc[assignment.experiment_arm_id] || 0) + 1;
      }
      return acc;
    }, {});
  }

  async getArmMetrics(experimentId: string, timeframeDays: number = 7): Promise<ArmMetrics[]> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - timeframeDays);

    const { data: storeViewsData, error: viewsError } = await supabaseAdmin
      .from('events')
      .select('experiment_arm_id')
      .eq('experiment_id', experimentId)
      .eq('event_type', 'store_view')
      .gte('timestamp', cutoffDate.toISOString());

    if (viewsError) {
      throw new Error(`Failed to fetch store views: ${viewsError.message}`);
    }

    const { data: purchasesData, error: purchasesError } = await supabaseAdmin
      .from('purchases')
      .select('experiment_arm_id')
      .eq('experiment_id', experimentId)
      .eq('status', 'verified')
      .gte('purchased_at', cutoffDate.toISOString());

    if (purchasesError) {
      throw new Error(`Failed to fetch purchases: ${purchasesError.message}`);
    }

    const viewsByArm = (storeViewsData || []).reduce((acc: Record<string, number>, event) => {
      if (event.experiment_arm_id) {
        acc[event.experiment_arm_id] = (acc[event.experiment_arm_id] || 0) + 1;
      }
      return acc;
    }, {});

    const purchasesByArm = (purchasesData || []).reduce((acc: Record<string, number>, purchase) => {
      if (purchase.experiment_arm_id) {
        acc[purchase.experiment_arm_id] = (acc[purchase.experiment_arm_id] || 0) + 1;
      }
      return acc;
    }, {});

    const allArmIds = new Set([...Object.keys(viewsByArm), ...Object.keys(purchasesByArm)]);

    return Array.from(allArmIds).map(armId => ({
      armId,
      storeViews: viewsByArm[armId] || 0,
      purchases: purchasesByArm[armId] || 0
    }));
  }

  async selectVariantForUser(experimentId: string, userId?: string): Promise<string | null> {
    const experiments = await this.getRunningExperiments();
    const experiment = experiments.find(exp => exp.id === experimentId);
    
    if (!experiment || experiment.arms.length === 0) {
      return null;
    }

    const metrics = await this.getArmMetrics(experimentId);
    
    const arms: ExperimentArm[] = experiment.arms.map(arm => {
      const armMetric = metrics.find(m => m.armId === arm.id);
      const storeViews = armMetric?.storeViews || 0;
      const purchases = armMetric?.purchases || 0;
      
      return {
        id: arm.id,
        name: arm.name,
        trafficWeight: arm.trafficWeight,
        isControl: arm.isControl,
        successes: purchases,
        trials: storeViews
      };
    });

    if (arms.every(arm => arm.trials === 0)) {
      const randomIndex = Math.floor(Math.random() * arms.length);
      return arms[randomIndex].id;
    }

    return this.bandit.selectArm(arms);
  }

  async updateTrafficWeights(experimentId: string): Promise<BanditUpdate[]> {
    const experiments = await this.getRunningExperiments();
    const experiment = experiments.find(exp => exp.id === experimentId);
    
    if (!experiment) {
      throw new Error(`Experiment ${experimentId} not found or not running`);
    }

    const metrics = await this.getArmMetrics(experimentId);
    
    const arms: ExperimentArm[] = experiment.arms.map(arm => {
      const armMetric = metrics.find(m => m.armId === arm.id);
      const storeViews = armMetric?.storeViews || 0;
      const purchases = armMetric?.purchases || 0;
      
      return {
        id: arm.id,
        name: arm.name,
        trafficWeight: arm.trafficWeight,
        isControl: arm.isControl,
        successes: purchases,
        trials: storeViews
      };
    });

    const updates = this.bandit.updateTrafficWeights(arms);

    for (const update of updates) {
      const { error } = await supabaseAdmin
        .from('experiment_arms')
        .update({ 
          traffic_weight: Math.round(update.newTrafficWeight * 100) / 100,
          updated_at: new Date().toISOString()
        })
        .eq('id', update.armId);

      if (error) {
        console.error(`Failed to update traffic weight for arm ${update.armId}:`, error);
      }
    }

    return updates;
  }

  async updateAllRunningExperiments(gameId?: string): Promise<Record<string, BanditUpdate[]>> {
    const experiments = await this.getRunningExperiments(gameId);
    const results: Record<string, BanditUpdate[]> = {};

    for (const experiment of experiments) {
      if (experiment.arms.length > 1) {
        try {
          const updates = await this.updateTrafficWeights(experiment.id);
          results[experiment.id] = updates;
        } catch (error) {
          console.error(`Failed to update experiment ${experiment.id}:`, error);
          results[experiment.id] = [];
        }
      }
    }

    return results;
  }

  async shouldStopExperiment(experimentId: string, minSampleSize: number = 100): Promise<boolean> {
    const experiments = await this.getRunningExperiments();
    const experiment = experiments.find(exp => exp.id === experimentId);
    
    if (!experiment) {
      return false;
    }

    const metrics = await this.getArmMetrics(experimentId);
    
    const arms: ExperimentArm[] = experiment.arms.map(arm => {
      const armMetric = metrics.find(m => m.armId === arm.id);
      const storeViews = armMetric?.storeViews || 0;
      const purchases = armMetric?.purchases || 0;
      
      return {
        id: arm.id,
        name: arm.name,
        trafficWeight: arm.trafficWeight,
        isControl: arm.isControl,
        successes: purchases,
        trials: storeViews
      };
    });

    return this.bandit.shouldStopExperiment(arms, minSampleSize);
  }
}