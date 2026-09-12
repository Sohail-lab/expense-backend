export const CreateUsersTable: string = `
CREATE TABLE IF NOT EXISTS users
(
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    super_user BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
`;

export const CreateGroupsTable: string = `
CREATE TABLE IF NOT EXISTS expense_groups (
    group_id INT NOT NULL,
    name VARCHAR(200),
    user_id INT NOT NULL,
    group_code VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by INT,
    join_date TIMESTAMP DEFAULT NULL,
    PRIMARY KEY (group_id, user_id)
);
`;

export const CreatePaymentsTable: string = `
CREATE TABLE IF NOT EXISTS payments (
    payment_id INT AUTO_INCREMENT PRIMARY KEY,
    transaction_id INT NOT NULL,
    debt_user INT NOT NULL,
    credit_user INT NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CHECK (amount > 0)
);
`;

export const CreateTransactionsTable: string = `
CREATE TABLE IF NOT EXISTS transactions (
    transaction_id INT,
    group_id INT NOT NULL,
    initial_amount DECIMAL(10, 2) NOT NULL,
    description VARCHAR(255),
    debt_user INT NOT NULL,
    credit_user INT NOT NULL,
    remaining_amount DECIMAL(10, 2) NOT NULL,
    split_transaction Boolean NOT NULL DEFAULT FALSE,
    payments_till_now INT NOT NULL DEFAULT 0,
    settlement_status ENUM('pending', 'settled') NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (transaction_id, debt_user, credit_user),

    CHECK (debt_user <> credit_user),
    CHECK (initial_amount > 0),
    CHECK (remaining_amount >= 0)
);
`;