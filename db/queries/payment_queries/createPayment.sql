SET @transaction_id = ?, @note = ?, @debt_user = ?, @credit_user = ?, @amount = ?;
INSERT INTO payments
(transaction_id, note, debt_user, credit_user, amount)
VALUES
(@transaction_id, @note, @debt_user, @credit_user, @amount);
UPDATE transactions
SET settlement_status = CASE
    WHEN remaining_amount = @amount THEN 'settled'
    ELSE 'pending'
END, remaining_amount = remaining_amount - @amount, payments_till_now = payments_till_now + 1
WHERE transaction_id = @transaction_id AND debt_user = @debt_user AND credit_user = @credit_user;