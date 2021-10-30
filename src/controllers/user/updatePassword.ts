import { RequestHandler } from 'express';
import AppError from '../../errors/AppError';
import UserModel from '../../models/User';
import bcrypt from 'bcryptjs';

const updatePassword: RequestHandler = async (req, res, next) => {
  const { currentPassword, newPassword, newPasswordConfirm } = req.body;

  try {
    const user = await UserModel.findById(req.user._id).select('+password');

    if (!user) {
      return next(new AppError('User not found', 404));
    }

    const passwordMatch = await bcrypt.compare(currentPassword, user.password);
    if (!passwordMatch) {
      return next(new AppError('incorrect  password provided', 400));
    }

    if (newPassword != newPasswordConfirm) {
      return next(new AppError('new password doesnt match with confirm password', 400));
    }

    user.password = newPassword;
    user.passwordConfirm = newPasswordConfirm;

    await user.save();
  } catch (error) {
    next(error);
  }
};
