import { RequestHandler } from 'express';
import AppError from '../../errors/AppError';
import UserModel from '../../models/User';
import bcrypt from 'bcryptjs';
import successResponse from '../../middleware/response';
import logger from '../../utils/logger';

const updatePassword: RequestHandler = async (req, res, next) => {
  const { currentPassword, newPassword, newPasswordConfirm } = req.body;

  try {
    //get the logged in user
    const user = await UserModel.findById(req.user._id).select('+password');

    if (!user) {
      return next(new AppError('User not found', 404));
    }

    //check if passwords match
    const passwordMatch = await bcrypt.compare(currentPassword, user.password);
    if (!passwordMatch) {
      return next(new AppError('incorrect  password provided', 400));
    }

    if (newPassword != newPasswordConfirm) {
      return next(new AppError('new password doesnt match with confirm password', 400));
    }

    //update the user password
    user.password = newPassword;
    user.passwordConfirm = newPasswordConfirm;

    await user.save();

    return successResponse(res, 200, 'Successfully updated user password', null);
  } catch (error) {
    logger.error('Error occured in update password');
    next(error);
  }
};

export default updatePassword;
