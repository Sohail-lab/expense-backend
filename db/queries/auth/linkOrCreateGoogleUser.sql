SET @name = ?, @email = ?, @google_id = ?;
INSERT INTO users (name, email, google_id, password, super_user)
VALUES (@name, @email, @google_id, '', FALSE) AS new_row
ON DUPLICATE KEY UPDATE 
    google_id = COALESCE(users.google_id, new_row.google_id);
SELECT user_id
FROM users
WHERE email = @email;