import { Router } from 'express';
import { pool } from '../db.js';
import { verifyToken } from '../middleware/auth.js';

const router = Router();
router.use(verifyToken);

function toApp(row) {
  return {
    id: row.id,
    clientName: row.client_name,
    carrier: row.carrier,
    line: row.line,
    product: row.product,
    annualPremium: row.annual_premium,
    faceAmount: row.face_amount,
    status: row.status,
    submittedDate: row.submitted_date,
    agentId: row.agent_id,
    notes: row.notes,
  };
}

function genId() {
  return `app-${Date.now().toString(36)}`;
}

router.get('/', async (req, res) => {
  const isAdmin = req.agent.role === 'admin';
  const { rows } = await pool.query(
    isAdmin
      ? 'SELECT * FROM applications ORDER BY created_at DESC'
      : 'SELECT * FROM applications WHERE agent_id = $1 ORDER BY created_at DESC',
    isAdmin ? [] : [req.agent.id]
  );
  res.json(rows.map(toApp));
});

router.post('/', async (req, res) => {
  const a = req.body || {};
  const id = a.id || genId();
  const { rows } = await pool.query(
    `INSERT INTO applications (id, client_name, carrier, line, product, annual_premium, face_amount, status, submitted_date, agent_id, notes)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
     RETURNING *`,
    [id, a.clientName, a.carrier, a.line, a.product, a.annualPremium, a.faceAmount, a.status || 'Submitted', a.submittedDate || new Date().toISOString().slice(0, 10), a.agentId || req.agent.id, a.notes || '']
  );
  res.status(201).json(toApp(rows[0]));
});

router.patch('/:id', async (req, res) => {
  const a = req.body || {};
  const { rows } = await pool.query(
    `UPDATE applications SET
       client_name = COALESCE($2, client_name), carrier = COALESCE($3, carrier), line = COALESCE($4, line),
       product = COALESCE($5, product), annual_premium = COALESCE($6, annual_premium),
       face_amount = COALESCE($7, face_amount), status = COALESCE($8, status), notes = COALESCE($9, notes)
     WHERE id = $1 RETURNING *`,
    [req.params.id, a.clientName, a.carrier, a.line, a.product, a.annualPremium, a.faceAmount, a.status, a.notes]
  );
  if (!rows[0]) return res.status(404).json({ error: 'Application not found' });
  res.json(toApp(rows[0]));
});

export default router;
