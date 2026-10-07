import { executeQuery, executeTransaction } from '../../infrastructure/database/helper.js';

interface CreateUserDTO {
    name: string;
    email: string;
    password: string;
}

interface UpdateUserDTO {
    name?: string;
    password?: string;
}

export class UserService {
    /**
     * Get user details by ID
     */
    async getUserDetails(userId: number) {
        const users = await executeQuery(
            `SELECT * FROM users WHERE user_id = ?;`,
            [userId]
        );

        if (!users || users.length === 0) {
            throw new Error('User not found');
        }

        return users[0];
    }

    /**
     * Get user ID by email
     */
    async getUserIdByEmail(email: string) {
        const users = await executeQuery(
            `SELECT user_id FROM users WHERE email = ?;`,
            [email]
        );

        return users;
    }

    /**
     * Create a new user
     */
    async createUser(data: CreateUserDTO) {
        const { name, email, password } = data;

        // Validate input
        if (!email.includes('@')) {
            throw new Error('Invalid email format');
        }

        // Check if email already exists
        const existingUsers = await executeQuery(
            `SELECT user_id FROM users WHERE email = ?;`,
            [email]
        );

        if (existingUsers && existingUsers.length > 0) {
            throw new Error('Email already registered');
        }

        // Create user
        const result = await executeTransaction(
            `INSERT INTO users (name, email, password, super_user) VALUES (?, ?, ?, FALSE);`,
            [name, email, password]
        );

        return { message: 'Create user succeeded', result };
    }

    /**
     * Update user details
     */
    async updateUser(userId: number, newData: UpdateUserDTO) {
        const oldData = await executeQuery(
            `SELECT * FROM users WHERE user_id = ?;`,
            [userId]
        );

        if (!oldData || oldData.length === 0) {
            throw new Error('User not found');
        }

        const { name: oldName, password: oldPassword } = oldData[0];
        const { name: newName, password: newPassword } = newData;
        const name = newName ?? oldName;
        const password = newPassword ?? oldPassword;

        await executeTransaction(
            `UPDATE users SET name = ?, password = ? WHERE user_id = ?;`,
            [name, password, userId]
        );

        return { message: 'Update user succeeded' };
    }

    /**
     * Delete user (requires super user authorization)
     */
    async deleteUser(userId: number, authorizedByUserId: number) {
        // Check if authorized user is a super user
        const authorizedUser = await executeQuery(
            `SELECT IF(super_user = 1, TRUE, FALSE) as is_super_user FROM users WHERE user_id = ?;`,
            [authorizedByUserId]
        );

        if (!authorizedUser || authorizedUser.length === 0) {
            throw new Error('Authorized user not found');
        }

        const isSuperUser = Object.values(authorizedUser[0])[0] === 1;
        if (!isSuperUser) {
            throw new Error('User not authorized');
        }

        // Delete user and cascade delete related records
        await executeTransaction(
            `
            SET @user_id = ?;
            DELETE FROM users WHERE user_id = @user_id;
            DELETE FROM transactions WHERE debt_user = @user_id OR credit_user = @user_id;
            DELETE FROM payments WHERE debt_user = @user_id OR credit_user = @user_id;
            DELETE FROM expense_groups WHERE user_id = @user_id;
            `,
            [userId]
        );

        return { message: `Deleted user ${userId}` };
    }
}
