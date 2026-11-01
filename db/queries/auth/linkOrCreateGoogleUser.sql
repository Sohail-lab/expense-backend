SET @name = ?, @email = ?, @google_id = ?;
INSERT INTO users (name, email, google_id, password, super_user)
VALUES (@name, @email, @google_id, '', FALSE)
ON DUPLICATE KEY UPDATE 
    google_id = COALESCE(users.google_id, @google_id);
SELECT user_id
FROM users
WHERE email = @email;