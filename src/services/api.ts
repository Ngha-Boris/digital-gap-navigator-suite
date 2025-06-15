
import { GapAnalysis, Dimension } from '../types';

// Mock data for initial load
const mockGapAnalysis: GapAnalysis = {
  dimensions: [
    {
      name: "Technology",
      currentState: 1,
      desiredState: 3,
      gap: "HIGH",
      customizedActions: [
        { action: "Ready to continue!", priority: "FOLLOW UP" }
      ]
    },
    {
      name: "Digital Culture",
      currentState: 1,
      desiredState: 2,
      gap: "HIGH",
      customizedActions: []
    },
    {
      name: "Skills",
      currentState: 3,
      desiredState: 4,
      gap: "HIGH",
      customizedActions: []
    }
  ]
};

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const gapAnalysisAPI = {
  async fetchGapAnalysis(): Promise<GapAnalysis> {
    await delay(500);
    const stored = localStorage.getItem('gapAnalysis');
    return stored ? JSON.parse(stored) : mockGapAnalysis;
  },

  async updateDimension(dimension: Dimension): Promise<void> {
    await delay(300);
    const gapAnalysis = await this.fetchGapAnalysis();
    const index = gapAnalysis.dimensions.findIndex(d => d.name === dimension.name);
    
    if (index !== -1) {
      gapAnalysis.dimensions[index] = dimension;
    } else {
      gapAnalysis.dimensions.push(dimension);
    }
    
    localStorage.setItem('gapAnalysis', JSON.stringify(gapAnalysis));
  },

  async fetchDimension(name: string): Promise<Dimension | null> {
    const gapAnalysis = await this.fetchGapAnalysis();
    return gapAnalysis.dimensions.find(d => d.name === name) || null;
  }
};
