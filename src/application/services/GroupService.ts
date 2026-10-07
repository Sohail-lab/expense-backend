import { executeQuery, executeTransaction, generateUniqueGroupCode } from '../../infrastructure/database/helper.js';

interface CreateGroupDTO {
    name: string;
    userId: number;
}

export class GroupService {
    /**
     * Get all groups
     */
    async getAllGroups() {
        return await executeQuery(`SELECT * FROM expense_groups;`);
    }

    /**
     * Get groups for a specific user
     */
    async getUserGroups(userId: number) {
        return await executeQuery(
            `SELECT * FROM expense_groups WHERE user_id = ?;`,
            [userId]
        );
    }

    /**
     * Get group by ID
     */
    async getGroupById(groupId: number) {
        const groups = await executeQuery(
            `SELECT * FROM expense_groups WHERE group_id = ?;`,
            [groupId]
        );

        if (!groups || groups.length === 0) {
            throw new Error('Group not found');
        }

        return groups[0];
    }

    /**
     * Create a new group
     */
    async createGroup(data: CreateGroupDTO) {
        const { name, userId } = data;

        if (!name || name.trim().length === 0) {
            throw new Error('Group name is required');
        }

        const groupCode = await generateUniqueGroupCode();

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

        return { message: 'Create group success', joinCode: groupCode };
    }

    /**
     * Join an existing group by group code
     */
    async joinGroup(groupCode: string, userId: number) {
        if (!groupCode) {
            throw new Error('Group code is required');
        }

        const groupData = await executeQuery(
            `SELECT * FROM expense_groups WHERE group_code = ? LIMIT 1;`,
            [groupCode]
        );

        if (!groupData || !groupData[0]) {
            throw new Error(`No group exists with code = ${groupCode}`);
        }

        const { group_id, name, created_at, created_by } = groupData[0];

        await executeTransaction(
            `
            INSERT INTO expense_groups (group_id, name, user_id, group_code, created_at, created_by)
            VALUES (?, ?, ?, ?, ?, ?);
            `,
            [group_id, name, userId, groupCode, created_at, created_by]
        );

        return { message: 'User added to group successfully' };
    }
}
