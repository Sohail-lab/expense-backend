import { Router } from "express";
import { createUsersRouter } from "../routes/users.routes.js";
import { createGroupsRouter } from "../routes/groups.routes.js";
import { createPaymentsRouter } from "../routes/payments.routes.js";
import { createTransactionsRouter } from "../routes/transactions.routes.js";
import { createAuthRouter } from '../routes/auth.routes.js';
import { createTestRouter } from '../routes/test.routes.js';
import { authenticate, secureAuthenticate } from '../middlewares/auth';

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
