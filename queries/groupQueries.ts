import { executeQuery, executeTransaction } from "../helper";

export const getAllGroups = () => executeQuery(
    `
    SELECT * FROM expense_groups;
    `
);

export const getCurrentUserGroups = (userId: number) => executeQuery(
    `
    SELECT * FROM expense_groups WHERE user_id = ?;
    `,
    [userId]
);

export const getGroupById = (groupId: number) => executeQuery(
    `
    SELECT * FROM expense_groups WHERE group_id = ?;
    `,
    [groupId]
);

export const getGroupTransactions = (groupId: number, userId: number) => executeQuery(
    `
    SELECT * FROM transactions WHERE group_id = ? AND (debt_user = ? OR credit_user = ?);
    `,
    [groupId, userId, userId]
);

export const createGroup = (name: string, userId: number, groupCode: string) => executeTransaction(
    `
    INSERT INTO expense_groups (group_id, name, user_id, group_code, created_by)
    VALUES
    ((SELECT IFNULL(MAX(group_id), 0) + 1 FROM expense_groups), ?, ?, ?, ?);
    `,
    [name, userId, groupCode, userId]
);

export const getGroupCodes = () => executeQuery(
    `
    SELECT DISTINCT group_code FROM expense_groups;
    `
);