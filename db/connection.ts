import mysql from 'mysql2/promise';
import { db_host, db_name, db_password, db_port, db_user } from '../src/config';

const db = mysql.createPool({
    host: db_host,
    port: db_port,
    user: db_user,
    password: db_password,
    database: db_name,

    waitForConnections: true,
    connectionLimit: 15,
    queueLimit: 0,
    multipleStatements: true,
    connectAttributes: {
        isolation_level: 'REPEATABLE-READ'
    }
});

// const checkDBConnection = async () => {
//     try {
//         const result = await db.query('show tables;');
//         return result;
//     } catch (error) {
//         console.error("Error connecting to the database:", error);
//         throw error;
//     }
// };

export { db }