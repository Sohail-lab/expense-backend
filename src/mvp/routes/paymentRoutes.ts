import { Router } from 'express';
import { paymentView } from '../views/PaymentView.js';
import { authenticate } from '../../infrastructure/middleware/authMiddleware.js';

const router = Router();

router.get('/', authenticate, paymentView.getPaymentsForTransactionAndUser);
router.get('/:uid', authenticate, paymentView.getPaymentByIdForUser);
router.post('/', authenticate, (_req, res) => res.json({ message: 'Create payment' }));
router.patch('/:id', authenticate, (_req, res) => res.json({ message: 'added note' }));
router.delete('/:id', authenticate, (_req, res) => res.json({ message: 'Delete payment' }));

export { router as paymentRoutes };
