import { Request, Response } from "express";
import { executeQuery, LOG } from "../helpers/helper.js";
import getAllPaymentsForTransactionAndUserQuery from "../db/queries/payment_queries/getAllPaymentsForTransactionAndUser.sql";
import getPaymentByIdForUserQuery from "../db/queries/payment_queries/getPaymentByIdForUser.sql";

export const getAllPaymentsForTransactionAndUser = async (req: Request, res: Response) => {
    try {
        const txnId = Number(req.query.id);
        const uid = Number(req.query.uid);
        const rows = await executeQuery(getAllPaymentsForTransactionAndUserQuery, [txnId, uid, uid]);
        res.status(200).json(rows);
    } catch (error: any) {
        LOG("Error fetching payments", true, error);
        res.status(500).json({ error: error.message });
    }
}

export const getPaymentByIdForUser = async (req: Request, res: Response) => {
    try {
        const uid = Number(req.params.uid);
        const paymentId = Number(req.query.paymentId)
        const rows = await executeQuery(getPaymentByIdForUserQuery, [paymentId, uid, uid]);
        res.status(200).json(rows);
    }
    catch (error: any) {
        LOG("Error fetching payment for user", true, error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

export const createPayment = async (req: Request, res: Response) => {
    res.json({ message: "Create payment" });
}

export const updatePayment = async (req: Request, res: Response) => {
    res.json({ message: "added note" });
}

export const deletePayment = async (req: Request, res: Response) => {
    res.json({ message: "Delete payment" });
}