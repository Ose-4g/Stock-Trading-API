import { Schema, model, Model, Document, PopulatedDoc } from 'mongoose';
import constants from '../utils/constants';
import { User } from './User';

const { USER, SHARE } = constants.mongooseModels;

export interface Share extends Document {
  user: PopulatedDoc<User>;
  symbol: string;
  quantity: number;
}

const shareSchema: Schema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: USER,
      required: [true, 'User making transaction is required'],
    },
    symbol: {
      type: String,
      required: [true, 'symbol is required for share'],
    },
    quantity: {
      type: Number,
      required: [true, 'quantity is required for share'],
    },
  },
  { timestamps: true }
);

const ShareModel: Model<Share> = model<Share>(SHARE, shareSchema);

export default ShareModel;
