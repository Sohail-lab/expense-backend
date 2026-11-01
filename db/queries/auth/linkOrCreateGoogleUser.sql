INSERT INTO users (name, email, google_id, password, super_user)
VALUES (?, ?, ?, '', FALSE) AS new_row
ON DUPLICATE KEY UPDATE 
    google_id = COALESCE(users.google_id, new_row.google_id);