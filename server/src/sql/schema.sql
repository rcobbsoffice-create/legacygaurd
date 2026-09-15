CREATE TABLE IF NOT EXISTS agents (
  id             TEXT PRIMARY KEY,
  name           TEXT NOT NULL,
  email          TEXT NOT NULL UNIQUE,
  password_hash  TEXT NOT NULL,
  role           TEXT NOT NULL CHECK (role IN ('admin', 'agent')),
  title          TEXT,
  initials       TEXT,
  phone          TEXT,
  color          TEXT,
  license_states TEXT[] DEFAULT '{}',
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS leads (
  id             TEXT PRIMARY KEY,
  category       TEXT NOT NULL,
  category_label TEXT,
  name           TEXT NOT NULL,
  phone          TEXT NOT NULL,
  email          TEXT,
  state          TEXT,
  details        TEXT,
  estimated_rate TEXT,
  preferred_time TEXT,
  source         TEXT,
  submitted_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  score          TEXT,
  status         TEXT NOT NULL DEFAULT 'New',
  campaign_id    TEXT,
  ad_id          TEXT,
  agent_id       TEXT REFERENCES agents(id) ON DELETE SET NULL,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS crm_clients (
  id          TEXT PRIMARY KEY,
  name        TEXT NOT NULL,
  phone       TEXT,
  email       TEXT,
  dob         DATE,
  state       TEXT,
  status      TEXT NOT NULL DEFAULT 'Prospect'
               CHECK (status IN ('Prospect','Active','Follow-Up','Lapsed','Do Not Call')),
  lines       TEXT[] DEFAULT '{}',
  premium     TEXT,
  carrier     TEXT,
  agent_id    TEXT REFERENCES agents(id) ON DELETE SET NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS client_notes (
  id         SERIAL PRIMARY KEY,
  client_id  TEXT NOT NULL REFERENCES crm_clients(id) ON DELETE CASCADE,
  text       TEXT NOT NULL,
  author     TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS applications (
  id             TEXT PRIMARY KEY,
  client_name    TEXT NOT NULL,
  carrier        TEXT,
  line           TEXT,
  product        TEXT,
  annual_premium TEXT,
  face_amount    TEXT,
  status         TEXT NOT NULL DEFAULT 'Submitted'
                  CHECK (status IN ('Submitted','Underwriting','Approved','Issued','Active','Declined')),
  submitted_date DATE,
  agent_id       TEXT REFERENCES agents(id) ON DELETE SET NULL,
  notes          TEXT,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS pricing_tiers (
  id    TEXT PRIMARY KEY,
  name  TEXT NOT NULL,
  leads INTEGER,
  price NUMERIC(10,2) NOT NULL,
  descr TEXT,
  sort_order INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS marketplace_services (
  id    TEXT PRIMARY KEY,
  name  TEXT NOT NULL,
  price NUMERIC(10,2) NOT NULL,
  type  TEXT,
  descr TEXT,
  sort_order INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS agent_purchases (
  id           SERIAL PRIMARY KEY,
  agent_id     TEXT NOT NULL REFERENCES agents(id) ON DELETE CASCADE,
  item_type    TEXT NOT NULL CHECK (item_type IN ('tier','service')),
  item_id      TEXT NOT NULL,
  purchased_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (agent_id, item_type, item_id)
);

CREATE INDEX IF NOT EXISTS idx_leads_agent_id        ON leads(agent_id);
CREATE INDEX IF NOT EXISTS idx_crm_clients_agent_id  ON crm_clients(agent_id);
CREATE INDEX IF NOT EXISTS idx_applications_agent_id ON applications(agent_id);
CREATE INDEX IF NOT EXISTS idx_client_notes_client_id ON client_notes(client_id);
