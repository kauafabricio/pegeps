import { z } from 'zod';
import { ASSESSMENT_QUESTIONS_COUNT } from '../domain/index.js';

export const moduleIdParamsSchema = z.object({
  moduleId: z.string().regex(/^[a-f\d]{24}$/i, 'Identificador de módulo inválido.'),
});

export const submitAssessmentSchema = z.object({
  variantId: z.string().min(1, 'Variante obrigatória.'),
  answers: z
    .array(
      z.object({
        questionId: z.string().min(1),
        selectedOptionId: z.string().min(1),
      }),
    )
    .length(
      ASSESSMENT_QUESTIONS_COUNT,
      `A avaliação exige exatamente ${ASSESSMENT_QUESTIONS_COUNT} respostas.`,
    ),
});
