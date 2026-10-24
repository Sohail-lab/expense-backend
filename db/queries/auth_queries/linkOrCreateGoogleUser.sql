INSERT INTO users (name, email, google_id, password, super_user)
VALUES (?, ?, ?, NULL, FALSE)
ON DUPLICATE KEY UPDATE 
    google_id = COALESCE(google_id, VALUES(google_id));