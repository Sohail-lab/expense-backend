import { Router } from "express";
import { LOG } from "../helpers/helper.js";
import { getTransactionByGroupForUser, createTransaction, updateTransaction, deleteTransaction } from "../controllers/transactions.controller";

const createTransactionsRouter = () => {
    const router = Router();

    router.get("/", getTransactionByGroupForUser);

    router.post("/", createTransaction);

    router.patch("/:id", updateTransaction);

    router.delete("/:id", deleteTransaction);

    return router;
};

export { createTransactionsRouter };
