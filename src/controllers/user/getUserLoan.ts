import { RequestHandler } from 'express';
import ShareModel from '../../models/Share';
import successResponse from '../../middleware/response';
import { getPrice } from '../../data/companies';
import logger from '../../utils/logger';
import UserModel from '../../models/User';
import LoanModel from '../../models/Loan';
import AppError from '../../errors/AppError';

const getUserLoanBalance: RequestHandler = async (req, res, next) => {
  try {
    const loan = await LoanModel.findOne({ user: req.user._id, paid: false });

    if (!loan) {
      return next(new AppError('You have no ative loans', 403));
    }

    return successResponse(res, 200, 'Successfully fetched loan balance', {
      loan,
    });
  } catch (error) {
    logger.error('error occured while getting user loan balance');
    next(error);
  }
};

export default getUserLoanBalance;
