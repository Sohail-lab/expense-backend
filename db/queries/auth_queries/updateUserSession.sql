UPDATE users
SET session_id = ?,
    session_expires_at = ?
    WHERE user_id = ?