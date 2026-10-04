import { Router } from "express";
import { createUsersRouter } from "../routes/users.js";
import { createGroupsRouter } from "../routes/groups.js";
import { createPaymentsRouter } from "../routes/payments.js";
import { createTransactionsRouter } from "../routes/transactions.js";
import { createAuthRouter } from '../routes/auth.js';
import { createTestRouter } from '../routes/test.js';
import { authenticate, secureAuthenticate } from '../middleware/auth.js';

const createRoutes = () => {
	const router = Router();

	router.use("/auth", createAuthRouter());
	router.use("/test", secureAuthenticate, createTestRouter());
	router.use("/users", authenticate, createUsersRouter());
	router.use("/groups", authenticate, createGroupsRouter());
	router.use("/payments", authenticate, createPaymentsRouter());
	router.use("/transactions", authenticate, createTransactionsRouter());

	return router;
};

export { createRoutes };
