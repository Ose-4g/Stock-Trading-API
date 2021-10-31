import axios from 'axios';
import crypto from 'crypto';
import TransactionModel, { Transaction } from '../models/Transaction';
import env from '../env.config';
import { User } from '../models/User';
import logger from './logger';

const { PAYSTACK_SECRET_KEY } = env;

const generateReference = (): string => {
  const token = crypto.randomBytes(16).toString('hex');
  return token;
};

const initializeTransaction = async (user: User, amount: number, type: string): Promise<Transaction> => {
  const reference = generateReference();

  try {
    //initialize the payment on paystack
    const { data } = await axios.post(
      'https://api.paystack.co/transaction/initialize',
      {
        email: user.email,
        amount: 20000,
        reference,
      },
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );
    const { authorization_url } = data;
    //create a new transaction
    const transaction = await TransactionModel.create({
      user: user._id,
      reference,
      amount,
      type,
    });
    return transaction;
  } catch (error: any) {
    logger.error('Error occured while initializing transaction');
    if (error.response && error.response.data) logger.error(error.response.data);
    else logger.error(error);
  }
};

export { initializeTransaction };
