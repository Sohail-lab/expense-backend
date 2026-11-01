SET @name = ?, @email = ?, @googleId = ?;
INSERT INTO users (name, email, google_id, password, super_user)
VALUES (@name, @email, @googleId, '', FALSE)
ON DUPLICATE KEY UPDATE 
    google_id = COALESCE(users.google_id, @googleId);
SELECT user_id
FROM users
WHERE email = @email;