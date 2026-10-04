import { Router } from "express";
import { LOG } from "../helpers/helper.js";
import { getTransactionByGroupForUser, createTransaction, getTransactionDetails } from "../queries/transactionQueries.js";

const createTransactionsRouter = () => {
    const router = Router();

    router.get("/", async (req, res) => {
        try {
            const uid = Number(req.query.uid);
            const rows = await getTransactionByGroupForUser(req.body.groupId, uid);
            res.status(200).json(rows);
        }
        catch (error: any) {
            LOG("Error fetching transaction for user", true, error);
            res.status(500).json({ error: error.message });
        }
    });

    router.get("/transaction", async (req, res) => {
        try {
            const txnId = Number(req.query.id);
            const uid = Number(req.query.uid);
            const rows = await getTransactionDetails(txnId, uid);
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
