import { Router } from "express";
import { LOG } from "../helpers/helper.js";
import { getAllGroups, getCurrentUserGroups, createGroup, joinGroup, updateGroup, deleteGroup } from '../controllers/groups.controller.js';

const createGroupsRouter = () => {
    const router = Router();

    router.get("/", getAllGroups);

    router.get("/:uid", getCurrentUserGroups);

    router.post("/", createGroup);

    router.post("/add", joinGroup);

    router.patch("/:id", updateGroup);

    router.delete("/:id", deleteGroup);

    return router;
};

export { createGroupsRouter };
