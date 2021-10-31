import mongoose from 'mongoose';
import env from '../env.config';
import logger from './logger';
import constants from '../utils/constants';

const { TEST } = constants.environments;
const { MONGO_URL, MONGO_URL_TEST } = env;

export default async (): Promise<void> => {
  try {
    const url = process.env.NODE_ENV === TEST ? MONGO_URL_TEST : MONGO_URL;
    await mongoose.connect(url, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
    });
    logger.info('DB connected successfully');
  } catch (err) {
    console.log(err);
    logger.error('DB connection not successful');
  }
};
