//holds all our environment variables.
//makes it easier to access them withtheir types.

interface Env {
  PORT: string;
  NODE_ENV: string;
  MONGO_URL: string;
  MONGO_URL_TEST: string;
  JWT_SECRET: string;
  JWT_EXPIRES: string;
  NODEMAILER_USER: string;
  NODEMAILER_PASSWORD: string;
  EMAIL_FROM: string;
}

export default {
  PORT: process.env.PORT,
  NODE_ENV: process.env.NODE_ENV,
  MONGO_URL: process.env.MONGO_URL,
  MONGO_URL_TEST: process.env.MONGO_URL_TEST,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES: process.env.JWT_EXPIRES,
  NODEMAILER_USER: process.env.NODEMAILER_USER,
  NODEMAILER_PASSWORD: process.env.NODEMAILER_PASSWORD,
  EMAIL_FROM: process.env.EMAIL_FROM,
} as Env;
