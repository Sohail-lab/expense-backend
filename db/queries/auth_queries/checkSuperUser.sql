SELECT IF(super_user = 1, TRUE, FALSE)
FROM users
WHERE user_id = ?;