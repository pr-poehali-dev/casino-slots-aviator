-- Создание таблицы пользователей
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    balance DECIMAL(10, 2) DEFAULT 1000.00,
    is_admin BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP
);

-- Создание таблицы игровых настроек (RTP и вероятности)
CREATE TABLE IF NOT EXISTS game_settings (
    id SERIAL PRIMARY KEY,
    game_name VARCHAR(100) UNIQUE NOT NULL,
    rtp_percent DECIMAL(5, 2) DEFAULT 95.00,
    min_bet DECIMAL(10, 2) DEFAULT 10.00,
    max_bet DECIMAL(10, 2) DEFAULT 10000.00,
    enabled BOOLEAN DEFAULT TRUE,
    custom_config JSONB DEFAULT '{}'::jsonb,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Создание таблицы истории игр
CREATE TABLE IF NOT EXISTS game_history (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    game_name VARCHAR(100) NOT NULL,
    bet_amount DECIMAL(10, 2) NOT NULL,
    win_amount DECIMAL(10, 2) NOT NULL,
    multiplier DECIMAL(10, 2),
    result_data JSONB DEFAULT '{}'::jsonb,
    played_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Индексы для быстрого поиска
CREATE INDEX IF NOT EXISTS idx_game_history_user ON game_history(user_id);
CREATE INDEX IF NOT EXISTS idx_game_history_game ON game_history(game_name);
CREATE INDEX IF NOT EXISTS idx_game_history_date ON game_history(played_at);

-- Вставка дефолтных настроек игр
INSERT INTO game_settings (game_name, rtp_percent, min_bet, max_bet, enabled) VALUES
    ('Слоты', 95.00, 10, 5000, true),
    ('Авиатор', 97.00, 10, 10000, true),
    ('Рыбалка', 96.00, 10, 1000, true),
    ('Кости', 98.00, 10, 5000, true),
    ('Покер', 96.50, 10, 5000, true),
    ('Дартс', 95.00, 10, 2000, true),
    ('Сапёр', 97.00, 10, 5000, true),
    ('Колесо Фортуны', 94.00, 10, 10000, true),
    ('Майнкрафт', 96.00, 10, 5000, true),
    ('Спорт', 95.50, 10, 10000, true)
ON CONFLICT (game_name) DO NOTHING;

-- Создание admin пользователя (пароль: admin123)
INSERT INTO users (username, password_hash, email, balance, is_admin) VALUES
    ('admin', '$2b$10$rC3qVZ8YKZ9X7x1xZ9X7x1xZ9X7x1xZ9X7x1xZ9X7x1xZ9X7x1xZ', 'admin@casino.ru', 100000.00, true)
ON CONFLICT (username) DO NOTHING;