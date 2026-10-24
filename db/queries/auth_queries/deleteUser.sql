SET @user_id = ?;
    DELETE FROM users
    WHERE user_id = @user_id;
    DELETE FROM transactions
    WHERE debt_user = @user_id or credit_user = @user_id;
    DELETE FROM payments
    WHERE debt_user = @user_id or credit_user = @user_id;
    DELETE FROM expense_groups
    WHERE user_id = @user_id;