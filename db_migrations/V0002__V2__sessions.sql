CREATE TABLE IF NOT EXISTS t_p77058165_dayz_server_platform.sessions (
  id VARCHAR(64) PRIMARY KEY,
  user_id INT REFERENCES t_p77058165_dayz_server_platform.users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP DEFAULT NOW() + INTERVAL '30 days'
);