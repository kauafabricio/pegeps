import fs from 'node:fs';
import path from 'node:path';
import { z } from 'zod';

function loadLocalEnvFile(): void {
  const envPath = path.resolve(process.cwd(), '.env');
  if (!fs.existsSync(envPath)) {
    return;
  }

  if (typeof process.loadEnvFile === 'function') {
    process.loadEnvFile(envPath);
  }
}

loadLocalEnvFile();

const envSchema = z.object({
  PORT: z.coerce.number().int().positive().default(3001),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  MONGODB_URI: z.string().min(1, 'MONGODB_URI é obrigatória'),
  JWT_SECRET: z.string().min(32, 'JWT_SECRET deve ter no mínimo 32 caracteres'),
  CLIENT_ORIGIN: z.string().url('CLIENT_ORIGIN deve ser uma URL válida'),
  GEMINI_API_KEY: z.string().default(''),
  GEMINI_MODEL: z.string().min(1).default('gemini-2.0-flash'),
  GEMINI_TIMEOUT_MS: z.coerce.number().int().positive().default(30_000),
  SMTP_HOST: z.string().optional().default(''),
  SMTP_PORT: z.coerce.number().int().positive().optional().default(587),
  SMTP_USER: z.string().optional().default(''),
  SMTP_PASS: z.string().optional().default(''),
  MAIL_FROM: z.string().min(1).default('Pegeps <noreply@pegeps.com.br>'),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('Erro nas variáveis de ambiente:', parsed.error.flatten().fieldErrors);
  throw new Error('Configuração de ambiente inválida. Verifique o arquivo .env.');
}

export const env = parsed.data;
export type Env = typeof env;
