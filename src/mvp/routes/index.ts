import { Router } from 'express';
import { authRoutes } from './authRoutes.js';
import { userRoutes } from './userRoutes.js';
import { groupRoutes } from './groupRoutes.js';
import { transactionRoutes } from './transactionRoutes.js';
import { paymentRoutes } from './paymentRoutes.js';
import { testRoutes } from './testRoutes.js';

const createRoutes = () => {
    const router = Router();

    router.use('/auth', authRoutes);
    router.use('/test', testRoutes);
    router.use('/users', userRoutes);
    router.use('/groups', groupRoutes);
    router.use('/transactions', transactionRoutes);
    router.use('/payments', paymentRoutes);

    return router;
};

export { createRoutes };
