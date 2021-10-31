import { RequestHandler } from 'express';
import AppError from '../../errors/AppError';
import UserModel from '../../models/User';
import logger from '../../utils/logger';
import { initializeTransaction } from '../../utils/paystackHelper';
import successResponse from '../../middleware/response';
import constants from '../../utils/constants';

const { DEPOSIT } = constants.transactionTypes;

const deposit: RequestHandler = async (req, res, next) => {
  const { amount } = req.body;

  if (!amount) {
    return next(new AppError('amount is required', 400));
  }
  const _amount = parseInt(amount);

  if (!_amount || isNaN(_amount)) {
    return next(new AppError('invalid value for amount', 400));
  }
  if (_amount <= 0) {
    return next(new AppError('Amount must be greater than zero', 400));
  }

  try {
    const user = await UserModel.findById(req.user._id);

    if (!user) {
      return next(new AppError('User not found', 404));
    }
    const transaction = await initializeTransaction(user, _amount, DEPOSIT);

    return successResponse(res, 200, 'Payment initalized successfully. Check email to complete payment', transaction);
  } catch (error) {
    logger.error('error occured while doing a deposit');
    next(error);
  }
};

export default deposit;
