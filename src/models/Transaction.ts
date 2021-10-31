import { Schema, model, Model, Document, PopulatedDoc } from 'mongoose';
import constants from '../utils/constants';
import { User } from './User';

const { USER, TRANSACTION } = constants.mongooseModels;
const { DEPOSIT, WITHDRAWAL, BUY, SELL } = constants.transactionTypes;
const { INITIATED, FAILURE, SUCCESS } = constants.transactionStatus;

export interface Transaction extends Document {
  user: PopulatedDoc<User>;
  reference: string;
  amount: number;
  type: string;
  shares: string;
  numberOfShares: number;
  pricePerShare: number;
  status: string;
  authorization_url: string | null;
}

const transactionSchema: Schema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: USER,
      required: [true, 'User making transaction is required'],
    },
    reference: {
      type: String,
    },
    amount: {
      type: Number,
      required: [true, 'amount of transaction is required'],
    },
    type: {
      type: String,
      enum: [DEPOSIT, WITHDRAWAL, BUY, SELL],
      required: [true, 'Transaction type is required'],
    },
    shares: {
      type: String,
    },
    numberOfShares: {
      type: Number,
    },
    pricePerShare: {
      type: Number,
    },
    status: {
      type: String,
      required: ['true', 'Transaction status is required'],
      enum: [INITIATED, FAILURE, SUCCESS],
      default: INITIATED,
    },
    authorization_url: {
      type: String,
    },
  },
  { timestamps: true }
);

const TransactionModel: Model<Transaction> = model<Transaction>(TRANSACTION, transactionSchema);

export default TransactionModel;
