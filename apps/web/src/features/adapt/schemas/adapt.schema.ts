import { z } from 'zod';

export const adaptSchema = z.object({
  context: z
    .string()
    .min(20, 'Descreva com pelo menos 20 caracteres.')
    .max(800, 'Máximo 800 caracteres.'),
});

export type AdaptInput = z.infer<typeof adaptSchema>;
