import { z } from 'zod';
import { LearningStyle } from '../domain/index.js';

export const tutorStepSchema = z.object({
  action: z.enum(['start', 'select_style', 'select_concept', 'change_style', 'change_concept']),
  learningStyle: z.nativeEnum(LearningStyle).optional(),
  conceptId: z.string().min(1).optional(),
});
