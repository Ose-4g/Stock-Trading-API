import { RequestHandler } from 'express';
import AppError from '../../errors/AppError';
import UserModel from '../../models/User';
import successResponse from '../../middleware/response';

const updateUserDetails: RequestHandler = async (req, res, next) => {
  const { firstName, lastName, phoneNumber } = req.body;

  try {
    const user = await UserModel.findById(req.user._id);

    if (!user) {
      return next(new AppError('User not found', 404));
    }

    if (firstName && String(firstName).length > 0) {
      user.firstName = firstName;
    }
    if (lastName && String(lastName).length > 0) {
      user.lastName = lastName;
    }
    if (phoneNumber && String(phoneNumber).length > 0) {
      user.phoneNumber = phoneNumber;
    }

    await user.save();

    return successResponse(res, 200, 'Successfully updated user details', {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phoneNumber: user.phoneNumber,
    });
  } catch (error) {
    next(error);
  }
};

export default updateUserDetails;
