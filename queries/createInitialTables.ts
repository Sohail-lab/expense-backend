export const CreateUsersTable: string = `
CREATE TABLE IF NOT EXISTS users
(
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    google_id VARCHAR(255) UNIQUE,
    password VARCHAR(255) NOT NULL,
    super_user BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    session_id VARCHAR(255) UNIQUE,
    session_expires_at DATETIME
);
`;

// ALTER TABLE transactions ADD CONSTRAINT fk_transactions_debt_user 
//     FOREIGN KEY (debt_user) REFERENCES users(user_id) ON DELETE CASCADE;

// ALTER TABLE transactions ADD CONSTRAINT fk_transactions_credit_user 
//     FOREIGN KEY (credit_user) REFERENCES users(user_id) ON DELETE CASCADE;

// ALTER TABLE payments ADD CONSTRAINT fk_payments_transaction 
//     FOREIGN KEY (transaction_id) REFERENCES transactions(transaction_id) ON DELETE CASCADE;

// ALTER TABLE expense_groups ADD CONSTRAINT fk_groups_user 
//     FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE;

export const CreateGroupsTable: string = `
CREATE TABLE IF NOT EXISTS expense_groups (
    group_id INT NOT NULL,
    name VARCHAR(200),
    user_id INT NOT NULL,
    group_code VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by INT,
    join_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (group_id, user_id),
    CONSTRAINT fk_groups_user 
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);
`;

export const CreatePaymentsTable: string = `
CREATE TABLE IF NOT EXISTS payments (
    payment_id INT AUTO_INCREMENT PRIMARY KEY,
    transaction_id INT NOT NULL,
    note VARCHAR(255),
    debt_user INT NOT NULL,
    credit_user INT NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CHECK (amount > 0),
    CONSTRAINT fk_payments_transaction 
    FOREIGN KEY (transaction_id) REFERENCES transactions(transaction_id) ON DELETE CASCADE
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
    notification_status ENUM('positive', 'negative') NOT NULL DEFAULT 'negative',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (transaction_id, debt_user, credit_user),

    CHECK (debt_user <> credit_user),
    CHECK (initial_amount > 0),
    CHECK (remaining_amount >= 0),
    CHECK (remaining_amount <= initial_amount),
    CONSTRAINT fk_transactions_debt_user 
    FOREIGN KEY (debt_user) REFERENCES users(user_id) ON DELETE CASCADE,
    CONSTRAINT fk_transactions_credit_user 
    FOREIGN KEY (credit_user) REFERENCES users(user_id) ON DELETE CASCADE,
    CONSTRAINT fk_transactions_group
    FOREIGN KEY (group_id) REFERENCES expense_groups(group_id) ON DELETE CASCADE
);
`;