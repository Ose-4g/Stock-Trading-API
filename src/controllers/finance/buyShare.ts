import { RequestHandler } from 'express';
import { getPrice } from '../../data/companies';
import AppError from '../../errors/AppError';
import UserModel from '../../models/User';
import logger from '../../utils/logger';
import constants from '../../utils/constants';
import TransactionModel from '../../models/Transaction';
import ShareModel, { Share } from '../../models/Share';
import successResponse from '../../middleware/response';
import sendMail from '../../utils/sendMail';

const { BUY } = constants.transactionTypes;
const { INITIATED, SUCCESS } = constants.transactionStatus;

const buyShare: RequestHandler = async (req, res, next) => {
  const { symbol, amount } = req.body;

  if (!symbol) {
    return next(new AppError('symbol is required', 400));
  }

  if (!amount) {
    return next(new AppError('amount is required', 400));
  }

  const _amount = parseFloat(amount);

  if (!_amount || isNaN(_amount)) {
    return next(new AppError('invalid value for amount', 400));
  }
  if (_amount <= 0) {
    return next(new AppError('amount must be greater than zero', 400));
  }

  try {
    const pricePerShare = getPrice(symbol);

    const quantity = _amount / pricePerShare;
    const user = await UserModel.findById(req.user._id);

    if (!user) {
      return next(new AppError('User not found', 404));
    }

    if (user.deposit < _amount) {
      return next(new AppError("You don't have enough money to make that transaction", 400));
    }

    const transaction = new TransactionModel({
      user: req.user._id,
      amount: _amount,
      type: BUY,
      shares: symbol,
      pricePerShare: pricePerShare,
      numberOfShares: quantity,
    });

    //check if the user has other shares with symbol
    let share: Share | null = await ShareModel.findOne({ user: req.user._id, symbol });
    if (!share) {
      //user has not bought ant of these shares before
      //create a new document.
      share = await ShareModel.create({
        user: req.user._id,
        symbol,
        quantity: quantity,
      });
    } else {
      //just update the exising document
      share.quantity += quantity;
      await share.save();
    }

    //update the user deposit account
    user.deposit -= _amount;
    await user.save();

    //update the transaction
    transaction.status = SUCCESS;
    await transaction.save();

    await sendMail({
      to: user.email,
      subject: 'Share Purchase Successful',
      html: `
      Hi ${user.firstName},<br><br>
      Your purchase of ${quantity} units of ${symbol} shares was successful`,
    });

    return successResponse(res, 201, 'Successfully bought shares', transaction);
  } catch (error) {
    logger.error('error occured in buying shares');
    next(error);
  }
};

export default buyShare;
