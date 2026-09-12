import { Router } from "express";
import type { Database } from "../types.js";
import { LOG } from "../helper.js";

const createUsersRouter = (db: Database) => {
	const router = Router();

	router.get("/", async (req, res) => {
		try {
			const rows = await db.query(`SHOW TABLES;`);
			res.status(200).json(rows);
		} catch (error: any) {
			LOG("Error fetching users", true, error);
			res.status(500).json({ error: "Internal Server Error" });
		}
	});

	router.get("/:id", async (req, res) => {
		res.json({ message: "Get user by id" });
	});

	router.post("/", async (req, res) => {
		res.json({ message: "Create user" });
	});

	router.put("/:id", async (req, res) => {
		res.json({ message: "Update user" });
	});

	router.patch("/:id", async (req, res) => {
		res.json({ message: "Update user partially" });
	});

	router.delete("/:id", async (req, res) => {
		res.json({ message: "Delete user" });
	});

	return router;
};

export { createUsersRouter };
