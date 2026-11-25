import { http } from '@/lib/http';
import type { ModuleWithStatus } from '@pegeps/domain';

export interface TrailData {
  trail: {
    id: string;
    slug: string;
    title: string;
    description: string;
    kind: string;
    firstStep?: string;
  };
  progress: {
    completedCount: number;
    totalModules: number;
    percentage: number;
    totalConcepts: number;
  };
  modules: ModuleWithStatus[];
}

export const trailService = {
  getActiveTrail: () => http.get<TrailData>('/trails/active'),
};
