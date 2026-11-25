import { z } from 'zod';
import { LearningStyle, StartupStage } from '../domain/index.js';

export const updateProfileSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'O nome deve ter pelo menos 2 caracteres.')
    .max(120, 'O nome deve ter no máximo 120 caracteres.')
    .optional(),
  email: z.string().trim().email('Informe um e-mail válido.').toLowerCase().optional(),
  jobTitle: z.string().trim().max(120, 'Cargo deve ter no máximo 120 caracteres.').optional(),
  startupStage: z.nativeEnum(StartupStage).optional(),
  learningStyle: z.nativeEnum(LearningStyle).optional(),
});
