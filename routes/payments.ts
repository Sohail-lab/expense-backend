import { Router } from "express";
import type { Database } from "../types.js";
import { LOG } from "../helper.js";
import { getAllPaymentsForTransactionAndUser, getPaymentByIdForUser } from "../queries/paymentQueries.js";

const createPaymentsRouter = (db: Database) => {
    const router = Router();

    router.get("/", async (req, res) => {
        try {
            const rows = await getAllPaymentsForTransactionAndUser(req.body.transactionId, req.body.userId);
            res.status(200).json(rows);
        } catch (error: any) {
            LOG("Error fetching payments", true, error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    });

    router.get("/:uid", async (req, res) => {
        try {
            const uid = Number(req.params.uid);
            const rows = await getPaymentByIdForUser(req.body.paymentId, uid);
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

export { createPaymentsRouter };
