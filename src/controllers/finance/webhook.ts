import { RequestHandler } from 'express';
import crypto from 'crypto';
import TransactionModel, { Transaction } from '../../models/Transaction';
import env from '../../env.config';
import UserModel, { User } from '../../models/User';
import logger from '../../utils/logger';
import constants from '../../utils/constants';

const { SUCCESS } = constants.transactionStatus;
const { DEPOSIT, WITHDRAWAL } = constants.transactionTypes;
const { PAYSTACK_SECRET_KEY } = env;
const CHARGE_SUCCESS = 'charge.success';

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

    logger.info("updating the user'rs account accordingly");
    if (type == DEPOSIT) {
      user.deposit += amount;
    } else if (type == WITHDRAWAL) {
      user.deposit -= amount;
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
