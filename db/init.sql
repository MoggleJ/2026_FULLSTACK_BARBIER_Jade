-- MJQbe WEB — Script d'initialisation de la base de données
-- Exécuté automatiquement au premier démarrage du container PostgreSQL

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ── Tables ────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS users (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username      VARCHAR(100) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role          VARCHAR(20) NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin'))
);

CREATE TABLE IF NOT EXISTS categories (
  id   SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  mode VARCHAR(20)  NOT NULL CHECK (mode IN ('TV', 'Desktop'))
);

CREATE TABLE IF NOT EXISTS apps (
  id          SERIAL PRIMARY KEY,
  name        VARCHAR(100) NOT NULL,
  icon        TEXT,
  url         TEXT NOT NULL,
  category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
  mode        VARCHAR(20) NOT NULL CHECK (mode IN ('TV', 'Desktop')),
  is_external BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS settings (
  id            SERIAL PRIMARY KEY,
  user_id       UUID UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  theme         VARCHAR(20) NOT NULL DEFAULT 'dark',
  mode          VARCHAR(20) NOT NULL DEFAULT 'TV',
  layout        VARCHAR(20) NOT NULL DEFAULT 'grid',
  icon_size     JSONB NOT NULL DEFAULT '{"TV":"medium","Desktop":"medium"}',
  selected_apps JSONB
);

CREATE TABLE IF NOT EXISTS favorites (
  id      SERIAL PRIMARY KEY,
  user_id UUID    NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  app_id  INTEGER NOT NULL REFERENCES apps(id)  ON DELETE CASCADE,
  UNIQUE (user_id, app_id)
);

CREATE TABLE IF NOT EXISTS logs (
  id         SERIAL PRIMARY KEY,
  user_id    UUID         REFERENCES users(id) ON DELETE SET NULL,
  action     VARCHAR(50)  NOT NULL,
  metadata   JSONB,
  created_at TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS oauth_accounts (
  id          SERIAL PRIMARY KEY,
  user_id     UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  provider    VARCHAR(20) NOT NULL,
  provider_id VARCHAR(200) NOT NULL,
  UNIQUE (provider, provider_id)
);

-- ── Catégories ────────────────────────────────────────────────────────────────

INSERT INTO categories (name, mode) VALUES
  -- TV
  ('Streaming',   'TV'),
  ('Gaming',      'TV'),
  ('Sports',      'TV'),
  ('Actualités',  'TV'),
  ('Musique',     'TV'),
  -- Desktop
  ('Productivité','Desktop'),
  ('Outils Dev',  'Desktop'),
  ('Design',      'Desktop'),
  ('Navigateurs', 'Desktop'),
  ('Mes Apps',    'Desktop')
ON CONFLICT DO NOTHING;

-- ── Applications TV ───────────────────────────────────────────────────────────

-- Streaming
INSERT INTO apps (name, icon, url, category_id, mode, is_external)
SELECT name, icon, url,
       (SELECT id FROM categories WHERE name = 'Streaming' AND mode = 'TV'),
       'TV', TRUE
FROM (VALUES
  ('YouTube',     'https://www.google.com/s2/favicons?domain=youtube.com&sz=128',     'https://www.youtube.com'),
  ('Twitch',      'https://www.google.com/s2/favicons?domain=twitch.tv&sz=128',       'https://www.twitch.tv'),
  ('Netflix',     'https://www.google.com/s2/favicons?domain=netflix.com&sz=128',     'https://www.netflix.com'),
  ('Disney+',     'https://www.google.com/s2/favicons?domain=disneyplus.com&sz=128',  'https://www.disneyplus.com'),
  ('Prime Video', 'https://www.google.com/s2/favicons?domain=primevideo.com&sz=128',  'https://www.primevideo.com'),
  ('Canal+',      'https://www.google.com/s2/favicons?domain=canalplus.com&sz=128',   'https://www.canalplus.com'),
  ('TF1+',        'https://www.google.com/s2/favicons?domain=tf1.fr&sz=128',          'https://www.tf1.fr'),
  ('France.tv',   'https://www.google.com/s2/favicons?domain=france.tv&sz=128',       'https://www.france.tv'),
  ('M6+',         'https://www.google.com/s2/favicons?domain=6play.fr&sz=128',        'https://www.6play.fr'),
  ('Arte.tv',     'https://www.google.com/s2/favicons?domain=arte.tv&sz=128',         'https://www.arte.tv'),
  ('Crunchyroll', 'https://www.google.com/s2/favicons?domain=crunchyroll.com&sz=128', 'https://www.crunchyroll.com')
) AS t(name, icon, url);

-- Sports
INSERT INTO apps (name, icon, url, category_id, mode, is_external)
SELECT name, icon, url,
       (SELECT id FROM categories WHERE name = 'Sports' AND mode = 'TV'),
       'TV', TRUE
FROM (VALUES
  ('beIN SPORTS', 'https://www.google.com/s2/favicons?domain=beinsports.com&sz=128',     'https://www.beinsports.com'),
  ('RMC Sport',   'https://www.google.com/s2/favicons?domain=rmcsport.bfmtv.com&sz=128', 'https://rmcsport.bfmtv.com'),
  ('Eurosport',   'https://www.google.com/s2/favicons?domain=eurosport.fr&sz=128',       'https://www.eurosport.fr'),
  ('L''Équipe',   'https://www.google.com/s2/favicons?domain=lequipe.fr&sz=128',         'https://www.lequipe.fr')
) AS t(name, icon, url);

-- Actualités
INSERT INTO apps (name, icon, url, category_id, mode, is_external)
SELECT name, icon, url,
       (SELECT id FROM categories WHERE name = 'Actualités' AND mode = 'TV'),
       'TV', TRUE
FROM (VALUES
  ('BFMTV',       'https://www.google.com/s2/favicons?domain=bfmtv.com&sz=128',        'https://www.bfmtv.com'),
  ('France Info',  'https://www.google.com/s2/favicons?domain=francetvinfo.fr&sz=128',  'https://www.francetvinfo.fr'),
  ('Le Monde',     'https://www.google.com/s2/favicons?domain=lemonde.fr&sz=128',       'https://www.lemonde.fr'),
  ('Le Figaro',    'https://www.google.com/s2/favicons?domain=lefigaro.fr&sz=128',      'https://www.lefigaro.fr')
) AS t(name, icon, url);

-- Musique
INSERT INTO apps (name, icon, url, category_id, mode, is_external)
SELECT name, icon, url,
       (SELECT id FROM categories WHERE name = 'Musique' AND mode = 'TV'),
       'TV', TRUE
FROM (VALUES
  ('Spotify', 'https://www.google.com/s2/favicons?domain=spotify.com&sz=128',    'https://open.spotify.com'),
  ('Deezer',  'https://www.google.com/s2/favicons?domain=deezer.com&sz=128',     'https://www.deezer.com')
) AS t(name, icon, url);

-- ── Applications Desktop ──────────────────────────────────────────────────────

-- Outils Dev
INSERT INTO apps (name, icon, url, category_id, mode, is_external)
SELECT name, icon, url,
       (SELECT id FROM categories WHERE name = 'Outils Dev' AND mode = 'Desktop'),
       'Desktop', TRUE
FROM (VALUES
  ('VS Code',  'https://www.google.com/s2/favicons?domain=code.visualstudio.com&sz=128', 'https://code.visualstudio.com'),
  ('Docker',   'https://www.google.com/s2/favicons?domain=docker.com&sz=128',            'https://www.docker.com'),
  ('GitHub',   'https://www.google.com/s2/favicons?domain=github.com&sz=128',            'https://github.com'),
  ('Postman',  'https://www.google.com/s2/favicons?domain=postman.com&sz=128',           'https://www.postman.com')
) AS t(name, icon, url);

-- Design
INSERT INTO apps (name, icon, url, category_id, mode, is_external)
SELECT name, icon, url,
       (SELECT id FROM categories WHERE name = 'Design' AND mode = 'Desktop'),
       'Desktop', TRUE
FROM (VALUES
  ('Figma',      'https://www.google.com/s2/favicons?domain=figma.com&sz=128',       'https://www.figma.com'),
  ('Canva',      'https://www.google.com/s2/favicons?domain=canva.com&sz=128',       'https://www.canva.com'),
  ('Photoshop',  'https://www.google.com/s2/favicons?domain=adobe.com&sz=128',       'https://www.adobe.com/products/photoshop.html')
) AS t(name, icon, url);

-- Productivité
INSERT INTO apps (name, icon, url, category_id, mode, is_external)
SELECT name, icon, url,
       (SELECT id FROM categories WHERE name = 'Productivité' AND mode = 'Desktop'),
       'Desktop', TRUE
FROM (VALUES
  ('Notion',       'https://www.google.com/s2/favicons?domain=notion.so&sz=128',        'https://www.notion.so'),
  ('Slack',        'https://www.google.com/s2/favicons?domain=slack.com&sz=128',        'https://slack.com'),
  ('Discord',      'https://www.google.com/s2/favicons?domain=discord.com&sz=128',      'https://discord.com'),
  ('Trello',       'https://www.google.com/s2/favicons?domain=trello.com&sz=128',       'https://trello.com'),
  ('Doctolib',     'https://www.google.com/s2/favicons?domain=doctolib.fr&sz=128',      'https://www.doctolib.fr'),
  ('Ameli',        'https://www.google.com/s2/favicons?domain=ameli.fr&sz=128',         'https://www.ameli.fr'),
  ('Impots.gouv',  'https://www.google.com/s2/favicons?domain=impots.gouv.fr&sz=128',   'https://www.impots.gouv.fr')
) AS t(name, icon, url);

-- Navigateurs
INSERT INTO apps (name, icon, url, category_id, mode, is_external)
SELECT name, icon, url,
       (SELECT id FROM categories WHERE name = 'Navigateurs' AND mode = 'Desktop'),
       'Desktop', TRUE
FROM (VALUES
  ('Chrome',  'https://www.google.com/s2/favicons?domain=chrome.google.com&sz=128', 'https://www.google.com/chrome'),
  ('Firefox', 'https://www.google.com/s2/favicons?domain=mozilla.org&sz=128',       'https://www.mozilla.org/firefox'),
  ('Edge',    'https://www.google.com/s2/favicons?domain=microsoft.com&sz=128',     'https://www.microsoft.com/edge')
) AS t(name, icon, url);

-- Mes Apps (internes — iframe)
INSERT INTO apps (name, icon, url, category_id, mode, is_external)
SELECT name, icon, url,
       (SELECT id FROM categories WHERE name = 'Mes Apps' AND mode = 'Desktop'),
       'Desktop', FALSE
FROM (VALUES
  ('Gestion Tâches', '/logos/task.png',      '/tasks')
) AS t(name, icon, url);

-- Mes Apps (externes)

INSERT INTO apps (name, icon, url, category_id, mode, is_external)
SELECT name, icon, url,
       (SELECT id FROM categories WHERE name = 'Mes Apps' AND mode = 'Desktop'),
       'Desktop', TRUE
FROM (VALUES
  ('Mon Portfolio',  'https://mogglej.github.io/Portfolio_2026/favicon.ico', 'https://mogglej.github.io/Portfolio_2026/')
) AS t(name, icon, url);