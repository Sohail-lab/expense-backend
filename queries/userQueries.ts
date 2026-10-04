import { executeQuery, executeTransaction } from "../helpers/helper.js";

export const getCurrentUserDetails = (userId: number) => executeQuery(
    `
    SELECT * FROM users WHERE user_id = ?;
    `,
    [userId]
);

export const getCurrentUserId = (email: string, password: string) => executeQuery(
    `
    SELECT user_id FROM users WHERE email = ? AND password = ?;
    `,
    [email, password]
);

export const createUser = (userName: string, email: string, password: string) => executeTransaction(
    `
    INSERT INTO users (name, email, password, super_user)
    VALUES
    (?,  ?,  ?, FALSE);
    `,
    [userName, email, password]
);

export const updateUser = async (userId: number, newData: any) => {
    const oldData = await executeQuery(
        `
        SELECT *
        FROM users
        WHERE user_id = ?
        `,
        [userId]
    );
    const { name: oldName, password: oldPassword } = oldData[0];
    const { name: newName, password: newPassword } = newData;
    const name = newName ?? oldName;
    const password = newPassword ?? oldPassword;

    executeTransaction(
        `
        UPDATE users
        SET name = ?, password = ?
        WHERE user_id = ?
        `,
        [name, password, userId]
    );
};

export const deleteUser = async (userId: number, superUserId: number) => {
    const result = await executeQuery(
        `
        SELECT IF(super_user = 1, TRUE, FALSE)
        FROM users
        WHERE user_id = ?;
        `,
        [superUserId]
    );
    const isAuthorized = Object.values(result[0])[0] === 1 ? true : false;
    if (!isAuthorized) {
        throw new Error("User not authorized");
    }
    executeTransaction(
        `
    SET @user_id = ?;
    DELETE FROM users
    WHERE user_id = @user_id;
    DELETE FROM transactions
    WHERE debt_user = @user_id or credit_user = @user_id;
    DELETE FROM payments
    WHERE debt_user = @user_id or credit_user = @user_id;
    DELETE FROM expense_groups
    WHERE user_id = @user_id;
    `,
        [userId]
    );
}