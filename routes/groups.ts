import { Router } from "express";
import type { Database } from "../types.js";
import { LOG, generateUniqueGroupCode } from "../helper.js";
import { getAllGroups, getCurrentUserGroups, createGroup, joinGroup } from "../queries/groupQueries.js";

const createGroupsRouter = (db: Database) => {
    const router = Router();

    router.get("/", async (req, res) => {
        try {
            const rows = await getAllGroups();
            res.status(200).json(rows);
        } catch (error: any) {
            LOG("Error fetching groups", true, error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    });

    router.get("/:uid", async (req, res) => {
        try {
            const uid = Number(req.params.uid);
            const rows = await getCurrentUserGroups(uid);
            res.status(200).json(rows);
        } catch (error: any) {
            LOG("Error fetching groups for user", true, error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    });

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
