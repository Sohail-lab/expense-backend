import { Router } from 'express';
import { GroupController } from '../controllers/GroupController.js';
import { authenticate } from '../../infrastructure/middleware/authMiddleware.js';

const router = Router();
const groupController = new GroupController();

router.get('/', authenticate, (req, res) => groupController.getAllGroups(req, res));
router.get('/:uid', authenticate, (req, res) => groupController.getUserGroups(req, res));
router.post('/', authenticate, (req, res) => groupController.createGroup(req, res));
router.post('/add', authenticate, (req, res) => groupController.joinGroup(req, res));
router.patch('/:id', authenticate, (req, res) => res.json({ message: 'Update group partially' }));
router.delete('/:id', authenticate, (req, res) => res.json({ message: 'Delete group' }));

export { router as groupRoutes };
