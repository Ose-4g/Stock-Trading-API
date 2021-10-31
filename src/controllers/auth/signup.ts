import { RequestHandler } from 'express';
import AppError from '../../errors/AppError';
import UserModel, { User } from '../../models/User';
import successResponse from '../../middleware/response';
import sendMail from '../../utils/sendMail';

const signUp: RequestHandler = async (req, res, next) => {
  const { firstName, lastName, email, password, phoneNumber, passwordConfirm } = req.body;

  // check that the email is not in use
  const prevUsers: User[] = await UserModel.find({ email });

  if (prevUsers.length > 0) {
    return next(new AppError('User with this email already exists', 400));
  }

  // create user
  const user: User = await UserModel.create({
    firstName,
    lastName,
    email,
    password,
    phoneNumber,
    passwordConfirm,
  });

  //send welcome  email
  await sendMail({
    to: user.email,
    subject: 'Welcome to Trove',
    html: `
    Hi ${user.firstName},<br>
    You've successfully signed up to the TroveTest app<br>
    Login to get started in making valuable investments. 
    `,
  });

  return successResponse(res, 201, 'Successfully created user', {
    firstName,
    lastName,
    email,
  });
};

export default signUp;
