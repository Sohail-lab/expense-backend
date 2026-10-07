import { executeQuery, executeTransaction } from '../../infrastructure/database/helper.js';

export class UserModel {
    async getUserIdByEmail(email: string) {
        return await executeQuery(
            `SELECT user_id FROM users WHERE email = ?;`,
            [email]
        );
    }

    async getUserDetails(userId: number) {
        return await executeQuery(
            `SELECT * FROM users WHERE user_id = ?;`,
            [userId]
        );
    }

    async createUser(name: string, email: string, password: string) {
        return await executeTransaction(
            `INSERT INTO users (name, email, password, super_user) VALUES (?, ?, ?, FALSE);`,
            [name, email, password]
        );
    }

    async updateUser(userId: number, name: string, password: string) {
        await executeTransaction(
            `UPDATE users SET name = ?, password = ? WHERE user_id = ?;`,
            [name, password, userId]
        );
    }

    async deleteUser(userId: number) {
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
    }

    async isSuperUser(userId: number) {
        const users = await executeQuery(
            `SELECT IF(super_user = 1, TRUE, FALSE) as is_super_user FROM users WHERE user_id = ?;`,
            [userId]
        );

        return users && users.length > 0 && Object.values(users[0])[0] === 1;
    }
}
