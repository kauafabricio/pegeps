import { z } from 'zod';

export const submitDiagnosticSchema = z.object({
  answers: z
    .array(
      z.object({
        questionId: z.string().min(1),
        selectedOptionId: z.string().min(1),
      }),
    )
    .length(3, 'O diagnóstico exige exatamente 3 respostas.'),
});

export const chooseTrailSchema = z.object({
  choice: z.enum(['recommended', 'default']),
});
