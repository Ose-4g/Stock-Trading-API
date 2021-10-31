import { Router } from 'express';
import deposit from '../controllers/finance/deposit';
import webhook from '../controllers/finance/webhook';
import { requireSignIn } from '../middleware/auth';

const router = Router();

router.post('/webhook', webhook);
router.post('/deposit', requireSignIn, deposit);

export default router;
