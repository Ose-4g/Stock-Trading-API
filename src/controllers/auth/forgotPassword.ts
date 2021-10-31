import { RequestHandler } from 'express';
import AppError from '../../errors/AppError';
import UserModel, { User } from '../../models/User';
import logger from '../../utils/logger';

const forgotPassword: RequestHandler = async (req, res, next) => {
  const { email } = req.body;

  if (!email) {
    return next(new AppError('email is required', 400));
  }

  try {
    const user: User | null = await UserModel.findOne({ email });
    if (!user) {
      return next(new AppError(`User with email ${email} does not exist`, 404));
    }

    const token = user.createPasswordResetToken();
    await user.save();

    await sendMail({});
  } catch (error) {
    logger.error('An error occured in forogt password');
    next(error);
  }
};
