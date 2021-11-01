import { RequestHandler } from 'express';
import logger from '../../utils/logger';
import UserModel, { User } from '../../models/User';
import { transferToReceipient } from '../../utils/paystackHelper';
import successResponse from '../../middleware/response';
import AppError from '../../errors/AppError';
import constants from '../../utils/constants';

const { WITHDRAWAL } = constants.transactionTypes;

const withdrawFunds: RequestHandler = async (req, res, next) => {
  const amount = req.body.amount;

  if (!amount) {
    return next(new AppError('amount is required', 400));
  }

  const _amount = parseInt(amount);

  if (!_amount || isNaN(_amount)) {
    return next(new AppError('invalid value for amount', 400));
  }
  if (_amount <= 0) {
    return next(new AppError('amount must be greater than zero', 400));
  }

  try {
    const user: User | null = await UserModel.findById(req.user._id);

    if (_amount > user!.deposit) {
      return next(new AppError('Insufficient funds', 403));
    }

    if (!user!.recipientCode) {
      return next(new AppError('No recepient code found. Please update account details', 404));
    }
    await transferToReceipient(user!, _amount, WITHDRAWAL);
    return successResponse(res, 200, 'Money successfully transferred to your account', null);
  } catch (error) {
    logger.error('Error while withdrawing funds for user');
    next(error);
  }
};

export default withdrawFunds;
