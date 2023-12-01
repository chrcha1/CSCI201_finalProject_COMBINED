CREATE SCHEMA SmartScheduler;

-- Create the `users` table
CREATE TABLE SmartScheduler.users (
    id VARCHAR(36) PRIMARY KEY DEFAULT (uuid()),
    username VARCHAR(50),
    password VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create the `events` table
CREATE TABLE SmartScheduler.events (
    id VARCHAR(36) PRIMARY KEY DEFAULT (uuid()),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_by VARCHAR(36),
    FOREIGN KEY (created_by) REFERENCES SmartScheduler.users(id)
);


-- Create the `participants` table
CREATE TABLE SmartScheduler.participants (
    user_id VARCHAR(36),
    event_id VARCHAR(36),
    availability JSON,
    FOREIGN KEY (user_id) REFERENCES SmartScheduler.users(id),
    FOREIGN KEY (event_id) REFERENCES SmartScheduler.events(id)
);

