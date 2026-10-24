import { Router } from "express";
import { LOG } from "../helpers/helper.js";
import { getCurrentUserId, getCurrentUserDetails, deleteUser, updateUser, getUsersInSharedGroups } from "../controllers/users.controller.js";

const createUsersRouter = () => {
	const router = Router();

	router.get("/", getCurrentUserId);

	router.get("/:id", getCurrentUserDetails);

	router.get("/all/:id", getUsersInSharedGroups);

	router.patch("/:id", updateUser);

	router.delete("/:id", deleteUser);

	return router;
};

export { createUsersRouter };
