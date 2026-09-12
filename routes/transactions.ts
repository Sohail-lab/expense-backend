import { Router } from "express";
import type { Database } from "../types.js";
import { ErrorResponseDB, LOG } from "../helper.js";
import { getTransactionByIdForUser } from "../queries/transactionQueries";

const createTransactionsRouter = (db: Database) => {
    const router = Router();

    router.get("/:uid", async (req, res) => {
        try {
            const uid = Number(req.params.uid);
            const rows = await getTransactionByIdForUser(req.body.transactionId, uid);
            res.status(200).json(rows);
        }
        catch (error: any) {
            LOG("Error fetching payment for user", true, error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    });

    router.post("/", async (req, res) => {
        res.json({ message: "Create group" });
    });

    router.patch("/:id", async (req, res) => {
        res.json({ message: "Update group partially" });
    });

    router.delete("/:id", async (req, res) => {
        res.json({ message: "Delete group" });
    });

    return router;
};

export { createTransactionsRouter };
