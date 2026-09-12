import { db } from "./db";

export const LOG = (message: string, error?: boolean | false, ...optionalParams: any[]) => {
    console.log(`[${new Date().toISOString()}]${error ? '[ERROR]' : ''} ${message}`, ...optionalParams);
};

export const ErrorResponseDB = (res: any, error: any) => res.status(400).json({
    errorType: "DB_ERROR",
    error: error.message,
    query: error.sql
});;

export const executeTransaction = async (query: string, params?: any[]): Promise<void> => {
    const connection = await db.getConnection();

    try {
        await connection.beginTransaction();

        await connection.query(query, params);

        await connection.commit();

        LOG(`Transaction executed successfully: ${query}`);
    } catch (error) {
        await connection.rollback();
        LOG(`Error executing transaction: ${query}`, true, error);
        throw error;
    } finally {
        connection.release();
    }
}

export const executeQuery = async (query: string, params?: any[]): Promise<any> => {
    const connection = await db.getConnection();
    try {
        const [rows] = await connection.query(query, params);
        LOG(`Query executed successfully: ${query}`);
        return rows;
    }
    catch (error) {
        LOG(`Error executing query: ${query}`, true, error);
        throw error;
    }
    finally {
        connection.release();
    }
}

export const generateUniqueGroupCode = async (length: number = 6): Promise<string> => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#';
    const [existingCodes] = await db.query('SELECT DISTINCT group_code FROM expense_groups;');

    const existingCodeSet = new Set((existingCodes as any[]).map(row => row.group_code));
    let result: string;
    do {
        result = '';

        for (let i = 0; i < length; i++) {
            result += chars.charAt(
                Math.floor(Math.random() * chars.length)
            );
        }
    } while (existingCodeSet.has(result));

    return result;
};