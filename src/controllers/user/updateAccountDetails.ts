import { RequestHandler } from 'express';
import AppError from '../../errors/AppError';
import UserModel from '../../models/User';
import successResponse from '../../middleware/response';
import { generateReceipient } from '../../utils/paystackHelper';

const updateAccountDetails: RequestHandler = async (req, res, next) => {
  const { accountNumber, bankCode } = req.body;

  try {
    const user = await UserModel.findById(req.user._id);

    if (!user) {
      return next(new AppError('User not found', 404));
    }

    await generateReceipient(accountNumber, bankCode, user);
    await user.save();

    return successResponse(res, 200, 'Successfully updated user account details', null);
  } catch (error) {
    next(error);
  }
};

export default updateAccountDetails;
