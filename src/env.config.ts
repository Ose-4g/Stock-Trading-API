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
  CLIENT_ID: string;
  CLIENT_SECRET: string;
  NODEMAILER_REFRESH_TOKEN: string;
  REDIRECT_URI: string;
  EMAIL_FROM: string;
  JWT_COOKIE_EXPIRES_IN: string;
  CLIENT_URL: string;
  PAYSTACK_SECRET_KEY: string;
  PAYSTACK_PUBLIC_KEY: string;
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
  CLIENT_ID: process.env.CLIENT_ID,
  CLIENT_SECRET: process.env.CLIENT_SECRET,
  NODEMAILER_REFRESH_TOKEN: process.env.NODEMAILER_REFRESH_TOKEN,
  REDIRECT_URI: process.env.REDIRECT_URI,
  EMAIL_FROM: process.env.EMAIL_FROM,
  JWT_COOKIE_EXPIRES_IN: process.env.JWT_COOKIE_EXPIRES_IN,
  CLIENT_URL: process.env.CLIENT_URL,
  PAYSTACK_SECRET_KEY: process.env.PAYSTACK_SECRET_KEY,
  PAYSTACK_PUBLIC_KEY: process.env.PAYSTACK_PUBLIC_KEY,
} as Env;
