import { Router } from "express";
import { LOG } from "../helpers/helper.js";
import { checkDBConnection } from "../db/db.js";
import { createTables, deleteTables, insertTestData } from "../test/test.js";

const createTestRouter = () => {
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

    return router;
};

export { createTestRouter };
