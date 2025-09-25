export interface ExperimentArm {
  id: string;
  name: string;
  trafficWeight: number;
  isControl: boolean;
  successes: number;
  trials: number;
}

export interface BanditMetrics {
  storeViews: number;
  purchases: number;
  conversionRate: number;
}

export interface BanditUpdate {
  armId: string;
  newTrafficWeight: number;
  confidence: number;
}

export class ThompsonSamplingBandit {
  private rng: () => number;

  constructor(seed?: number) {
    this.rng = seed ? this.seededRandom(seed) : Math.random;
  }

  private seededRandom(seed: number): () => number {
    let m = 0x80000000;
    let a = 1103515245;
    let c = 12345;
    let state = seed || Math.floor(Math.random() * (m - 1));
    
    return () => {
      state = (a * state + c) % m;
      return state / (m - 1);
    };
  }

  private betaDistribution(alpha: number, beta: number): number {
    if (alpha <= 0 || beta <= 0) return 0;
    
    let x = this.gammaDistribution(alpha, 1);
    let y = this.gammaDistribution(beta, 1);
    
    return x / (x + y);
  }

  private gammaDistribution(shape: number, scale: number): number {
    if (shape < 1) {
      return this.gammaDistribution(shape + 1, scale) * Math.pow(this.rng(), 1 / shape);
    }

    let d = shape - 1 / 3;
    let c = 1 / Math.sqrt(9 * d);

    for (;;) {
      let x, v;
      do {
        x = this.normalDistribution();
        v = 1 + c * x;
      } while (v <= 0);

      v = v * v * v;
      let u = this.rng();

      if (u < 1 - 0.331 * x * x * x * x) {
        return d * v * scale;
      }

      if (Math.log(u) < 0.5 * x * x + d * (1 - v + Math.log(v))) {
        return d * v * scale;
      }
    }
  }

  private normalDistribution(): number {
    let u = 0, v = 0;
    while (u === 0) u = this.rng();
    while (v === 0) v = this.rng();
    return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  }

  selectArm(arms: ExperimentArm[]): string {
    if (arms.length === 0) throw new Error('No arms provided');
    if (arms.length === 1) return arms[0].id;

    const samples = arms.map(arm => {
      const alpha = arm.successes + 1;
      const beta = (arm.trials - arm.successes) + 1;
      const sample = this.betaDistribution(alpha, beta);
      
      return { armId: arm.id, sample };
    });

    const bestArm = samples.reduce((best, current) => 
      current.sample > best.sample ? current : best
    );

    return bestArm.armId;
  }

  updateTrafficWeights(arms: ExperimentArm[], minTrafficWeight: number = 5): BanditUpdate[] {
    if (arms.length === 0) return [];

    const samples = arms.map(arm => {
      const alpha = arm.successes + 1;
      const beta = (arm.trials - arm.successes) + 1;
      const meanSample = alpha / (alpha + beta);
      const variance = (alpha * beta) / ((alpha + beta) ** 2 * (alpha + beta + 1));
      const confidence = 1 / (1 + variance);
      
      return { 
        armId: arm.id, 
        meanSample, 
        confidence,
        isControl: arm.isControl
      };
    });

    const totalSamples = samples.reduce((sum, s) => sum + s.meanSample, 0);
    
    if (totalSamples === 0) {
      const equalWeight = 100 / arms.length;
      return arms.map(arm => ({
        armId: arm.id,
        newTrafficWeight: equalWeight,
        confidence: 0
      }));
    }

    let updates = samples.map(sample => ({
      armId: sample.armId,
      newTrafficWeight: Math.max(
        minTrafficWeight,
        (sample.meanSample / totalSamples) * 100
      ),
      confidence: sample.confidence
    }));

    const totalWeight = updates.reduce((sum, u) => sum + u.newTrafficWeight, 0);
    
    if (totalWeight !== 100) {
      const scaleFactor = 100 / totalWeight;
      updates = updates.map(update => ({
        ...update,
        newTrafficWeight: Math.max(
          minTrafficWeight,
          update.newTrafficWeight * scaleFactor
        )
      }));
    }

    const controlArm = updates.find((_, i) => samples[i].isControl);
    if (controlArm && controlArm.newTrafficWeight < minTrafficWeight) {
      controlArm.newTrafficWeight = minTrafficWeight;
      
      const remainingWeight = 100 - minTrafficWeight;
      const nonControlUpdates = updates.filter((_, i) => !samples[i].isControl);
      const nonControlTotalWeight = nonControlUpdates.reduce((sum, u) => sum + u.newTrafficWeight, 0);
      
      if (nonControlTotalWeight > 0) {
        const nonControlScaleFactor = remainingWeight / nonControlTotalWeight;
        nonControlUpdates.forEach(update => {
          update.newTrafficWeight = Math.max(
            minTrafficWeight,
            update.newTrafficWeight * nonControlScaleFactor
          );
        });
      }
    }

    return updates;
  }

  calculateMetrics(storeViews: number, purchases: number): BanditMetrics {
    return {
      storeViews,
      purchases,
      conversionRate: storeViews > 0 ? (purchases / storeViews) * 100 : 0
    };
  }

  shouldStopExperiment(arms: ExperimentArm[], minSampleSize: number = 100, confidenceThreshold: number = 0.95): boolean {
    const totalTrials = arms.reduce((sum, arm) => sum + arm.trials, 0);
    
    if (totalTrials < minSampleSize * arms.length) {
      return false;
    }

    const controlArm = arms.find(arm => arm.isControl);
    if (!controlArm) return false;

    const treatmentArms = arms.filter(arm => !arm.isControl);
    
    for (const treatmentArm of treatmentArms) {
      const controlRate = controlArm.successes / controlArm.trials;
      const treatmentRate = treatmentArm.successes / treatmentArm.trials;
      
      const pooledRate = (controlArm.successes + treatmentArm.successes) / (controlArm.trials + treatmentArm.trials);
      const standardError = Math.sqrt(pooledRate * (1 - pooledRate) * (1/controlArm.trials + 1/treatmentArm.trials));
      
      if (standardError > 0) {
        const zScore = Math.abs(controlRate - treatmentRate) / standardError;
        const pValue = 2 * (1 - this.normalCDF(Math.abs(zScore)));
        
        if (pValue < (1 - confidenceThreshold)) {
          return true;
        }
      }
    }

    return false;
  }

  private normalCDF(x: number): number {
    return (1 + this.erf(x / Math.sqrt(2))) / 2;
  }

  private erf(x: number): number {
    const a1 =  0.254829592;
    const a2 = -0.284496736;
    const a3 =  1.421413741;
    const a4 = -1.453152027;
    const a5 =  1.061405429;
    const p  =  0.3275911;

    const sign = x >= 0 ? 1 : -1;
    x = Math.abs(x);

    const t = 1.0 / (1.0 + p * x);
    const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);

    return sign * y;
  }
}