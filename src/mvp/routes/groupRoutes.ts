import { Router } from 'express';
import { groupView } from '../views/GroupView.js';
import { authenticate } from '../../infrastructure/middleware/authMiddleware.js';

const router = Router();

router.get('/', authenticate, groupView.getAllGroups);
router.get('/:uid', authenticate, groupView.getUserGroups);
router.post('/', authenticate, groupView.createGroup);
router.post('/add', authenticate, groupView.joinGroup);
router.patch('/:id', authenticate, (_req, res) => res.json({ message: 'Update group partially' }));
router.delete('/:id', authenticate, (_req, res) => res.json({ message: 'Delete group' }));

export { router as groupRoutes };
