import { RequestHandler } from 'express';
import AppError from '../../errors/AppError';
import UserModel from '../../models/User';
import logger from '../../utils/logger';
import { initializeTransaction } from '../../utils/paystackHelper';
import successResponse from '../../middleware/response';
import constants from '../../utils/constants';
import LoanPaymentModel from '../../models/LoanPayment';
import validator from 'validator';

const { PAYBACK } = constants.transactionTypes;

const payInstallMent: RequestHandler = async (req, res, next) => {
  const { loanPaymentId } = req.params;

  //checking the id is valid
  if (!loanPaymentId) {
    return next(new AppError('loan payment id is required', 400));
  }

  if (!validator.isMongoId(loanPaymentId)) {
    return next(new AppError('invalid id provided', 400));
  }

  try {
    // get the loan payment
    const loanPayment = await LoanPaymentModel.findOne({ _id: loanPaymentId, paid: false });

    if (!loanPayment) {
      return next(new AppError('Loan payment item not found', 404));
    }

    const user = await UserModel.findById(req.user._id);

    // initialize payment for the loan payment
    const transaction = await initializeTransaction(user!, loanPayment.amount, PAYBACK, loanPaymentId);

    return successResponse(res, 200, 'Details on paying back have been sent to your email', transaction);
  } catch (error) {
    logger.error('An error occured in the payinstallment endpoint');
    next(error);
  }
};

export default payInstallMent;
