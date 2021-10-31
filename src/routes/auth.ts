import { Router } from 'express';
import signUp from '../controllers/auth/signup';
import login from '../controllers/auth/login';
import joiMiddleware from '../middleware/joiMiddleware';
import { signUpSchema } from '../validators/auth';
import forgotPassword from '../controllers/auth/forgotPassword';
import resetPassword from '../controllers/auth/resetPassword';

const router: Router = Router();

router.post('/signup', joiMiddleware(signUpSchema), signUp);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);

export default router;
