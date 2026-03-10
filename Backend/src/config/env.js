import dotenv from 'dotenv';

dotenv.config();

const readRequired = key => {
  const value = process.env[key];

  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }

  return value;
};

export const readDatabaseEnv = () => ({
  mongoUri: readRequired('MONGO_URI'),
});

export const readServerEnv = () => ({
  port: Number(readRequired('PORT')),
  mongoUri: readRequired('MONGO_URI'),
  clientOrigin: readRequired('CLIENT_ORIGIN'),
  jwtSecret: readRequired('JWT_SECRET'),
});
