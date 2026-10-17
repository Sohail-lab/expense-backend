import { Router } from "express";
import { LOG } from "../helpers/helper.js";
import { getAllPaymentsForTransactionAndUser, getPaymentByIdForUser } from "../queries/paymentQueries.js";

const createPaymentsRouter = () => {
    const router = Router();

    router.get("/", async (req, res) => {
        try {
            const txnId = Number(req.query.id);
            const uid = Number(req.query.uid);
            const rows = await getAllPaymentsForTransactionAndUser(txnId, uid);
            res.status(200).json(rows);
        } catch (error: any) {
            LOG("Error fetching payments", true, error);
            res.status(500).json({ error: error.message });
        }
    });

    router.get("/:uid", async (req, res) => {
        try {
            const uid = Number(req.params.uid);
            const paymentId = Number(req.query.paymentId)
            const rows = await getPaymentByIdForUser(paymentId, uid);
            res.status(200).json(rows);
        }
        catch (error: any) {
            LOG("Error fetching payment for user", true, error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    });

    router.post("/", async (req, res) => {
        res.json({ message: "Create payment" });
    });

    router.patch("/:id", async (req, res) => {
        res.json({ message: "added note" });
    });

    router.delete("/:id", async (req, res) => {
        res.json({ message: "Delete payment" });
    });

    return router;
};

export { createPaymentsRouter };
