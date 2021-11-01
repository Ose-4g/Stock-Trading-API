import { Schema, model, Model, Document, PopulatedDoc } from 'mongoose';
import { User } from './User';
import constants from '../utils/constants';

const { USER, LOAN } = constants.mongooseModels;

export interface Loan extends Document {
  user: PopulatedDoc<User>;
  amount: number;
  paid: boolean;
  duration: number; // number of months
}

const loanSchema: Schema<Loan> = new Schema<Loan>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: USER,
      required: [true, 'User is required'],
    },
    amount: {
      type: Number,
      required: [true, 'amount is required'],
    },
    paid: {
      type: Boolean,
      default: false,
    },
    duration: {
      type: Number,
      required: [true, 'months duration is required'],
    },
  },
  { timestamps: true }
);

const LoanModel: Model<Loan> = model<Loan>(LOAN, loanSchema);

export default LoanModel;
