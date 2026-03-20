-- MJQbe WEB — Script d'initialisation de la base de données
-- Exécuté automatiquement au premier démarrage du container PostgreSQL

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Table des utilisateurs
CREATE TABLE IF NOT EXISTS users (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username      VARCHAR(100) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role          VARCHAR(20) NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin'))
);

-- Table des catégories
CREATE TABLE IF NOT EXISTS categories (
  id   SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  mode VARCHAR(20)  NOT NULL CHECK (mode IN ('TV', 'Desktop'))
);

-- Table des applications
CREATE TABLE IF NOT EXISTS apps (
  id          SERIAL PRIMARY KEY,
  name        VARCHAR(100) NOT NULL,
  icon        TEXT,
  url         TEXT NOT NULL,
  category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
  mode        VARCHAR(20) NOT NULL CHECK (mode IN ('TV', 'Desktop')),
  is_external BOOLEAN NOT NULL DEFAULT FALSE
);

-- Table des settings utilisateur
CREATE TABLE IF NOT EXISTS settings (
  id            SERIAL PRIMARY KEY,
  user_id       UUID UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  theme         VARCHAR(20) NOT NULL DEFAULT 'dark',
  mode          VARCHAR(20) NOT NULL DEFAULT 'TV',
  layout        VARCHAR(20) NOT NULL DEFAULT 'grid',
  icon_size     VARCHAR(20) NOT NULL DEFAULT 'medium',
  selected_apps JSONB
);

-- Données de démo : catégories
INSERT INTO categories (name, mode) VALUES
  ('Streaming',    'TV'),
  ('Gaming',       'TV'),
  ('Productivité', 'Desktop'),
  ('Outils Dev',   'Desktop')
ON CONFLICT DO NOTHING;

-- Données de démo : applications
INSERT INTO apps (name, icon, url, category_id, mode, is_external) VALUES
  ('YouTube',    'https://www.youtube.com/favicon.ico',    'https://youtube.com',    1, 'TV',      TRUE),
  ('Twitch',     'https://static.twitchsvc.net/icons/128px/favicon.png', 'https://twitch.tv', 1, 'TV', TRUE),
  ('Netflix',    'https://www.netflix.com/favicon.ico',    'https://netflix.com',    1, 'TV',      TRUE),
  ('Crunchyroll','https://www.crunchyroll.com/favicon.ico','https://crunchyroll.com',1, 'TV',      TRUE),
  ('Notion',     'https://www.notion.so/favicon.ico',      'https://notion.so',      3, 'Desktop', TRUE),
  ('GitHub',     'https://github.com/favicon.ico',         'https://github.com',     4, 'Desktop', TRUE)
ON CONFLICT DO NOTHING;
