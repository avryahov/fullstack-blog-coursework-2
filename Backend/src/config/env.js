import dotenv from 'dotenv';

dotenv.config();

const requiredEnv = ['PORT', 'MONGO_URI', 'CLIENT_ORIGIN', 'JWT_SECRET'];

for (const key of requiredEnv) {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
}

export const env = {
  port: Number(process.env.PORT),
  mongoUri: process.env.MONGO_URI,
  clientOrigin: process.env.CLIENT_ORIGIN,
  jwtSecret: process.env.JWT_SECRET,
};
