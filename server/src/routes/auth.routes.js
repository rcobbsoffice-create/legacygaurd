import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { pool } from '../db.js';
import { verifyToken } from '../middleware/auth.js';

const router = Router();

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

router.post('/login', async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

  const { rows } = await pool.query('SELECT * FROM agents WHERE email = $1', [email.toLowerCase()]);
  const agent = rows[0];
  if (!agent) return res.status(401).json({ error: 'Invalid email or password.' });

  const ok = await bcrypt.compare(password, agent.password_hash);
  if (!ok) return res.status(401).json({ error: 'Invalid email or password.' });

  const token = jwt.sign(
    { id: agent.id, role: agent.role, initials: agent.initials, name: agent.name },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
  res.json({ token, agent: toSafeAgent(agent) });
});

router.get('/me', verifyToken, async (req, res) => {
  const { rows } = await pool.query('SELECT * FROM agents WHERE id = $1', [req.agent.id]);
  const agent = rows[0];
  if (!agent) return res.status(404).json({ error: 'Agent not found' });
  res.json(toSafeAgent(agent));
});

export default router;
