import { executeQuery, executeTransaction } from "../helper.js";

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
    SET @next_group_id = (
        SELECT IFNULL(MAX(group_id), 0) + 1
        FROM expense_groups
    );
    INSERT INTO expense_groups (group_id, name, user_id, group_code, created_by)
    VALUES
    (@next_group_id, ?, ?, ?, ?);
    `,
    [name, userId, groupCode, userId]
);

export const getGroupCodes = () => executeQuery(
    `
    SELECT DISTINCT group_code FROM expense_groups;
    `
);

export const joinGroup = async (groupCode: string, userId: number) => {
    const groupData = await executeQuery(
        `
        SELECT * FROM expense_groups
        WHERE group_code = ?
        LIMIT 1;
        `,
        [groupCode]
    );
    if(!groupData[0]) {
        throw new Error(`No group exists with code = ${groupCode}`)
    }
    const { group_id, name, created_at, created_by } = groupData[0];
    await executeTransaction(
        `
        INSERT INTO expense_groups (group_id, name, user_id, group_code, created_at, created_by)
        VALUES
        (?, ?, ?, ?, ?, ?);
        `,
        [group_id, name, userId, groupCode, created_at, created_by]
    );
};