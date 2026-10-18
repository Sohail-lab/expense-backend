import { Request, Response } from "express";
import { executeQuery, executeTransaction, LOG } from "../helpers/helper.js";
import getCurrentUserIdQuery from "../db/queries/user_queries/getCurrentUserId.sql";
import getCurrentUserDetailsQuery from "../db/queries/user_queries/getCurrentUserDetails.sql";
import getUsersInSharedGroupsQuery from "../db/queries/user_queries/getUsersInSharedGroups.sql";
import updateUserQuery from "../db/queries/user_queries/updateUser.sql";
import deleteUserQuery from "../db/queries/user_queries/deleteUser.sql";
import { AuthenticatedRequest } from "../models/authRequest.model.js";

export const getCurrentUserId = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const email = req.query.email as unknown as string;
        const rows = await executeQuery(getCurrentUserIdQuery, [email]);
        res.status(200).json(rows);
    } catch (error: any) {
        LOG("Error fetching users", true, error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

export const getCurrentUserDetails = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const id = req.params.id as unknown as number;
        const rows = await executeQuery(getCurrentUserDetailsQuery, [id]);
        res.status(200).json(rows);
    } catch (error: any) {
        LOG(`Error fetching user details with id = ${req.params.id}`, true, error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

export const getUsersInSharedGroups = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const id = req.params.id as unknown as number;
        const rows = await executeQuery(getUsersInSharedGroupsQuery, [id, id]);
        res.status(200).json(rows);
    } catch (error: any) {
        LOG("Error fetching users", true, error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

export const updateUser = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const id = req.params.id as unknown as number;
        const newData = req.body;
        await executeTransaction(updateUserQuery, [newData.name, newData.password, id]);
        res.status(201).json({ message: "Update user succeeded" });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}

export const deleteUser = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const id = req.params.id as unknown as number;
        const { superUserId } = req.body;
        await executeTransaction(deleteUserQuery, [id]);
        res.status(200).json({ message: `Deleted user ${id}` });
    } catch (error: any) {
        res.status(403).json({ error: error.message });
    }
}