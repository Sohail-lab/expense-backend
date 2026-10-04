import { executeQuery, executeTransaction } from "../helpers/helper.js";

export const getUserByEmail = (email: number) => executeQuery(
    `
    SELECT * FROM users WHERE email = ?;
    `,
    [email]
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