import { RequestHandler } from 'express';
import { getPrice } from '../../data/companies';
import AppError from '../../errors/AppError';
import UserModel from '../../models/User';
import logger from '../../utils/logger';
import constants from '../../utils/constants';
import TransactionModel from '../../models/Transaction';
import ShareModel, { Share } from '../../models/Share';
import successResponse from '../../middleware/response';

const { BUY } = constants.transactionTypes;
const { INITIATED, SUCCESS } = constants.transactionStatus;

const buyShare: RequestHandler = async (req, res, next) => {
  const { symbol, quantity } = req.body;

  if (!symbol) {
    return next(new AppError('symbol is required', 400));
  }

  if (!quantity) {
    return next(new AppError('quantity is required', 400));
  }

  const _quantity = parseInt(quantity);

  if (!_quantity || isNaN(_quantity)) {
    return next(new AppError('invalid value for amount', 400));
  }
  if (_quantity <= 0) {
    return next(new AppError('quantity must be greater than zero', 400));
  }

  const pricePerShare = getPrice(symbol);

  const totalCost = pricePerShare * _quantity;

  try {
    const user = await UserModel.findById(req.user._id);

    if (!user) {
      return next(new AppError('User not found', 404));
    }

    if (user.deposit < totalCost) {
      return next(new AppError("You don't have enough money to make that transaction", 400));
    }

    const transaction = new TransactionModel({
      user: req.user._id,
      amount: totalCost,
      type: BUY,
      shares: symbol,
      pricePerShare: pricePerShare,
      numberOfShares: _quantity,
    });

    //check if the user has other shares with symbol
    let share: Share | null = await ShareModel.findOne({ user: req.user._id, symbol });
    if (!share) {
      //user has not bought ant of these shares before
      //create a new document.
      share = await ShareModel.create({
        user: req.user._id,
        symbol,
        quantity: _quantity,
      });
    } else {
      //just update the exising document
      share.quantity += _quantity;
      await share.save();
    }

    //update the user deposit account
    user.deposit -= totalCost;
    await user.save();

    //update the transaction
    transaction.status = SUCCESS;
    await transaction.save();

    return successResponse(res, 201, 'Successfully bought shares', transaction);
  } catch (error) {
    logger.error('error occured in buying shares');
    next(error);
  }
};
