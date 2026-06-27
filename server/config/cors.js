import cors from 'cors';
import logger from '../utils/logger.js';

const clientUrl = process.env.CLIENT_URL;
if (!clientUrl) {
  logger.fatal('CLIENT_URL is missing from environment variables');
  throw new Error('CLIENT_URL is missing from environment variables');
}

const corsOptions = {
  origin: clientUrl,
  credentials: true,
};

export default cors(corsOptions);
