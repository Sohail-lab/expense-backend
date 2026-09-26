import { Router } from "express";
import type { Database } from "../types.js";
import { LOG } from "../helper.js";
import { getCurrentUserDetails, getCurrentUserId, createUser, deleteUser, updateUser } from '../queries/userQueries.js';

const createUsersRouter = (db: Database) => {
	const router = Router();

	router.get("/", async (req, res) => {
		try {
			const { email, password } = req.body;
			const rows = await getCurrentUserId(email, password);
			res.status(200).json(rows);
		} catch (error: any) {
			LOG("Error fetching users", true, error);
			res.status(500).json({ error: "Internal Server Error" });
		}
	});

	router.get("/:id", async (req, res) => {
		try {
			const id = req.params.id as unknown as number;
			const rows = await getCurrentUserDetails(id);
			res.status(200).json(rows);
		} catch (error: any) {
			LOG(`Error fetching user details with id = ${req.params.id}`, true, error);
			res.status(500).json({ error: "Internal Server Error" });
		}
	});

	router.post("/", async (req, res) => {
		try {
			const { name, email, password } = req.body;
			const result = await createUser(name, email, password);
			res.status(201).json({ message: "Create user succeeded", result });
		} catch (error: any) {
			res.status(500).json({ error: "Internal Server Error" });
		}
	});

	router.patch("/:id", async (req, res) => {
		try {
			const id = req.params.id as unknown as number;
			const newData = req.body;
			await updateUser(id, newData);
			res.status(201).json({ message: "Update user succeeded" });
		} catch (error: any) {
			res.status(500).json({ error: error.message });
		}
	});

	router.delete("/:id", async (req, res) => {
		try {
			const id = req.params.id as unknown as number;
			const { superUserId } = req.body;
			await deleteUser(id, superUserId);
			res.status(200).json({ message: `Deleted user ${id}` });
		} catch (error: any) {
			res.status(403).json({ error: error.message });
		}
	});

	return router;
};

export { createUsersRouter };
