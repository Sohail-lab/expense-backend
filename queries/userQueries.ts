import { executeQuery, executeTransaction } from "../helper";

export const getCurrentUserDetails = (userId: number) => executeQuery(
    `
    SELECT * FROM users WHERE user_id = ?;
    `,
    [userId]
);

export const getCurrentUser = (email: string, password: string) => executeQuery(
    `
    SELECT * FROM users WHERE email = ? AND password = ?;
    `,
    [email, password]
);