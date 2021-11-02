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

const { SELL } = constants.transactionTypes;
const { INITIATED, SUCCESS } = constants.transactionStatus;

const sellShare: RequestHandler = async (req, res, next) => {
  const { symbol, quantity } = req.body;

  if (!symbol) {
    return next(new AppError('symbol is required', 400));
  }

  if (!quantity) {
    return next(new AppError('quantity is required', 400));
  }

  const _quantity = parseFloat(quantity);

  if (!_quantity || isNaN(_quantity)) {
    return next(new AppError('invalid value for quantity', 400));
  }
  if (_quantity <= 0) {
    return next(new AppError('quantity must be greater than zero', 400));
  }

  try {
    //check if user has enough units of the share
    const share = await ShareModel.findOne({ user: req.user._id, symbol });
    if (quantity > share!.quantity) {
      return next(new AppError(`You don not have enough units of ${symbol} to sell`, 400));
    }

    const pricePerShare = getPrice(symbol);
    const amount = _quantity * pricePerShare;

    const user = await UserModel.findById(req.user._id);

    if (!user) {
      return next(new AppError('User not found', 404));
    }

    const transaction = new TransactionModel({
      user: req.user._id,
      amount,
      type: SELL,
      shares: symbol,
      pricePerShare: pricePerShare,
      numberOfShares: quantity,
    });

    //update the share accordingly
    share!.quantity -= quantity;
    await share!.save();

    //update the user deposit account
    user.deposit += amount;
    await user.save();

    //update the transaction
    transaction.status = SUCCESS;
    await transaction.save();

    await sendMail({
      to: user.email,
      subject: 'Share Sale Successful',
      html: `
      Hi ${user.firstName},<br><br>
      Your salee of ${quantity} units of ${symbol} shares was successful and your account had been updated  accordingly`,
    });

    return successResponse(res, 201, 'Successfully sold shares', transaction);
  } catch (error) {
    logger.error('error occured in selling shares');
    next(error);
  }
};

export default sellShare;
