INSERT INTO expense_groups (group_id, name, user_id, group_code, created_at, created_by)
SELECT group_id, name, ?, group_code, created_at, created_by
FROM expense_groups
WHERE group_code = ?
LIMIT 1;