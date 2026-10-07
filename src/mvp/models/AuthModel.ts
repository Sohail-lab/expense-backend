import { executeQuery, executeTransaction } from '../../infrastructure/database/helper.js';

export class AuthModel {
    async findUserByEmail(email: string) {
        return await executeQuery(
            `SELECT * FROM users WHERE email = ?;`,
            [email]
        );
    }

    async findUserByGoogleId(googleId: string) {
        return await executeQuery(
            `SELECT * FROM users WHERE google_id = ?;`,
            [googleId]
        );
    }

    async updateUserSession(userId: number, sessionId: string | null, expiresAt: Date | null) {
        await executeQuery(
            `
            UPDATE users
            SET session_id = ?,
                session_expires_at = ?
            WHERE user_id = ?
            `,
            [sessionId, expiresAt, userId]
        );
    }

    async createGoogleUser(name: string, email: string, googleId: string) {
        await executeTransaction(
            `INSERT INTO users (name, email, google_id, password, super_user) VALUES (?, ?, ?, '', FALSE);`,
            [name, email, googleId]
        );
    }

    async linkGoogleIdToUser(userId: number, googleId: string) {
        await executeQuery(
            `UPDATE users SET google_id = ? WHERE user_id = ?;`,
            [googleId, userId]
        );
    }
}
