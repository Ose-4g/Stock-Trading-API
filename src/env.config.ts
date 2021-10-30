//holds all our environment variables.
//makes it easier to access them withtheir types.

interface Env {
  PORT: string;
  NODE_ENV: string;
  MONGO_URL: string;
  MONGO_URL_TEST: string;
  JWT_SECRET: string;
  JWT_EXPIRES: string;
  ACCESS_KEY_ID: string;
  SECRET_ACCESS_KEY: string;
  BUCKET_NAME: string;
}

export default {
  PORT: process.env.PORT,
  NODE_ENV: process.env.NODE_ENV,
  MONGO_URL: process.env.MONGO_URL,
  MONGO_URL_TEST: process.env.MONGO_URL_TEST,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES: process.env.JWT_EXPIRES,
  ACCESS_KEY_ID: process.env.ACCESS_KEY_ID,
  SECRET_ACCESS_KEY: process.env.SECRET_ACCESS_KEY,
  BUCKET_NAME: process.env.BUCKET_NAME,
} as Env;
