import { Router } from 'express';
import buyShare from '../controllers/finance/buyShare';
import deposit from '../controllers/finance/deposit';
import getLoanPaymentSchedule from '../controllers/finance/getLoanPaymentSchedule';
import payInstallMent from '../controllers/finance/payLoanInstallment';
import sellShare from '../controllers/finance/sellShare';
import takeLoan from '../controllers/finance/takeLoan';
import webhook from '../controllers/finance/webhook';
import withdrawFunds from '../controllers/finance/withdraw';
import { requireSignIn } from '../middleware/auth';

const router = Router();

router.post('/webhook', webhook);
router.post('/deposit', requireSignIn, deposit);
router.post('/withdraw', requireSignIn, withdrawFunds);
router.post('/buy-shares', requireSignIn, buyShare);
router.post('/sell-shares', requireSignIn, sellShare);
router.post('/take-loan', requireSignIn, takeLoan);
router.get('/payment-schedule', requireSignIn, getLoanPaymentSchedule);
router.post('/pay-loan-installment/:loanPaymentId', requireSignIn, payInstallMent);

export default router;
