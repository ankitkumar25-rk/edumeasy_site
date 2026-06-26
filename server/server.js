import dotenv from 'dotenv';
dotenv.config();

import app from './app.js';
import prisma from './config/db.js';
import valkey from './config/valkey.js';
import logger from './utils/logger.js';

const requiredEnvVars = ['PORT', 'DATABASE_URL', 'VALKEY_URL', 'CLIENT_URL', 'NODE_ENV'];
const missingVars = requiredEnvVars.filter((v) => !process.env[v]);

if (missingVars.length > 0) {
  logger.fatal(`Startup failed: missing environment variables: ${missingVars.join(', ')}`);
  process.exit(1);
}

const PORT = parseInt(process.env.PORT || '5000', 10);

const bootstrap = async () => {
  try {
    logger.info('Verifying database connection...');
    await prisma.$connect();
    logger.info('Database connection verified successfully.');

    logger.info('Verifying Valkey connection...');
    const valkeyPing = await valkey.ping();
    logger.info(`Valkey connection verified: ${valkeyPing}`);

    const server = app.listen(PORT, () => {
      logger.info(`Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`);
    });

    const handleShutdown = async (signal) => {
      logger.info(`${signal} received. Initiating graceful shutdown...`);
      server.close(async () => {
        logger.info('Express server closed.');
        try {
          await prisma.$disconnect();
          logger.info('Prisma connection disconnected.');
          await valkey.quit();
          logger.info('Valkey connection closed.');
          logger.info('Shutdown complete. Exiting.');
          process.exit(0);
        } catch (err) {
          logger.error({ err }, 'Error during database disconnection during shutdown');
          process.exit(1);
        }
      });
    };

    process.on('SIGTERM', () => handleShutdown('SIGTERM'));
    process.on('SIGINT', () => handleShutdown('SIGINT'));
  } catch (error) {
    logger.fatal({ err: error }, 'Critical startup error. Halting application...');
    process.exit(1);
  }
};

bootstrap();

