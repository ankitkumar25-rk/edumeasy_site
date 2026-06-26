import './env.js';
import Redis from 'iovalkey';
import logger from '../utils/logger.js';

const valkeyUrl = process.env.VALKEY_URL;

if (!valkeyUrl) {
  logger.fatal('VALKEY_URL is missing from environment variables');
  throw new Error('VALKEY_URL is missing from environment variables');
}

const valkey = new Redis(valkeyUrl, {
  maxRetriesPerRequest: null,
  retryStrategy(times) {
    if (times > 3) {
      logger.fatal('Valkey connection retries exceeded');
      return null;
    }
    const delay = Math.min(times * 100, 2000);
    return delay;
  },
});

valkey.on('error', (err) => {
  logger.error({ err }, 'Valkey connection error');
});

export default valkey;

