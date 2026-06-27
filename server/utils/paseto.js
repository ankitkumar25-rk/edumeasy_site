import '../config/env.js';
import { V4 } from 'paseto';
import { createSecretKey } from 'crypto';

const localKeyRaw = process.env.PASETO_LOCAL_KEY;
const refreshKeyRaw = process.env.PASETO_REFRESH_KEY;

if (!localKeyRaw || !refreshKeyRaw) {
  throw new Error('PASETO keys are missing from environment variables');
}

const localBuffer = Buffer.from(localKeyRaw, 'hex');
const refreshBuffer = Buffer.from(refreshKeyRaw, 'hex');

if (localBuffer.length !== 32 || refreshBuffer.length !== 32) {
  throw new Error('PASETO keys must be exactly 32 bytes (64 hex characters)');
}

const localKey = createSecretKey(localBuffer);
const refreshKey = createSecretKey(refreshBuffer);

export const issueAccessToken = async (user) => {
  const payload = {
    id: user.id,
    email: user.email,
    role: user.role,
  };
  return V4.encrypt(payload, localKey, { expiresIn: '15m' });
};

export const issueRefreshToken = async (user) => {
  const payload = {
    id: user.id,
  };
  return V4.encrypt(payload, refreshKey, { expiresIn: '7d' });
};

export const verifyAccessToken = async (token) => {
  return V4.decrypt(token, localKey);
};

export const verifyRefreshToken = async (token) => {
  return V4.decrypt(token, refreshKey);
};
