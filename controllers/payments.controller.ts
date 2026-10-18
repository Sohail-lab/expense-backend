import { Request, Response } from "express";
import { executeQuery, executeTransaction, LOG } from "../helpers/helper.js";
import getAllPaymentsForTransactionAndUserQuery from "../db/queries/payment_queries/getAllPaymentsForTransactionAndUser.sql";
import getPaymentByIdForUserQuery from "../db/queries/payment_queries/getPaymentByIdForUser.sql";
import createPaymentQuery from "../db/queries/payment_queries/createPayment.sql";
import { IPayment } from "../models/payment.model.js";
import { AuthenticatedRequest } from "../models/authRequest.model.js";

export const getAllPaymentsForTransactionAndUser = async (req: AuthenticatedRequest, res: Response) => {
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

export const getPaymentByIdForUser = async (req: AuthenticatedRequest, res: Response) => {
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

export const createPayment = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const paymentData: IPayment = req.body;
        await executeTransaction(createPaymentQuery, [paymentData.transaction_id, paymentData.note, paymentData.debt_user, paymentData.credit_user, paymentData.amount]);
        res.status(201).json({ message: "Payment created successfully"});
    }
    catch (error: any) {
        LOG("Error creating payment", true, error);
        res.status(500).json({ error: error.message });
    }
}

export const updatePayment = async (req: AuthenticatedRequest, res: Response) => {
    res.json({ message: "added note" });
}

export const deletePayment = async (req: AuthenticatedRequest, res: Response) => {
    res.json({ message: "Delete payment" });
}