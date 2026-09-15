import { Router } from 'express';
import { pool } from '../db.js';
import { verifyToken, requireAdmin } from '../middleware/auth.js';

const router = Router();
router.use(verifyToken);

function toTier(row) {
  return { id: row.id, name: row.name, leads: row.leads, price: Number(row.price), desc: row.descr };
}
function toService(row) {
  return { id: row.id, name: row.name, price: Number(row.price), type: row.type, desc: row.descr };
}

router.get('/pricing', async (req, res) => {
  const [tiers, services] = await Promise.all([
    pool.query('SELECT * FROM pricing_tiers ORDER BY sort_order, price'),
    pool.query('SELECT * FROM marketplace_services ORDER BY sort_order, price'),
  ]);
  res.json({ tiers: tiers.rows.map(toTier), services: services.rows.map(toService) });
});

router.put('/pricing', requireAdmin, async (req, res) => {
  const { tiers = [], services = [] } = req.body || {};
  for (const t of tiers) {
    await pool.query(
      `INSERT INTO pricing_tiers (id, name, leads, price, descr) VALUES ($1,$2,$3,$4,$5)
       ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, leads = EXCLUDED.leads, price = EXCLUDED.price, descr = EXCLUDED.descr`,
      [t.id, t.name, t.leads, t.price, t.desc]
    );
  }
  for (const s of services) {
    await pool.query(
      `INSERT INTO marketplace_services (id, name, price, type, descr) VALUES ($1,$2,$3,$4,$5)
       ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, type = EXCLUDED.type, descr = EXCLUDED.descr`,
      [s.id, s.name, s.price, s.type, s.desc]
    );
  }
  res.status(204).end();
});

router.get('/purchases', async (req, res) => {
  const { rows } = await pool.query('SELECT * FROM agent_purchases WHERE agent_id = $1', [req.agent.id]);
  const tier = rows.find(r => r.item_type === 'tier')?.item_id || null;
  const services = rows.filter(r => r.item_type === 'service').map(r => r.item_id);
  res.json({ tier, services });
});

router.post('/purchases', async (req, res) => {
  const { itemType, itemId } = req.body || {};
  if (!['tier', 'service'].includes(itemType) || !itemId) {
    return res.status(400).json({ error: 'itemType (tier|service) and itemId required' });
  }
  if (itemType === 'tier') {
    await pool.query('DELETE FROM agent_purchases WHERE agent_id = $1 AND item_type = $2', [req.agent.id, 'tier']);
  }
  await pool.query(
    `INSERT INTO agent_purchases (agent_id, item_type, item_id) VALUES ($1,$2,$3)
     ON CONFLICT (agent_id, item_type, item_id) DO NOTHING`,
    [req.agent.id, itemType, itemId]
  );
  const { rows } = await pool.query('SELECT * FROM agent_purchases WHERE agent_id = $1', [req.agent.id]);
  const tier = rows.find(r => r.item_type === 'tier')?.item_id || null;
  const services = rows.filter(r => r.item_type === 'service').map(r => r.item_id);
  res.status(201).json({ tier, services });
});

export default router;
