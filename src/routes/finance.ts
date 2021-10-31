import { Router } from 'express';
import buyShare from '../controllers/finance/buyShare';
import deposit from '../controllers/finance/deposit';
import webhook from '../controllers/finance/webhook';
import { requireSignIn } from '../middleware/auth';

const router = Router();

router.post('/webhook', webhook);
router.post('/deposit', requireSignIn, deposit);
router.post('/buy-shares', requireSignIn, buyShare);

export default router;
