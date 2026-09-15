import { Router } from 'express';
import { pool } from '../db.js';
import { verifyToken } from '../middleware/auth.js';

const router = Router();
router.use(verifyToken);

function toClient(row, notes = []) {
  return {
    id: row.id,
    name: row.name,
    phone: row.phone,
    email: row.email,
    dob: row.dob,
    state: row.state,
    status: row.status,
    lines: row.lines,
    premium: row.premium,
    carrier: row.carrier,
    agentId: row.agent_id,
    createdAt: row.created_at,
    notes: notes.map(n => ({ text: n.text, author: n.author, date: n.created_at })),
  };
}

async function notesFor(clientId) {
  const { rows } = await pool.query(
    'SELECT * FROM client_notes WHERE client_id = $1 ORDER BY created_at DESC',
    [clientId]
  );
  return rows;
}

function genId() {
  return `c-${Date.now().toString(36)}`;
}

router.get('/', async (req, res) => {
  const isAdmin = req.agent.role === 'admin';
  const { rows } = await pool.query(
    isAdmin
      ? 'SELECT * FROM crm_clients ORDER BY created_at DESC'
      : 'SELECT * FROM crm_clients WHERE agent_id = $1 ORDER BY created_at DESC',
    isAdmin ? [] : [req.agent.id]
  );
  const clients = await Promise.all(rows.map(async (r) => toClient(r, await notesFor(r.id))));
  res.json(clients);
});

router.post('/', async (req, res) => {
  const c = req.body || {};
  const id = c.id || genId();
  const { rows } = await pool.query(
    `INSERT INTO crm_clients (id, name, phone, email, dob, state, status, lines, premium, carrier, agent_id)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
     RETURNING *`,
    [id, c.name, c.phone, c.email, c.dob || null, c.state || 'VA', c.status || 'Prospect', c.lines || [], c.premium || '', c.carrier || '', c.agentId || req.agent.id]
  );
  res.status(201).json(toClient(rows[0], []));
});

router.patch('/:id', async (req, res) => {
  const c = req.body || {};
  const { rows } = await pool.query(
    `UPDATE crm_clients SET
       name = COALESCE($2, name), phone = COALESCE($3, phone), email = COALESCE($4, email),
       dob = COALESCE($5, dob), state = COALESCE($6, state), status = COALESCE($7, status),
       lines = COALESCE($8, lines), premium = COALESCE($9, premium), carrier = COALESCE($10, carrier)
     WHERE id = $1 RETURNING *`,
    [req.params.id, c.name, c.phone, c.email, c.dob, c.state, c.status, c.lines, c.premium, c.carrier]
  );
  if (!rows[0]) return res.status(404).json({ error: 'Client not found' });
  res.json(toClient(rows[0], await notesFor(rows[0].id)));
});

router.delete('/:id', async (req, res) => {
  await pool.query('DELETE FROM crm_clients WHERE id = $1', [req.params.id]);
  res.status(204).end();
});

router.post('/:id/notes', async (req, res) => {
  const { text } = req.body || {};
  if (!text) return res.status(400).json({ error: 'text is required' });
  await pool.query(
    'INSERT INTO client_notes (client_id, text, author) VALUES ($1,$2,$3)',
    [req.params.id, text, req.agent.initials || req.agent.id]
  );
  const { rows } = await pool.query('SELECT * FROM crm_clients WHERE id = $1', [req.params.id]);
  if (!rows[0]) return res.status(404).json({ error: 'Client not found' });
  res.status(201).json(toClient(rows[0], await notesFor(req.params.id)));
});

export default router;
