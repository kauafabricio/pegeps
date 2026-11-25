import { z } from 'zod';

export const registerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'O nome deve ter pelo menos 2 caracteres.')
    .max(120, 'O nome deve ter no máximo 120 caracteres.'),
  email: z.string().trim().email('Informe um e-mail válido.').toLowerCase(),
  password: z
    .string()
    .min(8, 'A senha deve ter no mínimo 8 caracteres.')
    .regex(/[a-zA-Z]/, 'A senha deve conter letras.')
    .regex(/\d/, 'A senha deve conter números.'),
});

export const loginSchema = z.object({
  email: z.string().trim().email('Informe um e-mail válido.').toLowerCase(),
  password: z.string().min(1, 'Informe sua senha.'),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
