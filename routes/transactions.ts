import { Router } from "express";
import { LOG } from "../helpers/helper.js";
import { getTransactionByGroupForUser, createTransaction } from "../queries/transactionQueries.js";

const createTransactionsRouter = () => {
    const router = Router();

    router.get("/", async (req, res) => {
        try {
            const uid = Number(req.query.uid);
            const groupId = Number(req.query.groupId);
            const rows = await getTransactionByGroupForUser(groupId, uid);
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
        res.json({ message: "Delete transaction" });
    });

    return router;
};

export { createTransactionsRouter };
