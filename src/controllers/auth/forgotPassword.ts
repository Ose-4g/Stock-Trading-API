import { RequestHandler } from 'express';
import AppError from '../../errors/AppError';
import UserModel, { User } from '../../models/User';
import logger from '../../utils/logger';
import sendMail from '../../utils/sendMail';
import env from '../../env.config';
import successResponse from '../../middleware/response';

const { CLIENT_URL } = env;

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

    await sendMail({
      to: email,
      subject: 'Reset your password',
      html: `
        Hi ${user.firstName},<br>
        Please use the link below to reset your password<br><br>

        ${CLIENT_URL}/reset-password/${token}
        `,
    });

    return successResponse(res, 200, 'Successfully sent reset password email', null);
  } catch (error) {
    logger.error('An error occured in forogt password');
    next(error);
  }
};

export default forgotPassword;
