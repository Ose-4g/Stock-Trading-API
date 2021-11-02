import { RequestHandler } from 'express';
import AppError from '../../errors/AppError';
import UserModel from '../../models/User';
import logger from '../../utils/logger';
import successResponse from '../../middleware/response';
import constants from '../../utils/constants';
import LoanModel from '../../models/Loan';
import ShareModel from '../../models/Share';
import { getPrice } from '../../data/companies';
import TransactionModel from '../../models/Transaction';

const { LOAN } = constants.transactionTypes;

const takeLoan: RequestHandler = async (req, res, next) => {
  const { amount, duration } = req.body;

  // checks on amount
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

  //checks on duration
  if (!duration) {
    return next(new AppError('duration is required', 400));
  }
  const _duration = parseInt(duration);

  if (!_duration || isNaN(_duration)) {
    return next(new AppError('invalid value for duration', 400));
  }
  if (_duration < 6 || _duration > 12) {
    return next(new AppError('Loan duration must be between 6 and 12 months', 400));
  }

  try {
    // check that user is not currently owing any loan
    const unpaidLoans = await LoanModel.find({ paid: false });

    if (unpaidLoans.length > 0) {
      return next(new AppError('You are ineligible to take a new loan till the former is paid', 403));
    }

    // check that the amount is not greater than 60% ot users portfolio value.

    const user = await UserModel.findById(req.user._id);

    const allShares = await ShareModel.find({ user: req.user._id });
    let value = 0;

    for (const share of allShares) {
      const pricePerShare = getPrice(share.symbol);
      value += pricePerShare * share.quantity;
    }

    const maxAllowedLoan = (user!.deposit + value) * 0.6;

    if (_amount > maxAllowedLoan) {
      return next(
        new AppError(`You cannot take a loan more than 60% of your profolio balance.(${maxAllowedLoan})`, 403)
      );
    }

    // all things check out. Create the loan.
    const loan = await LoanModel.create({
      amount: _amount,
      user: user!._id,
      duration: _duration,
    });

    //update the user account
    user!.deposit += _amount;
    user!.loan += _amount;

    await user!.save();

    // create a new Transaction.
    await TransactionModel.create({
      user: req.user._id,
      amount: _amount,
      type: LOAN,
    });

    return successResponse(res, 201, 'Successfully took loan', loan);
  } catch (error) {
    logger.error('An error occured while taking loan');
    next(error);
  }
};

export default takeLoan;
