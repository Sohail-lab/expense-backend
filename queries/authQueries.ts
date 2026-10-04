import { executeQuery, executeTransaction } from "../helpers/helper.js";

export const getUserByEmail = (email: string) => executeQuery(
    `
    SELECT * FROM users WHERE email = ?;
    `,
    [email]
);

export const getUserByGoogleId = (googleId: string) => executeQuery(
    `SELECT * FROM users WHERE google_id = ?;`,
    [googleId]
);

export const updateUserGoogleId = (userId: number, googleId: string) => executeQuery(
    `UPDATE users SET google_id = ? WHERE user_id = ?;`,
    [googleId, userId]
);

export const updateUserSession = async (
    userId: number,
    sessionId: string | null,
    expiresAt: Date | null
) => {
    await executeQuery(
        `
        UPDATE users
        SET session_id = ?,
            session_expires_at = ?
        WHERE user_id = ?
        `,
        [
            sessionId,
            expiresAt,
            userId
        ]
    );
};