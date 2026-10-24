import { Router } from "express";
import { LOG } from "../helpers/helper.js";
import { getAllPaymentsForTransactionAndUser, getPaymentByIdForUser, createPayment, updatePayment, deletePayment } from "../controllers/payments.controller";

const createPaymentsRouter = () => {
    const router = Router();

    router.get("/", getAllPaymentsForTransactionAndUser);

    router.get("/:uid", getPaymentByIdForUser);

    router.post("/", createPayment);

    router.patch("/:id", updatePayment);

    router.delete("/:id", deletePayment);

    return router;
};

export { createPaymentsRouter };
