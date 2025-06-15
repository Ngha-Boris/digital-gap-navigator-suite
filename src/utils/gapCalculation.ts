
import { GapLevel } from '../types';

export function calculateGap(currentState: number, desiredState: number): GapLevel {
  const difference = desiredState - currentState;
  
  if (difference > 2) {
    return 'HIGH';
  } else if (difference > 1) {
    return 'MEDIUM';
  } else {
    return 'LOW';
  }
}

export function getGapColor(gap: GapLevel): string {
  switch (gap) {
    case 'HIGH':
      return 'bg-red-100 text-red-800';
    case 'MEDIUM':
      return 'bg-yellow-100 text-yellow-800';
    case 'LOW':
      return 'bg-green-100 text-green-800';
  }
}
