import { Router } from 'express';
import { TransactionController } from '../controllers/TransactionController.js';
import { authenticate } from '../../infrastructure/middleware/authMiddleware.js';

const router = Router();
const transactionController = new TransactionController();

router.get('/', authenticate, (req, res) => transactionController.getTransactionsByGroup(req, res));
router.post('/', authenticate, (req, res) => transactionController.createTransaction(req, res));
router.patch('/:id', authenticate, (req, res) => res.json({ message: 'Update transaction succeed' }));
router.delete('/:id', authenticate, (req, res) => res.json({ message: 'Delete transaction' }));

export { router as transactionRoutes };
