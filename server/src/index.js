import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes.js';
import leadsRoutes, { publicRouter as publicLeadsRoutes } from './routes/leads.routes.js';
import clientsRoutes from './routes/clients.routes.js';
import applicationsRoutes from './routes/applications.routes.js';
import marketplaceRoutes from './routes/marketplace.routes.js';
import agentsRoutes from './routes/agents.routes.js';

const app = express();

app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));
app.use(express.json());

app.get('/health', (req, res) => res.json({ ok: true }));

app.use('/api/auth', authRoutes);
app.use('/api/public/leads', publicLeadsRoutes);
app.use('/api/leads', leadsRoutes);
app.use('/api/clients', clientsRoutes);
app.use('/api/applications', applicationsRoutes);
app.use('/api/marketplace', marketplaceRoutes);
app.use('/api/agents', agentsRoutes);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`legacygaurd-server listening on :${port}`));
