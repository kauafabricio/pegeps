import type { LearningStyle, MaterialType, ModuleStatus, StartupStage } from './enums.js';

export interface Concept {
  id: string;
  name: string;
}

export interface CatalogModule {
  slug: string;
  title: string;
  description: string;
  order: number;
  concepts: Concept[];
}

export interface MaterialItem {
  type: MaterialType;
  title: string;
  url: string;
  author?: string;
  learningStyles: LearningStyle[];
}

export interface ModuleWithStatus {
  moduleId: string;
  slug: string;
  title: string;
  description: string;
  order: number;
  status: ModuleStatus;
  concepts: Concept[];
}

export interface UserProfile {
  jobTitle?: string;
  startupStage?: StartupStage;
  learningStyle?: LearningStyle;
  avatarUrl?: string;
}

export interface DiagnosticQuestion {
  id: string;
  statement: string;
  conceptId: string;
  options: Array<{ id: string; text: string }>;
  correctOptionId: string;
}

export interface DiagnosticAnswer {
  questionId: string;
  selectedOptionId: string;
}
