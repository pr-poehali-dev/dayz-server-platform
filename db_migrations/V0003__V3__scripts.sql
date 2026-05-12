CREATE TABLE IF NOT EXISTS t_p77058165_dayz_server_platform.scripts (
  id SERIAL PRIMARY KEY,
  author_id INT REFERENCES t_p77058165_dayz_server_platform.users(id),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  content TEXT,
  category VARCHAR(50) NOT NULL DEFAULT 'other',
  type VARCHAR(20) NOT NULL DEFAULT 'script',
  version VARCHAR(20) DEFAULT '1.0.0',
  is_vip_only BOOLEAN DEFAULT FALSE,
  is_approved BOOLEAN DEFAULT TRUE,
  downloads INT DEFAULT 0,
  rating_sum INT DEFAULT 0,
  rating_count INT DEFAULT 0,
  file_url TEXT,
  tags TEXT[],
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);