import * as dotenv from 'dotenv';
dotenv.config();

export const { PORT } = process.env;

export const { SECRET } = process.env;

export const MONGODB_URI = process.env.NODE_ENV === 'development'
  ? process.env.TEST_MONGODB_URI
  : process.env.MONGODB_URI;

