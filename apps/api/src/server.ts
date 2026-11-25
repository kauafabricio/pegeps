import { createApp } from './app.js';
import { connectDatabase, disconnectDatabase } from './config/db.js';
import { env } from './config/env.js';

async function bootstrap(): Promise<void> {
  await connectDatabase();
  console.info('Conectado ao MongoDB.');

  const app = createApp();
  const server = app.listen(env.PORT, () => {
    console.info(`API Pegeps rodando na porta ${env.PORT} (${env.NODE_ENV})`);
  });

  const shutdown = async (): Promise<void> => {
    console.info('Encerrando servidor...');
    server.close(async () => {
      await disconnectDatabase();
      process.exit(0);
    });
  };

  process.on('SIGINT', () => {
    void shutdown();
  });
  process.on('SIGTERM', () => {
    void shutdown();
  });
}

bootstrap().catch((err) => {
  console.error('Falha ao iniciar servidor:', err);
  process.exit(1);
});
