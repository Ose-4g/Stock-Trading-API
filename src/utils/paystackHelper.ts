import axios from 'axios';
import crypto from 'crypto';
import TransactionModel from '../models/Transaction';
import env from '../env.config';
import { User } from '../models/User';
import logger from './logger';
import sendMail from './sendMail';

const { PAYSTACK_SECRET_KEY } = env;

// function to generate reference to be used in the various transactions
const generateReference = (): string => {
  const token = crypto.randomBytes(16).toString('hex');
  return token;
};

// function to initialize transaction ans send authorization irl to user's email
const initializeTransaction = async (user: User, amount: number, type: string, loanPaymentId: string | null = null) => {
  const reference = generateReference();

  try {
    //initialize the payment on paystack
    const { data } = await axios.post(
      'https://api.paystack.co/transaction/initialize',
      {
        email: user.email,
        amount: amount * 100,
        reference,
      },
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );
    const { authorization_url } = data.data;
    //create a new transaction
    const transaction = new TransactionModel({
      user: user._id,
      reference,
      amount,
      type,
      authorization_url,
    });

    if (loanPaymentId) transaction.loanPayment = loanPaymentId;

    await transaction.save();

    await sendMail({
      to: user.email,
      subject: 'Complete your payment',
      html: `
      Hi ${user.firstName},<br><br>
      Please use the link below to complete you payment<br><br>
      ${authorization_url}
      `,
    });

    return transaction;
  } catch (error: any) {
    logger.error('Error occured while initializing transaction');
    if (error.response && error.response.data) logger.error(error.response.data);
    else logger.error(error);
  }
};

// create a new receipient to send transfer to.
const generateReceipient = async (accountNumber: string, bankCode: string, user: User): Promise<void> => {
  try {
    //Create the receipient on paystack
    const { data } = await axios.post(
      'https://api.paystack.co/transferrecipient',
      {
        type: 'nuban',
        name: `${user.firstName} ${user.lastName}`,
        account_number: accountNumber,
        bank_code: bankCode,
      },
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );
    const { recipient_code } = data.data;

    user.recipientCode = recipient_code;
    (user.accountNumber = accountNumber), (user.bankCode = bankCode);
    await user.save();
  } catch (error: any) {
    logger.error('Error occured while creating transfer receipient');
    if (error.response && error.response.data) {
      logger.error(error.response.data);
      throw Error(error.response.data);
    } else {
      logger.error(error);
      throw Error(error);
    }
  }
};

// make transfer to the receipient
const transferToReceipient = async (user: User, amount: number, type: string) => {
  try {
    //generate reference
    const reference = generateReference();

    //create the transaction first

    await TransactionModel.create({
      user: user._id,
      amount,
      reference,
      type,
    });

    //initialize the transfer on paystack
    const { data } = await axios.post(
      'https://api.paystack.co/transfer',
      {
        source: 'balance',
        amount: amount * 100,
        recipient: user.recipientCode,
        reference,
      },
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );
    const { transfer_code } = data.data;
  } catch (error: any) {
    logger.error('Error occured while creating transfer receipient');
    if (error.response && error.response.data) {
      logger.error(error.response.data);
      throw Error(error.response.data);
    } else {
      logger.error(error);
      throw Error(error);
    }
  }
};

export { initializeTransaction, generateReceipient, transferToReceipient };
