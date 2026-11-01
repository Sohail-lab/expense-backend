SET @next_group_id = (
    SELECT IFNULL(MAX(group_id), 0) + 1
    FROM expense_groups
);
INSERT INTO expense_groups (group_id, name, user_id, group_code, created_by)
VALUES
(@next_group_id, ?, ?, ?, ?);