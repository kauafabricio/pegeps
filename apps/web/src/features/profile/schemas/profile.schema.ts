import { z } from 'zod';

export const profileSchema = z.object({
  name: z.string().trim().min(2, 'Mínimo 2 caracteres.').max(120).optional().or(z.literal('')),
  email: z.string().trim().email('E-mail inválido.').toLowerCase().optional().or(z.literal('')),
  jobTitle: z.string().trim().max(120).optional().or(z.literal('')),
  startupStage: z.string().optional(),
  learningStyle: z.string().optional(),
});

export type ProfileInput = z.infer<typeof profileSchema>;
