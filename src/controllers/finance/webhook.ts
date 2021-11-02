import { RequestHandler } from 'express';
import crypto from 'crypto';
import TransactionModel from '../../models/Transaction';
import env from '../../env.config';
import UserModel from '../../models/User';
import logger from '../../utils/logger';
import constants from '../../utils/constants';
import LoanPaymentModel from '../../models/LoanPayment';
import LoanModel from '../../models/Loan';
import sendMail from '../../utils/sendMail';

const { SUCCESS } = constants.transactionStatus;
const { DEPOSIT, WITHDRAWAL, PAYBACK } = constants.transactionTypes;
const { PAYSTACK_SECRET_KEY } = env;
const CHARGE_SUCCESS = 'charge.success';
const TRANSFER_SUCCESS = 'transfer.success';

const handleEvent = async (event: string, body: any) => {
  if (event == CHARGE_SUCCESS) {
    const { data } = body;
    const { reference, amount } = data;

    logger.info('finding the transaction');
    const transaction = await TransactionModel.findOne({ reference });

    if (!transaction) {
      logger.error(`Transaction with reference ${reference} not found`);
      return;
    }

    transaction!.status = SUCCESS;
    transaction!.authorization_url = null;
    const type = transaction?.type;

    logger.info('finding the user who made the transaction');
    const user = await UserModel.findById(transaction!.user);

    if (!user) {
      logger.error(`User ${transaction!.user} not found`);
      return;
    }

    logger.info("updating the user's account accordingly");
    if (type == DEPOSIT) {
      user.deposit += amount / 100;

      await sendMail({
        to: user.email,
        subject: 'Deposit Successful',
        html: `
        Hi, ${user.firstName},<br><br>
        Your deposit of ${transaction.amount} into your TroveTest account was successful`,
      });
    } else if (type == PAYBACK) {
      logger.info('user paying back loan');
      logger.info('updating the loan payment');
      //update the loan payment
      const loanPayment = await LoanPaymentModel.findById(transaction!.loanPayment);
      loanPayment!.paid = true;
      await loanPayment!.save();

      logger.info('updating the loan');
      //update the loan
      const loan = await LoanModel.findById(loanPayment!.loan);
      loan!.amountPaid += loanPayment!.amount;
      loan!.paid = Math.ceil(loan!.amountPaid) == Math.ceil(loan!.amount);
      await loan!.save();

      logger.info('updating the user object');
      //update the user object
      user.loan -= loanPayment!.amount;
      await user.save();

      await sendMail({
        to: user.email,
        subject: 'Loan payment Successful',
        html: `
        Hi, ${user.firstName},<br><br>
        Your loan payment of ${transaction.amount}  was successful`,
      });
    }

    await user.save();
    await transaction.save();
  } else if (event == TRANSFER_SUCCESS) {
    const { data } = body;
    const { reference, amount } = data;

    logger.info('finding the transaction');
    const transaction = await TransactionModel.findOne({ reference });

    if (!transaction) {
      logger.error(`Transaction with reference ${reference} not found`);
      return;
    }

    transaction!.status = SUCCESS;
    const type = transaction?.type;

    logger.info('finding the user who made the transaction');
    const user = await UserModel.findById(transaction!.user);

    if (!user) {
      logger.error(`User ${transaction!.user} not found`);
      return;
    }

    if (type == WITHDRAWAL) {
      user.deposit -= amount / 100;

      await sendMail({
        to: user.email,
        subject: 'Withdrawal Successful',
        html: `
        Hi, ${user.firstName},<br><br>
        Your withdrawal of ${transaction.amount} from your TroveTest account was successful and was made to your account. `,
      });
    }

    await user.save();
    await transaction.save();
  }
};
const webhook: RequestHandler = async (req, res, next) => {
  const hash = crypto.createHmac('sha512', PAYSTACK_SECRET_KEY).update(JSON.stringify(req.body)).digest('hex');

  if (hash == req.headers['x-paystack-signature']) {
    const { event } = req.body;
    handleEvent(event, req.body);
  }

  res.status(200).json({ message: 'successfully reached webhook' });
};

export default webhook;
