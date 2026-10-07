import { Router } from 'express';
import { AuthController } from '../controllers/AuthController.js';
import { authenticate } from '../../infrastructure/middleware/authMiddleware.js';

const router = Router();
const authController = new AuthController();

router.post('/login', (req, res) => authController.login(req, res));
router.post('/logout', authenticate, (req, res) => authController.logout(req, res));
router.post('/google', (req, res) => authController.authenticateWithGoogle(req, res));

export { router as authRoutes };
