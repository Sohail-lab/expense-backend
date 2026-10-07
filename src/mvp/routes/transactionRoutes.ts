import { Router } from 'express';
import { transactionView } from '../views/TransactionView.js';
import { authenticate } from '../../infrastructure/middleware/authMiddleware.js';

const router = Router();

router.get('/', authenticate, transactionView.getTransactionsByGroupForUser);
router.post('/', authenticate, transactionView.createTransaction);
router.patch('/:id', authenticate, (_req, res) => res.json({ message: 'Update transaction succeed' }));
router.delete('/:id', authenticate, (_req, res) => res.json({ message: 'Delete transaction' }));

export { router as transactionRoutes };
