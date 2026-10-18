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

