import '../config/env.js';
import crypto from 'crypto';
import valkey from '../config/valkey.js';

const hashToken = (token) => {
  return crypto.createHash('sha256').update(token).digest('hex');
};

export const storeRefreshToken = async (userId, token, ttlInSeconds = 604800) => {
  const hash = hashToken(token);
  const key = `refresh_token:${hash}`;
  await valkey.set(key, userId, 'EX', ttlInSeconds);
};

export const validateRefreshToken = async (token) => {
  const hash = hashToken(token);
  const key = `refresh_token:${hash}`;
  const userId = await valkey.get(key);
  return userId || null;
};

export const deleteRefreshToken = async (token) => {
  const hash = hashToken(token);
  const key = `refresh_token:${hash}`;
  await valkey.del(key);
};

export const rotateRefreshToken = async (oldToken, newToken, userId, ttlInSeconds = 604800) => {
  const oldHash = hashToken(oldToken);
  const newHash = hashToken(newToken);
  
  const oldKey = `refresh_token:${oldHash}`;
  const newKey = `refresh_token:${newHash}`;
  
  const pipeline = valkey.pipeline();
  pipeline.del(oldKey);
  pipeline.set(newKey, userId, 'EX', ttlInSeconds);
  await pipeline.exec();
};
