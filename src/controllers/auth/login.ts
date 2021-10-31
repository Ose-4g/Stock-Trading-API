import { RequestHandler } from 'express';
import AppError from '../../errors/AppError';
import UserModel, { User } from '../../models/User';
import successResponse from '../../middleware/response';
import bcrypt from 'bcryptjs';
import { generateAccessToken } from '../../utils/token';
import validator from 'validator';
import env from '../../env.config';

const { JWT_COOKIE_EXPIRES_IN } = env;

const login: RequestHandler = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email) {
    return next(new AppError('Email is required', 400));
  }

  if (!validator.isEmail(email)) {
    return next(new AppError('Invalid email', 400));
  }

  if (!password) {
    return next(new AppError('Password is required', 400));
  }

  // check that user with email exists
  const user: User | null = await UserModel.findOne({ email }).select('+password');

  if (!user) {
    return next(new AppError('User not found', 404));
  }

  // check the input password matches the users password
  const passwordsMatch = await bcrypt.compare(password, user.password);

  if (!passwordsMatch) {
    return next(new AppError('invalid email or password', 400));
  }

  // generate accessToken and send in request
  const accessToken = generateAccessToken(String(user._id));

  //send the token in a cookie as well
  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV == 'production',
    expires: new Date(Date.now() + parseInt(JWT_COOKIE_EXPIRES_IN) * 60 * 60 * 1000),
  });

  return successResponse(res, 200, 'User Logged in sucessfully', {
    firstName: user.firstName,
    lastName: user.lastName,
    email,
    accessToken,
  });
};

export default login;
