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