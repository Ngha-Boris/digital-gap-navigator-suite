
export interface DimensionState {
  level: number;
  name: string;
  description: string;
}

export interface DimensionStates {
  [dimensionName: string]: DimensionState[];
}

export interface Action {
  action: string;
  priority: 'URGENT' | 'IMPORTANT' | 'FOLLOW UP';
}

export interface Recommendation {
  actions: string[];
  priority: 'URGENT' | 'IMPORTANT' | 'FOLLOW UP';
}

export interface Recommendations {
  [dimensionName: string]: {
    HIGH: Recommendation;
    MEDIUM: Recommendation;
    LOW: Recommendation;
  };
}

export interface Dimension {
  name: string;
  currentState: number;
  desiredState: number;
  gap: 'HIGH' | 'MEDIUM' | 'LOW';
  customizedActions: Action[];
}

export interface GapAnalysis {
  dimensions: Dimension[];
}

export type GapLevel = 'HIGH' | 'MEDIUM' | 'LOW';
