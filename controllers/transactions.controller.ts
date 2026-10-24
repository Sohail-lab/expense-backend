import { Response } from "express";
import { executeQuery, executeTransaction, LOG } from "../helpers/helper.js";
import createTransactionQuery from "../db/queries/transaction_queries/createTransaction.sql";
import getTransactionByGroupForUserQuery from "../db/queries/transaction_queries/getTransactionByGroupForUser.sql";
import { AuthenticatedRequest } from "../models/authRequest.model.js";
import { ITransaction } from "../models/transaction.model.js";
import { listTransactionDetails, showMessage } from "../views/transaction.view.js";

export const getTransactionByGroupForUser = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  try {
    const uid = Number(req.query.uid);
    const groupId = Number(req.query.groupId);
    const rows: ITransaction[] = await executeQuery(getTransactionByGroupForUserQuery, [
      groupId,
      uid,
      uid,
    ]);
    res.status(200).json(listTransactionDetails(rows));
  } catch (error: any) {
    LOG("Error fetching transaction for user", true, error);
    res.status(500).json({ error: error.message });
  }
};

export const createTransaction = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  try {
    const txnData: ITransaction = req.body;
    await executeTransaction(createTransactionQuery, [
      txnData.group_id,
      txnData.initial_amount,
      txnData.description ?? null,
      txnData.debt_user,
      txnData.credit_user,
      txnData.remaining_amount,
      txnData.split_transaction,
    ]);
    res.json(showMessage("Create transaction succeed"));
  } catch (error: any) {
    LOG("Error fetching transaction for user", true, error);
    res.status(500).json({ error: error.message });
  }
};

export const updateTransaction = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  res.json(showMessage("Update transaction"));
};

export const deleteTransaction = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  res.json(showMessage("Delete transaction"));
};
