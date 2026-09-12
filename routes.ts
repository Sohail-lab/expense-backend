import { Router } from "express";
import { createUsersRouter } from "./routes/users.ts";
import { createGroupsRouter } from "./routes/groups.ts";
import { createPaymentsRouter } from "./routes/payments.ts";
import { createTransactionsRouter } from "./routes/transactions.ts";
import type { Database } from "./types.ts";
import { LOG } from "./helper.ts";
import { checkDBConnection } from "./db.ts";
import { createTables, deleteTables, insertTestData } from "./queries/test.ts";

const createRoutes = (db: Database) => {
	const router = Router();

	router.get("/", async (req, res) => {
		try {
			const result = await checkDBConnection();
			res.json(result);
		} catch (error: any) {
			LOG("Error fetching tables", true, error);
		}
	});

	router.get("/test-start", async (req, res) => {
		try {
			const result = await createTables();
			res.json(result);
		} catch (error: any) {
			LOG("Error fetching tables", true, error);
		}
	});
	router.get("/test-delete", async (req, res) => {
		try {
			const result = await deleteTables();
			res.json(result);
		} catch (error: any) {
			LOG("Error fetching tables", true, error);
		}
	});
	router.get("/insert-test-data", async (req, res) => {
		try {
			const result = await insertTestData();
			res.json(result);
		} catch (error: any) {
			LOG("Error inserting test data", true, error);
		}
	});

	router.use("/users", createUsersRouter(db));
	router.use("/groups", createGroupsRouter(db));
	router.use("/payments", createPaymentsRouter(db));
	router.use("/transactions", createTransactionsRouter(db));

	return router;
};

export { createRoutes };
