import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { pool } from '../db.js';
import { verifyToken, requireAdmin } from '../middleware/auth.js';

const router = Router();
router.use(verifyToken, requireAdmin);

function toSafeAgent(row) {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    role: row.role,
    title: row.title,
    initials: row.initials,
    phone: row.phone,
    color: row.color,
    licenseStates: row.license_states,
  };
}

router.get('/', async (req, res) => {
  const { rows } = await pool.query('SELECT * FROM agents ORDER BY created_at');
  res.json(rows.map(toSafeAgent));
});

router.post('/', async (req, res) => {
  const a = req.body || {};
  if (!a.id || !a.email || !a.password) return res.status(400).json({ error: 'id, email, password required' });
  const hash = await bcrypt.hash(a.password, 10);
  const { rows } = await pool.query(
    `INSERT INTO agents (id, name, email, password_hash, role, title, initials, phone, color, license_states)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`,
    [a.id, a.name, a.email.toLowerCase(), hash, a.role || 'agent', a.title, a.initials, a.phone, a.color, a.licenseStates || []]
  );
  res.status(201).json(toSafeAgent(rows[0]));
});

export default router;
