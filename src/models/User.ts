import { Schema, model, Model, Document } from 'mongoose';
import validator from 'validator';
import constants from '../utils/constants';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

const { USER } = constants.mongooseModels;

export interface User extends Document {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password: string;
  passwordConfirm: string | null;
  passwordResetToken: string | null;
  passwordResetExpires: Date | null;
  balance: number;
  createPasswordResetToken(): string;
}

const userSchema = new Schema<User>(
  {
    firstName: {
      type: String,
      required: [true, 'First name is required'],
    },
    lastName: {
      type: String,
      required: [true, 'Last name is required'],
    },
    email: {
      type: String,
      required: [true, 'email is required'],
      validate: [validator.isEmail, 'Email is invalid'],
      unique: ['true', 'User with this email already exists'],
    },
    phoneNumber: {
      type: String,
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: 8,
      select: false,
    },
    passwordConfirm: {
      type: String,
      required: [true, 'Please confirm your password'],
      select: false,
    },
    passwordResetToken: {
      type: String,
    },
    passwordResetExpires: {
      type: String,
    },
    balance: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

//hash the password then save to database.
userSchema.pre('save', async function (next) {
  //This would run only is password is actually modified
  if (!this.isModified('password')) {
    return next();
  }

  this.password = await bcrypt.hash(this.password, 12);

  this.passwordConfirm = null;
  next();
});

//generate a random token. send it to user, hash it then store in database.
userSchema.methods.createPasswordResetToken = function (): string {
  const token = crypto.randomBytes(16).toString('hex');

  this.passwordResetToken = crypto.createHash('sha256').update(token).digest('hex');

  this.passwordResetExpires = new Date(Date.now() + 1 * 60 * 60 * 1000);

  return token;
};

const UserModel: Model<User> = model<User>(USER, userSchema);

export default UserModel;
