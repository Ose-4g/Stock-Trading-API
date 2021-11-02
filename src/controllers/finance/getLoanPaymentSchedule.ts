import { RequestHandler } from 'express';
import AppError from '../../errors/AppError';
import logger from '../../utils/logger';
import successResponse from '../../middleware/response';
import LoanModel from '../../models/Loan';
import LoanPaymentModel from '../../models/LoanPayment';

const getLoanPaymentSchedule: RequestHandler = async (req, res, next) => {
  try {
    const loan = await LoanModel.findOne({ user: req.user._id, paid: false });
    if (!loan) {
      return next(new AppError('User does not have any active loans', 400));
    }

    const paymentSchedule = await LoanPaymentModel.find({ user: req.user._id, loan: loan?._id });

    return successResponse(res, 200, 'Successfully fetched the loan payment schedule', paymentSchedule);
  } catch (error) {
    logger.error('Error occured in getting the loan payment schedule');
    next(error);
  }
};

export default getLoanPaymentSchedule;
