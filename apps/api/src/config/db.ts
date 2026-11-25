import mongoose from 'mongoose';
import { env } from './env.js';

let listenersRegistered = false;

function registerConnectionListeners(): void {
  if (listenersRegistered) {
    return;
  }
  listenersRegistered = true;

  mongoose.connection.on('disconnected', () => {
    console.warn('MongoDB desconectado. Aguardando reconexão automática...');
  });

  mongoose.connection.on('reconnected', () => {
    console.info('MongoDB reconectado com sucesso.');
  });

  mongoose.connection.on('error', (err) => {
    console.error('Erro na conexão com MongoDB:', err);
  });
}

export async function connectDatabase(retries = 3, delayMs = 2000): Promise<void> {
  mongoose.set('strictQuery', true);
  registerConnectionListeners();

  let lastError: unknown;
  for (let attempt = 1; attempt <= retries; attempt += 1) {
    try {
      await mongoose.connect(env.MONGODB_URI, {
        serverSelectionTimeoutMS: 5000,
      });
      return;
    } catch (err) {
      lastError = err;
      if (attempt < retries) {
        console.warn(
          `Tentativa ${attempt}/${retries} de conexão ao MongoDB falhou. Tentando novamente em ${delayMs}ms...`,
        );
        await new Promise((resolve) => setTimeout(resolve, delayMs));
      }
    }
  }

  throw lastError;
}

export async function disconnectDatabase(): Promise<void> {
  await mongoose.disconnect();
}
