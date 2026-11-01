SET @name = ?, 
    @email = ?, 
    @google_id = ?;
INSERT INTO users (name, email, google_id, password, super_user)
VALUES (@name, @email, @google_id, '', FALSE)
ON DUPLICATE KEY UPDATE 
    google_id = COALESCE(google_id, VALUES(google_id));
SELECT user_id
FROM users
WHERE google_id = @google_id;