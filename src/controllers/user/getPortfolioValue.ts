import { RequestHandler } from 'express';
import ShareModel from '../../models/Share';
import successResponse from '../../middleware/response';
import { getPrice } from '../../data/companies';
import logger from '../../utils/logger';
import UserModel from '../../models/User';

const getPortfolioValue: RequestHandler = async (req, res, next) => {
  try {
    const user = await UserModel.findById(req.user._id);
    const allShares = await ShareModel.find({ user: req.user._id });
    let value = 0;
    for (const share of allShares) {
      const pricePerShare = getPrice(share.symbol);
      value += pricePerShare * share.quantity;
    }
    return successResponse(res, 200, 'Successfully fetched portfolio position', {
      value,
      deposit: user?.deposit,
      total: user!.deposit + value,
    });
  } catch (error) {
    logger.error('error occured while [pulling portfolio position');
    next(error);
  }
};

export default getPortfolioValue;
