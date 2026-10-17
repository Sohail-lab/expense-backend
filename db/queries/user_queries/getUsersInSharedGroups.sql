SELECT DISTINCT eg2.user_id, u.name
FROM expense_groups eg1
JOIN expense_groups eg2 ON eg1.group_id = eg2.group_id
JOIN users u ON eg2.user_id = u.user_id
WHERE eg1.user_id = ?
AND eg2.user_id != ?;