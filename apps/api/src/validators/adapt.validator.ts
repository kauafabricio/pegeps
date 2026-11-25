import { z } from 'zod';

export const adaptAiSchema = z.object({
  context: z
    .string()
    .trim()
    .min(20, 'Descreva sua realidade e objetivos com pelo menos 20 caracteres.')
    .max(800, 'O contexto deve ter no máximo 800 caracteres.'),
});
