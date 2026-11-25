import { GoogleGenAI } from '@google/genai';
import { env } from './env.js';
import { BadGatewayError } from '../errors/AppError.js';
import { parseJsonFromModelOutput } from '../utils/json.js';

let cachedClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI {
  if (!env.GEMINI_API_KEY || env.GEMINI_API_KEY.includes('SUBSTITUA')) {
    throw new BadGatewayError(
      'Serviço de IA não configurado no momento. Você ainda pode solicitar ajuda de um especialista.',
    );
  }
  if (!cachedClient) {
    cachedClient = new GoogleGenAI({ apiKey: env.GEMINI_API_KEY });
  }
  return cachedClient;
}

async function callWithTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
  let timer: NodeJS.Timeout | undefined;
  const timeoutPromise = new Promise<never>((_resolve, reject) => {
    timer = setTimeout(() => {
      reject(new Error(`Gemini timeout após ${timeoutMs}ms`));
    }, timeoutMs);
  });

  try {
    return await Promise.race([promise, timeoutPromise]);
  } finally {
    if (timer) {
      clearTimeout(timer);
    }
  }
}

/**
 * Executa uma chamada JSON ao Gemini com 1 tentativa extra (retry) e timeout configurável.
 */
export async function generateGeminiJson<T>(
  prompt: string,
  validate: (data: unknown) => T,
): Promise<T> {
  const client = getGeminiClient();
  const maxAttempts = 2;
  let lastError: unknown;

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      const response = await callWithTimeout(
        client.models.generateContent({
          model: env.GEMINI_MODEL,
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
          },
        }),
        env.GEMINI_TIMEOUT_MS,
      );

      const text = response.text;
      if (!text) {
        throw new Error('Resposta vazia do Gemini.');
      }

      const parsedJson = parseJsonFromModelOutput(text);
      return validate(parsedJson);
    } catch (err) {
      lastError = err;
    }
  }

  console.error('Falha na integração com Gemini:', lastError);
  throw new BadGatewayError(
    'Não conseguimos adaptar sua trilha com IA agora. Sua trilha atual foi mantida intacta. Tente novamente em instantes.',
  );
}
