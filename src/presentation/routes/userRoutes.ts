import { Router } from 'express';
import { UserController } from '../controllers/UserController.js';
import { authenticate } from '../../infrastructure/middleware/authMiddleware.js';

const router = Router();
const userController = new UserController();

router.get('/', authenticate, (req, res) => userController.getUserIdByEmail(req, res));
router.get('/:id', authenticate, (req, res) => userController.getUserDetails(req, res));
router.post('/', (req, res) => userController.createUser(req, res));
router.patch('/:id', authenticate, (req, res) => userController.updateUser(req, res));
router.delete('/:id', authenticate, (req, res) => userController.deleteUser(req, res));

export { router as userRoutes };
