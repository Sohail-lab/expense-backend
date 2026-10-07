import { executeQuery, executeTransaction } from '../../infrastructure/database/helper.js';

export class GroupModel {
    async getAllGroups() {
        return await executeQuery(`SELECT * FROM expense_groups;`);
    }

    async getUserGroups(userId: number) {
        return await executeQuery(
            `SELECT * FROM expense_groups WHERE user_id = ?;`,
            [userId]
        );
    }

    async createGroup(name: string, userId: number, groupCode: string) {
        await executeTransaction(
            `
            SET @next_group_id = (
                SELECT IFNULL(MAX(group_id), 0) + 1
                FROM expense_groups
            );
            INSERT INTO expense_groups (group_id, name, user_id, group_code, created_by)
            VALUES (@next_group_id, ?, ?, ?, ?);
            `,
            [name, userId, groupCode, userId]
        );
    }

    async getGroupByCode(groupCode: string) {
        return await executeQuery(
            `SELECT * FROM expense_groups WHERE group_code = ? LIMIT 1;`,
            [groupCode]
        );
    }

    async addUserToGroup(groupId: number, groupName: string, userId: number, groupCode: string, createdAt: Date, createdBy: number) {
        await executeTransaction(
            `
            INSERT INTO expense_groups (group_id, name, user_id, group_code, created_at, created_by)
            VALUES (?, ?, ?, ?, ?, ?);
            `,
            [groupId, groupName, userId, groupCode, createdAt, createdBy]
        );
    }
}
