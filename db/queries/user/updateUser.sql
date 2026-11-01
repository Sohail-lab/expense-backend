UPDATE users
SET 
    name = COALESCE(?, name),
    password = COALESCE(?, password)
WHERE user_id = ?