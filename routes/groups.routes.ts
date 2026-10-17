import { Router } from "express";
import { LOG, generateUniqueGroupCode } from "../helpers/helper.js";
import { createGroup, joinGroup } from "../queries/groupQueries.js";
import { getAllGroups, getCurrentUserGroups } from '../controllers/groups.controller.js';

const createGroupsRouter = () => {
    const router = Router();

    router.get("/", getAllGroups);

    router.get("/:uid", getCurrentUserGroups);

    router.post("/", async (req, res) => {
        try {
            const { name, userId } = req.body;
            const groupCode = await generateUniqueGroupCode();
            await createGroup(name, userId, groupCode);
            res.json({ message: "Create group success", joinCode: groupCode });
        } catch (error: any) {
            LOG("Error fetching groups for user", true, error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    });

    router.post("/add", async (req, res) => {
        try {
            const { userId, groupCode } = req.body;
            await joinGroup(groupCode, userId);
            res.json({ message: "User added to group successfully" });
        } catch (error: any) {
            LOG("Error fetching groups for user", true, error);
            res.status(404).json({ error: error.message });
        }
    });

    router.patch("/:id", async (req, res) => {
        res.json({ message: "Update group partially" });
    });

    router.delete("/:id", async (req, res) => {
        res.json({ message: "Delete group" });
    });

    return router;
};

export { createGroupsRouter };
