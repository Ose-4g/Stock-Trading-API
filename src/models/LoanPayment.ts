import { Schema, model, Model, Document, PopulatedDoc } from 'mongoose';
import { User } from './User';
import constants from '../utils/constants';
import { Loan } from './Loan';

const { USER, LOAN, LOAN_PAYMENT } = constants.mongooseModels;

export interface LoanPayment extends Document {
  loan: PopulatedDoc<Loan>;
  user: PopulatedDoc<User>;
  amount: number;
  paymentDue: Date;
  paid: boolean;
}

const loanPaymentSchema = new Schema<LoanPayment>(
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
    loan: {
      type: Schema.Types.ObjectId,
      ref: LOAN,
      required: [true, 'Loan id is required'],
    },
    paymentDue: {
      type: Date,
    },
  },
  { timestamps: true }
);

const LoanPaymentModel: Model<LoanPayment> = model<LoanPayment>(LOAN_PAYMENT, loanPaymentSchema);

export default LoanPaymentModel;
