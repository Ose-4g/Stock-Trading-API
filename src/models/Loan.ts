import { Schema, model, Model, Document, PopulatedDoc } from 'mongoose';
import { User } from './User';
import constants from '../utils/constants';
import LoanPaymentModel from './LoanPayment';

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

loanSchema.pre('save', async function (next) {
  // check whether loan payments have been created.
  const loanPayments = await LoanPaymentModel.find({ loan: this._id, user: this.user });

  if (loanPayments.length < 1) {
    //there are no loan payments created for this loan.
    const amount = this.amount / this.duration;

    // create a loan payment schedule for each month
    for (let i = 1; i <= this.duration; i++) {
      const date = new Date(Date.now());
      date.setMonth(date.getMonth() + i);

      await LoanPaymentModel.create({
        loan: this._id,
        user: this.user,
        amount,
        paymentDue: date,
      });
    }
  }
});
const LoanModel: Model<Loan> = model<Loan>(LOAN, loanSchema);

export default LoanModel;
