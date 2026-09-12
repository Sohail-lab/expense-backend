import dotenv from 'dotenv';
import mysql from 'mysql2/promise';

dotenv.config();

const host = process.env.LOCAL_DB_HOST!;
const port = process.env.LOCAL_DB_PORT! as unknown as number;
const user = process.env.REMOTE_DB_USER!;
const password = process.env.REMOTE_DB_PASSWORD!;
const database = process.env.REMOTE_DB_NAME!;

for( const [key, value] of Object.entries({ host, port, user, password, database })) {
    if (!value) {
        throw new Error(`Missing environment variable: ${key}`);
    }
}

const db = mysql.createPool({
    host: host,
    port: port,
    user: user,
    password: password,
    database: database,

    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    multipleStatements: true
});

const checkDBConnection = async () => {
    try {
        const result = await db.query('show tables;');
        return result;
    } catch (error) {
        console.error("Error connecting to the database:", error);
        throw error;
    }
};

export { db, checkDBConnection }