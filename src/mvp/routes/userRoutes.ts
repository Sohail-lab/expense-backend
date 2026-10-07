import { Router } from 'express';
import { userView } from '../views/UserView.js';
import { authenticate } from '../../infrastructure/middleware/authMiddleware.js';

const router = Router();

router.get('/', authenticate, userView.getUserIdByEmail);
router.get('/:id', authenticate, userView.getUserDetails);
router.post('/', userView.createUser);
router.patch('/:id', authenticate, userView.updateUser);
router.delete('/:id', authenticate, userView.deleteUser);

export { router as userRoutes };
