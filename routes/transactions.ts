import { Router } from "express";
import type { Database } from "../types.js";
import { LOG } from "../helper.js";
import { getTransactionByGroupForUser, createTransaction } from "../queries/transactionQueries.js";

const createTransactionsRouter = (db: Database) => {
    const router = Router();

    router.get("/:uid", async (req, res) => {
        try {
            const uid = Number(req.params.uid);
            const rows = await getTransactionByGroupForUser(req.body.groupId, uid);
            res.status(200).json(rows);
        }
        catch (error: any) {
            LOG("Error fetching transaction for user", true, error);
            res.status(500).json({ error: error.message });
        }
    });

    router.post("/", async (req, res) => {
        try {
            const txnData = req.body;
            await createTransaction(txnData);
            res.json({ message: "Create transaction succeed" });
        } catch (error: any) {
            LOG("Error fetching transaction for user", true, error);
            res.status(500).json({ error: error.message });
        }
    });

    router.patch("/:id", async (req, res) => {
        res.json({ message: "Update transaction succeed" });
    });

    router.delete("/:id", async (req, res) => {
        res.json({ message: "Delete group" });
    });

    return router;
};

export { createTransactionsRouter };
