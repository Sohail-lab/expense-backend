import { Router } from 'express';
import { authView } from '../views/AuthView.js';
import { authenticate } from '../../infrastructure/middleware/authMiddleware.js';

const router = Router();

router.post('/login', authView.login);
router.post('/logout', authenticate, authView.logout);
router.post('/google', authView.googleLogin);

export { router as authRoutes };
