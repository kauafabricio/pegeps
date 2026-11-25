import { z } from 'zod';

export const submitDiagnosticSchema = z.object({
  answers: z
    .array(
      z
        .object({
          questionId: z.string().min(1),
          selectedOptionId: z.string().min(1).optional(),
          optionId: z.string().min(1).optional(),
        })
        .refine((v) => Boolean(v.selectedOptionId || v.optionId), {
          message: 'Informe selectedOptionId ou optionId.',
        })
        .transform((v) => ({
          questionId: v.questionId,
          selectedOptionId: (v.selectedOptionId ?? v.optionId)!,
        })),
    )
    .length(3, 'O diagnóstico exige exatamente 3 respostas.'),
});

export const chooseTrailSchema = z.object({
  choice: z.enum(['recommended', 'default']),
});

export const chooseTrailByIdSchema = z.object({
  trailId: z.string().regex(/^[a-f\d]{24}$/i, 'Identificador de trilha inválido.'),
});
