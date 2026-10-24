CREATE TABLE IF NOT EXISTS expense_groups (
    group_id INT NOT NULL,
    name VARCHAR(200),
    user_id INT NOT NULL,
    group_code VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by INT,
    join_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (group_id, user_id),
    CONSTRAINT fk_groups_user 
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);