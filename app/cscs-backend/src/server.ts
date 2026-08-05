import { app } from './app';
import { env } from './config/env';
import { checkDbConnection, pool } from './db/database';

async function start() {
  try {
    await checkDbConnection();
    console.log('Connected to AITS MySQL database.');
  } catch (err) {
    console.error('Could not connect to the database. Check .env and AITS availability.');
    console.error(err);
    process.exit(1);
  }

  const server = app.listen(env.PORT, () => {
    console.log(`API listening on http://localhost:${env.PORT}`);
  });

  const shutdown = (signal: string) => {
    console.log(`${signal} received, shutting down...`);
    server.close(async () => {
      await pool.end();
      process.exit(0);
    });
  };

  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));
}

start();
