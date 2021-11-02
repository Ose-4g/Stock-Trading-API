import { RequestHandler } from 'express';
import AppError from '../../errors/AppError';
import logger from '../../utils/logger';
import UserModel from '../../models/User';
import crypto from 'crypto';
import successResponse from '../../middleware/response';

const resetPassword: RequestHandler = async (req, res, next) => {
  const { password, passwordConfirm } = req.body;
  const { token } = req.params;

  if (!token) {
    return next(new AppError('token is required', 400));
  }

  if (!password || !passwordConfirm) {
    return next(new AppError('password and passwordConfirm are required', 400));
  }

  if (password != passwordConfirm) {
    return next(new AppError('password mismatch', 400));
  }

  try {
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    const user = await UserModel.findOne({ passwordResetToken: hashedToken });

    // check that the rest token has not expired
    if (!user || (user.passwordResetExpires as Date).getTime() < Date.now()) {
      return next(new AppError('Invalid or expired token', 400));
    }

    //update the password
    user.passwordResetToken = null;
    user.passwordResetExpires = null;

    user.password = password;
    user.passwordConfirm = passwordConfirm;

    await user.save();

    return successResponse(res, 200, 'Password successfully reset', null);
  } catch (error) {
    logger.error('error occured in reset password');
    next(error);
  }
};

export default resetPassword;
