import { RequestHandler } from 'express';
import AppError from '../../errors/AppError';
import UserModel from '../../models/User';
import logger from '../../utils/logger';
import successResponse from '../../middleware/response';

const getUserInfo: RequestHandler = async (req, res, next) => {
  try {
    const user = await UserModel.findById(req.user._id);

    if (!user) {
      return next(new AppError('User not found', 404));
    }

    return successResponse(res, 200, 'Successfully fetched user details', user);
  } catch (error) {
    logger.error('an error occured while fetching user details');
    next(error);
  }
};

export default getUserInfo;
