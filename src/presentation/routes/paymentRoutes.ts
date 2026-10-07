import { Router } from 'express';
import { PaymentController } from '../controllers/PaymentController.js';
import { authenticate } from '../../infrastructure/middleware/authMiddleware.js';

const router = Router();
const paymentController = new PaymentController();

router.get('/', authenticate, (req, res) => paymentController.getPaymentsForTransaction(req, res));
router.get('/:uid', authenticate, (req, res) => paymentController.getPaymentDetails(req, res));
router.post('/', authenticate, (req, res) => res.json({ message: 'Create payment' }));
router.patch('/:id', authenticate, (req, res) => res.json({ message: 'added note' }));
router.delete('/:id', authenticate, (req, res) => res.json({ message: 'Delete payment' }));

export { router as paymentRoutes };
