import { z } from 'zod';

export const adaptSchema = z.object({
  context: z
    .string()
    .min(20, 'Descreva com ao menos 20 caracteres')
    .max(800, 'Máximo de 800 caracteres'),
});

export type AdaptInput = z.infer<typeof adaptSchema>;
