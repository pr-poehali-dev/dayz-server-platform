CREATE TABLE IF NOT EXISTS t_p77058165_dayz_server_platform.script_ratings (
  id SERIAL PRIMARY KEY,
  script_id INT REFERENCES t_p77058165_dayz_server_platform.scripts(id),
  user_id INT REFERENCES t_p77058165_dayz_server_platform.users(id),
  rating INT CHECK (rating >= 1 AND rating <= 5),
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(script_id, user_id)
);

CREATE TABLE IF NOT EXISTS t_p77058165_dayz_server_platform.forum_categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  icon VARCHAR(50) DEFAULT 'MessageSquare',
  order_num INT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS t_p77058165_dayz_server_platform.forum_topics (
  id SERIAL PRIMARY KEY,
  category_id INT REFERENCES t_p77058165_dayz_server_platform.forum_categories(id),
  author_id INT REFERENCES t_p77058165_dayz_server_platform.users(id),
  title VARCHAR(255) NOT NULL,
  body TEXT NOT NULL,
  is_pinned BOOLEAN DEFAULT FALSE,
  is_locked BOOLEAN DEFAULT FALSE,
  views INT DEFAULT 0,
  replies_count INT DEFAULT 0,
  last_reply_at TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS t_p77058165_dayz_server_platform.forum_replies (
  id SERIAL PRIMARY KEY,
  topic_id INT REFERENCES t_p77058165_dayz_server_platform.forum_topics(id),
  author_id INT REFERENCES t_p77058165_dayz_server_platform.users(id),
  body TEXT NOT NULL,
  is_best_answer BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS t_p77058165_dayz_server_platform.servers (
  id SERIAL PRIMARY KEY,
  owner_id INT REFERENCES t_p77058165_dayz_server_platform.users(id),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  ip VARCHAR(100),
  port INT,
  map VARCHAR(100) DEFAULT 'Chernarus',
  max_players INT DEFAULT 64,
  current_players INT DEFAULT 0,
  is_modded BOOLEAN DEFAULT FALSE,
  is_verified BOOLEAN DEFAULT FALSE,
  logo_url TEXT,
  website_url TEXT,
  discord_url TEXT,
  ad_expires_at TIMESTAMP,
  ad_boost INT DEFAULT 0,
  votes INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS t_p77058165_dayz_server_platform.server_votes (
  id SERIAL PRIMARY KEY,
  server_id INT REFERENCES t_p77058165_dayz_server_platform.servers(id),
  user_id INT REFERENCES t_p77058165_dayz_server_platform.users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(server_id, user_id)
);

CREATE TABLE IF NOT EXISTS t_p77058165_dayz_server_platform.messages (
  id SERIAL PRIMARY KEY,
  sender_id INT REFERENCES t_p77058165_dayz_server_platform.users(id),
  receiver_id INT REFERENCES t_p77058165_dayz_server_platform.users(id),
  subject VARCHAR(255),
  body TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS t_p77058165_dayz_server_platform.achievements (
  id SERIAL PRIMARY KEY,
  code VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  icon VARCHAR(20) DEFAULT '🏆',
  points INT DEFAULT 10
);

CREATE TABLE IF NOT EXISTS t_p77058165_dayz_server_platform.user_achievements (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES t_p77058165_dayz_server_platform.users(id),
  achievement_id INT REFERENCES t_p77058165_dayz_server_platform.achievements(id),
  earned_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, achievement_id)
);

CREATE TABLE IF NOT EXISTS t_p77058165_dayz_server_platform.notifications (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES t_p77058165_dayz_server_platform.users(id),
  type VARCHAR(50) NOT NULL,
  title VARCHAR(255) NOT NULL,
  body TEXT,
  link TEXT,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);