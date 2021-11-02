import { getPrice } from '../../data/companies';
import ShareModel from '../../models/Share';
import logger from '../../utils/logger';
import successResponse from '../../middleware/response';
import { RequestHandler } from 'express';

const getPortFolioPosition: RequestHandler = async (req, res, next) => {
  try {
    const allShares = await ShareModel.find({ user: req.user._id });
    const data = [];
    for (const share of allShares) {
      // get the value of each of the shares the user owns.
      const pricePerShare = getPrice(share.symbol);
      const shareCopy = {
        symbol: share.symbol,
        totalQuantity: share.quantity,
        equityValue: pricePerShare * share.quantity,
        pricePerShare,
      };

      data.push(shareCopy);
    }
    return successResponse(res, 200, 'Successfully fetched portfolio position', data);
  } catch (error) {
    logger.error('error occured while [pulling portfolio position');
    next(error);
  }
};

export default getPortFolioPosition;
