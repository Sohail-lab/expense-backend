import { db } from "../db";
import {
    CreateUsersTable,
    CreateGroupsTable,
    CreateTransactionsTable,
    CreatePaymentsTable
} from "./createInitialTables";
import { LOG } from "../helper";

const getAllTablesQuery = `SHOW TABLES;`;

const TestData = {
    insertTestUsers: `
INSERT INTO users (user_id, name, email, password, super_user)
VALUES
(1, 'Sohail',  'sohail@test.com',  'password1', TRUE),
(2, 'Aman',    'aman@test.com',    'password2', FALSE),
(3, 'Rahul',   'rahul@test.com',   'password3', FALSE),
(4, 'Priya',   'priya@test.com',   'password4', FALSE),
(5, 'Neha',    'neha@test.com',    'password5', FALSE),
(6, 'Arjun',   'arjun@test.com',   'password6', FALSE),
(7, 'Karan',   'karan@test.com',   'password7', FALSE),
(8, 'Ananya',  'ananya@test.com',  'password8', FALSE);
`,
    insertTestGroups: `
INSERT INTO expense_groups
(group_id, name, user_id, group_code, created_by, join_date)
VALUES

-- Group 1
(1, 'Goa Trip', 1, 'GOA2026', 1, '2026-08-01 10:00:00'),
(1, 'Goa Trip', 2, 'GOA2026', 1, '2026-08-01 10:05:00'),
(1, 'Goa Trip', 3, 'GOA2026', 1, '2026-08-01 10:10:00'),
(1, 'Goa Trip', 4, 'GOA2026', 1, '2026-08-01 10:15:00'),

-- Group 2
(2, 'Flat Expenses', 1, 'FLAT2026', 1, '2026-08-05 09:00:00'),
(2, 'Flat Expenses', 3, 'FLAT2026', 1, '2026-08-05 09:05:00'),
(2, 'Flat Expenses', 5, 'FLAT2026', 1, '2026-08-05 09:10:00'),
(2, 'Flat Expenses', 6, 'FLAT2026', 1, '2026-08-05 09:15:00'),

-- Group 3
(3, 'Office Lunch', 2, 'LUNCH2026', 2, '2026-08-10 12:00:00'),
(3, 'Office Lunch', 4, 'LUNCH2026', 2, '2026-08-10 12:05:00'),
(3, 'Office Lunch', 5, 'LUNCH2026', 2, '2026-08-10 12:10:00'),
(3, 'Office Lunch', 7, 'LUNCH2026', 2, '2026-08-10 12:15:00'),
(3, 'Office Lunch', 8, 'LUNCH2026', 2, '2026-08-10 12:20:00'),

-- Group 4
(4, 'Gaming Night', 1, 'GAME2026', 7, '2026-08-15 18:00:00'),
(4, 'Gaming Night', 2, 'GAME2026', 7, '2026-08-15 18:05:00'),
(4, 'Gaming Night', 6, 'GAME2026', 7, '2026-08-15 18:10:00'),
(4, 'Gaming Night', 7, 'GAME2026', 7, '2026-08-15 18:15:00');
`,
    insertTestTransactions: `
INSERT INTO transactions
(transaction_id, group_id, initial_amount, description,
 debt_user, credit_user, remaining_amount,
 split_transaction_id, payments_till_now, settlement_status)
VALUES
(100, 1, 500.00, 'Taxi from airport',
 2, 1, 500.00,
 FALSE, 0, 'pending');

 INSERT INTO transactions
(transaction_id, group_id, initial_amount, description,
 debt_user, credit_user, remaining_amount,
 split_transaction_id, payments_till_now, settlement_status)
VALUES
(101, 1, 800.00, 'Hotel booking',
 3, 1, 500.00,
 FALSE, 1, 'pending');

INSERT INTO transactions
(transaction_id, group_id, initial_amount, description,
 debt_user, credit_user, remaining_amount,
 split_transaction_id, payments_till_now, settlement_status)
VALUES
(102, 1, 1000.00, 'Dinner',
 4, 1, 0.00,
 FALSE, 2, 'settled');

 INSERT INTO transactions
(transaction_id, group_id, initial_amount, description,
 debt_user, credit_user, remaining_amount,
 split_transaction_id, payments_till_now, settlement_status)
VALUES

(103, 1, 1200.00, 'Beach house groceries',
 2, 1, 300.00,
 TRUE, 0, 'pending'),

(103, 1, 1200.00, 'Beach house groceries',
 3, 1, 300.00,
 TRUE, 0, 'pending'),

(103, 1, 1200.00, 'Beach house groceries',
 4, 1, 300.00,
 TRUE, 0, 'pending');

 INSERT INTO transactions
(transaction_id, group_id, initial_amount, description,
 debt_user, credit_user, remaining_amount,
 split_transaction_id, payments_till_now, settlement_status)
VALUES

(104, 1, 2000.00, 'Villa booking',
 1, 2, 0.00,
 TRUE, 1, 'settled'),

(104, 1, 2000.00, 'Villa booking',
 3, 2, 300.00,
 TRUE, 1, 'pending'),

(104, 1, 2000.00, 'Villa booking',
 4, 2, 500.00,
 TRUE, 0, 'pending');

 INSERT INTO transactions
(transaction_id, group_id, initial_amount, description,
 debt_user, credit_user, remaining_amount,
 split_transaction_id, payments_till_now, settlement_status)
VALUES
(105, 2, 1500.00, 'Monthly electricity',
 5, 1, 600.00,
 FALSE, 3, 'pending');

 INSERT INTO transactions
(transaction_id, group_id, initial_amount, description,
 debt_user, credit_user, remaining_amount,
 split_transaction_id, payments_till_now, settlement_status)
VALUES

(106, 2, 2000.00, 'Electricity bill',
 1, 5, 500.00,
 TRUE, 0, 'pending'),

(106, 2, 2000.00, 'Electricity bill',
 3, 5, 500.00,
 TRUE, 0, 'pending'),

(106, 2, 2000.00, 'Electricity bill',
 6, 5, 500.00,
 TRUE, 0, 'pending');

 INSERT INTO transactions
(transaction_id, group_id, initial_amount, description,
 debt_user, credit_user, remaining_amount,
 split_transaction_id, payments_till_now, settlement_status)
VALUES
(107, 2, 750.00, 'Internet bill',
 6, 1, 750.00,
 FALSE, 0, 'pending');

 INSERT INTO transactions
(transaction_id, group_id, initial_amount, description,
 debt_user, credit_user, remaining_amount,
 split_transaction_id, payments_till_now, settlement_status)
VALUES

(108, 2, 1000.00, 'Custom grocery split',
 1, 5, 0.00,
 TRUE, 0, 'settled'),

(108, 2, 1000.00, 'Custom grocery split',
 3, 5, 300.00,
 TRUE, 0, 'pending'),

(108, 2, 1000.00, 'Custom grocery split',
 6, 5, 500.00,
 TRUE, 0, 'pending');

 INSERT INTO transactions
(transaction_id, group_id, initial_amount, description,
 debt_user, credit_user, remaining_amount,
 split_transaction_id, payments_till_now, settlement_status)
VALUES
(109, 3, 600.00, 'Office lunch order',
 8, 7, 600.00,
 FALSE, 0, 'pending');

 INSERT INTO transactions
(transaction_id, group_id, initial_amount, description,
 debt_user, credit_user, remaining_amount,
 split_transaction, payments_till_now, settlement_status)
VALUES

(110, 4, 1800.00, 'Gaming cafe',
 1, 7, 450.00,
 TRUE, 0, 'pending'),

(110, 4, 1800.00, 'Gaming cafe',
 2, 7, 450.00,
 TRUE, 0, 'pending'),

(110, 4, 1800.00, 'Gaming cafe',
 6, 7, 450.00,
 TRUE, 0, 'pending');
`,
    insertTestPayments: `
INSERT INTO payments
(transaction_id, debt_user, credit_user, amount)
VALUES
(101, 3, 1, 300.00);

INSERT INTO payments
(transaction_id, debt_user, credit_user, amount)
VALUES
(102, 4, 1, 400.00),
(102, 4, 1, 600.00);

INSERT INTO payments
(transaction_id, debt_user, credit_user, amount)
VALUES
(104, 1, 2, 500.00),
(104, 3, 2, 200.00);

INSERT INTO payments
(transaction_id, debt_user, credit_user, amount)
VALUES
(105, 5, 1, 200.00),
(105, 5, 1, 300.00),
(105, 5, 1, 400.00);

`
};

export async function createTables(): Promise<any> {
    const connection = await db.getConnection();

    try {
        await connection.beginTransaction();

        await connection.query(CreateUsersTable);
        await connection.query(CreateGroupsTable);
        await connection.query(CreateTransactionsTable);
        await connection.query(CreatePaymentsTable);

        await connection.commit();

        LOG("All tables created successfully");
        return connection.query(getAllTablesQuery);
    } catch (error) {
        await connection.rollback();
        LOG("Error creating tables", true, error);
    } finally {
        connection.release();
    }
}

export async function deleteTables(): Promise<any> {
    const connection = await db.getConnection();

    try {
        await connection.beginTransaction();

        await connection.query('DROP TABLE IF EXISTS payments;');
        await connection.query('DROP TABLE IF EXISTS transactions;');
        await connection.query('DROP TABLE IF EXISTS expense_groups;');
        await connection.query('DROP TABLE IF EXISTS users;');

        await connection.commit();

        LOG("All tables deleted successfully");
        return connection.query(getAllTablesQuery);
    } catch (error) {
        await connection.rollback();
        LOG("Error deleting tables", true, error);
    } finally {
        connection.release();
    }
}

export async function insertTestData(): Promise<any> {
    const connection = await db.getConnection();

    try {
        await connection.beginTransaction();

        await connection.query(TestData.insertTestUsers);
        await connection.query(TestData.insertTestGroups);
        await connection.query(TestData.insertTestTransactions);
        await connection.query(TestData.insertTestPayments);

        await connection.commit();

        LOG("All test data inserted successfully");
        return connection.query(getAllTablesQuery);
    } catch (error) {
        await connection.rollback();
        LOG("Error inserting test data", true, error);
    } finally {
        connection.release();
    }
}