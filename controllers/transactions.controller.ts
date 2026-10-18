import { Request, Response } from "express";
import { executeQuery, executeTransaction, LOG } from "../helpers/helper.js";
import createTransactionQuery from "../db/queries/transaction_queries/createTransaction.sql"
import getTransactionByGroupForUserQuery from "../db/queries/transaction_queries/getTransactionByGroupForUser.sql"
import { TxnData } from "../types/txnData.js";
import { AuthenticatedRequest } from "../models/authRequest.model.js";

export const getTransactionByGroupForUser = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const uid = Number(req.query.uid);
        const groupId = Number(req.query.groupId);
        const rows = await executeQuery(getTransactionByGroupForUserQuery, [groupId, uid, uid]);
        res.status(200).json(rows);
    }
    catch (error: any) {
        LOG("Error fetching transaction for user", true, error);
        res.status(500).json({ error: error.message });
    }
}

export const createTransaction = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const txnData: TxnData = req.body;
        await executeTransaction(createTransactionQuery, [txnData.group_id, txnData.initial_amount, txnData.description, txnData.debt_user, txnData.credit_user, txnData.remaining_amount, txnData.split_transaction]);
        res.json({ message: "Create transaction succeed" });
    } catch (error: any) {
        LOG("Error fetching transaction for user", true, error);
        res.status(500).json({ error: error.message });
    }
}

export const updateTransaction = async (req: AuthenticatedRequest, res: Response) => {
    res.json({ message: "Update transaction succeed" });
}

export const deleteTransaction = async (req: AuthenticatedRequest, res: Response) => {
    res.json({ message: "Delete transaction" });
}