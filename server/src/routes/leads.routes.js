import { Router } from 'express';
import { pool } from '../db.js';
import { verifyToken } from '../middleware/auth.js';

const router = Router();
const publicRouter = Router();

function toLead(row) {
  return {
    id: row.id,
    category: row.category,
    categoryLabel: row.category_label,
    name: row.name,
    phone: row.phone,
    email: row.email,
    state: row.state,
    details: row.details,
    estimatedRate: row.estimated_rate,
    preferredTime: row.preferred_time,
    source: row.source,
    submittedAt: row.submitted_at,
    score: row.score,
    status: row.status,
    campaignId: row.campaign_id,
    adId: row.ad_id,
    agentId: row.agent_id,
  };
}

function genId() {
  return `LEAD-${Math.floor(1000 + Math.random() * 9000)}`;
}

async function insertLead(l) {
  const id = l.id || genId();
  const { rows } = await pool.query(
    `INSERT INTO leads (id, category, category_label, name, phone, email, state, details, estimated_rate, preferred_time, source, score, status, campaign_id, ad_id, agent_id)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16)
     ON CONFLICT (id) DO NOTHING
     RETURNING *`,
    [id, l.category, l.categoryLabel, l.name, l.phone, l.email, l.state, l.details, l.estimatedRate, l.preferredTime, l.source, l.score || null, l.status || 'New', l.campaignId || null, l.adId || null, l.agentId || null]
  );
  return rows[0];
}

// Authenticated collection
router.get('/', verifyToken, async (req, res) => {
  const isAdmin = req.agent.role === 'admin';
  const { rows } = await pool.query(
    isAdmin
      ? 'SELECT * FROM leads ORDER BY submitted_at DESC'
      : 'SELECT * FROM leads WHERE agent_id = $1 OR agent_id IS NULL ORDER BY submitted_at DESC',
    isAdmin ? [] : [req.agent.id]
  );
  res.json(rows.map(toLead));
});

router.post('/', verifyToken, async (req, res) => {
  const row = await insertLead(req.body || {});
  res.status(201).json(row ? toLead(row) : null);
});

router.patch('/:id', verifyToken, async (req, res) => {
  const fields = req.body || {};
  const { rows } = await pool.query(
    `UPDATE leads SET status = COALESCE($2, status), agent_id = COALESCE($3, agent_id) WHERE id = $1 RETURNING *`,
    [req.params.id, fields.status || null, fields.agentId || null]
  );
  if (!rows[0]) return res.status(404).json({ error: 'Lead not found' });
  res.json(toLead(rows[0]));
});

router.delete('/:id', verifyToken, async (req, res) => {
  await pool.query('DELETE FROM leads WHERE id = $1', [req.params.id]);
  res.status(204).end();
});

// Public, unauthenticated — consumer funnel + autopilot submissions
publicRouter.post('/', async (req, res) => {
  const body = req.body || {};
  if (!body.name || !body.phone) return res.status(400).json({ error: 'name and phone are required' });
  const row = await insertLead(body);
  res.status(201).json(row ? toLead(row) : null);
});

export { publicRouter };
export default router;
