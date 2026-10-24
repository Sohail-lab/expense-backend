SET @next_transaction_id = (
    SELECT IFNULL(MAX(transaction_id), 0) + 1
    FROM transactions
);
INSERT INTO transactions
(transaction_id, group_id, initial_amount, description, debt_user, credit_user, remaining_amount, split_transaction)
VALUES
(@next_transaction_id, ?, ?, ?, ?, ?, ?, ?);