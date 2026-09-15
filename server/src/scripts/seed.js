import bcrypt from 'bcryptjs';
import { pool } from '../db.js';

const AGENTS = [
  { id: 'agent-001', name: 'Lawrence Poole', email: 'lawrence@lp2nsure.com', password: 'LPAdmin2024', role: 'admin', title: 'Owner & Licensed Agent', initials: 'LP', phone: '(757) 449-6463', color: 'amber', licenseStates: ['VA', 'NC', 'FL', 'GA', 'OH', 'PA', 'TH'] },
  { id: 'agent-002', name: 'Marcus Williams', email: 'marcus@lp2nsure.com', password: 'Agent123', role: 'agent', title: 'Licensed Agent', initials: 'MW', phone: '(757) 555-0201', color: 'emerald', licenseStates: ['VA', 'NC'] },
  { id: 'agent-003', name: 'Tanya Brooks', email: 'tanya@lp2nsure.com', password: 'Agent123', role: 'agent', title: 'Licensed Agent', initials: 'TB', phone: '(757) 555-0302', color: 'blue', licenseStates: ['VA'] },
];

const LEADS = [
  { id: 'LEAD-9104', category: 'annuity', categoryLabel: 'Annuity & Rollover', name: 'Arthur Pendelton', phone: '(757) 555-4920', email: 'art.pendelton@gmail.com', state: 'VA', details: '401(k) Rollover: $250,000 • Goal: Guaranteed Income', estimatedRate: '$1,250 - $1,800/mo income', preferredTime: 'Morning (9am - 12pm)', source: 'Meta Ad - 401(k) Protection', score: 'HIGH TICKET ($250k)', status: 'New', agentId: 'agent-001' },
  { id: 'LEAD-9101', category: 'auto', categoryLabel: 'Auto Insurance', name: 'Melissa Richardson', phone: '(757) 555-8831', email: 'mrichardson77@yahoo.com', state: 'VA', details: '2 Vehicles • Current Carrier: Geico • Clean Record', estimatedRate: '$92 - $130/mo', preferredTime: 'Afternoon (12pm - 4pm)', source: 'Meta Ad - Auto Relief', score: 'High Intent (95%)', status: 'New', agentId: 'agent-002' },
  { id: 'LEAD-9098', category: 'life', categoryLabel: 'Senior Life & Final Expense', name: 'Dorothy Vance', phone: '(757) 555-8912', email: 'dvance64@gmail.com', state: 'VA', details: 'Age 67 • $15,000 Benefit • Non-Smoker', estimatedRate: '$34.50 - $48.20/mo', preferredTime: 'Morning (9am - 12pm)', source: 'Meta Ad - Burial Protection', score: 'High Intent (98%)', status: 'Contacted', agentId: 'agent-001' },
  { id: 'LEAD-9092', category: 'home', categoryLabel: 'Homeowners Insurance', name: 'Gregory Stephens', phone: '(757) 555-3104', email: 'gstephens_va@aol.com', state: 'VA', details: 'Single Family Home • $380,000 Rebuild • Want Auto Bundle', estimatedRate: '$70 - $105/mo', preferredTime: 'Evening (4pm - 7pm)', source: 'Google Search - Home Insurance', score: 'Bundle Prospect', status: 'Appt Set', agentId: 'agent-001' },
  { id: 'LEAD-9086', category: 'medicare', categoryLabel: 'Medicare Supplement', name: 'Barbara Watson', phone: '(757) 555-7729', email: 'bwatson_med@gmail.com', state: 'VA', details: 'Turning 65 in 2 months • Enrolled in Part A/B', estimatedRate: '$0 - $35/mo', preferredTime: 'Morning (9am - 12pm)', source: 'Meta Ad - Medicare Review', score: 'Closed Policy ($1,480 APV)', status: 'Closed', agentId: 'agent-001' },
];

const CLIENTS = [
  { id: 'c-001', name: 'Dorothy Vance', phone: '(757) 555-8912', email: 'dvance64@gmail.com', dob: '1957-04-12', state: 'VA', status: 'Active', lines: ['life'], premium: '$34.50/mo', carrier: 'Mutual of Omaha', agentId: 'agent-001', notes: [{ text: 'Prefers morning calls. Enrolled Nov 2024.', author: 'LP' }] },
  { id: 'c-002', name: 'Gregory Stephens', phone: '(757) 555-3104', email: 'gstephens_va@aol.com', dob: '1968-09-03', state: 'VA', status: 'Active', lines: ['home', 'auto'], premium: '$158/mo', carrier: 'Travelers', agentId: 'agent-001', notes: [{ text: 'Bundle discount applied. Renewal March 2026.', author: 'LP' }] },
  { id: 'c-003', name: 'Barbara Watson', phone: '(757) 555-7729', email: 'bwatson_med@gmail.com', dob: '1959-11-20', state: 'VA', status: 'Active', lines: ['medicare', 'life'], premium: '$29.50/mo', carrier: 'Aetna', agentId: 'agent-001', notes: [{ text: 'Part G Supplement. Very happy with plan.', author: 'LP' }] },
  { id: 'c-004', name: 'Arthur Pendelton', phone: '(757) 555-4920', email: 'art.pendelton@gmail.com', dob: '1952-02-28', state: 'VA', status: 'Prospect', lines: ['annuity'], premium: '', carrier: '', agentId: 'agent-002', notes: [{ text: '$250k 401k rollover. Needs comparison quote.', author: 'MW' }] },
  { id: 'c-005', name: 'Melissa Richardson', phone: '(757) 555-8831', email: 'mrichardson77@yahoo.com', dob: '1977-06-15', state: 'VA', status: 'Follow-Up', lines: ['auto'], premium: '', carrier: '', agentId: 'agent-002', notes: [{ text: 'Left voicemail. Try again Thursday PM.', author: 'MW' }] },
];

const APPLICATIONS = [
  { id: 'app-001', clientName: 'Dorothy Vance', carrier: 'Mutual of Omaha', line: 'life', product: 'Simplified Issue Whole Life', annualPremium: '$414', status: 'Active', submittedDate: '2024-11-10', agentId: 'agent-001', faceAmount: '$15,000', notes: 'Day 1 coverage. No exam.' },
  { id: 'app-002', clientName: 'Gregory Stephens', carrier: 'Travelers', line: 'home', product: 'HO-3 Homeowners + Auto Bundle', annualPremium: '$1,896', status: 'Active', submittedDate: '2025-03-01', agentId: 'agent-001', faceAmount: '$380,000', notes: 'Bundle discount applied.' },
  { id: 'app-003', clientName: 'Barbara Watson', carrier: 'Aetna', line: 'medicare', product: 'Plan G Medigap Supplement', annualPremium: '$354', status: 'Active', submittedDate: '2025-01-15', agentId: 'agent-001', faceAmount: 'N/A', notes: 'OEP enrollment. Part A/B verified.' },
  { id: 'app-004', clientName: 'Arthur Pendelton', carrier: 'North American', line: 'annuity', product: 'Fixed Index Annuity', annualPremium: '$0 (lump sum $250k)', status: 'Underwriting', submittedDate: '2026-07-20', agentId: 'agent-002', faceAmount: '$250,000', notes: 'Pending suitability review.' },
  { id: 'app-005', clientName: 'Melissa Richardson', carrier: 'Progressive', line: 'auto', product: 'Multi-Vehicle Comprehensive', annualPremium: '$1,104', status: 'Submitted', submittedDate: '2026-07-21', agentId: 'agent-002', faceAmount: 'N/A', notes: '2 vehicles. Awaiting MVR.' },
];

const PRICING_TIERS = [
  { id: 'tier_starter', name: 'Starter Tier', leads: 10, price: 199, descr: 'Perfect for part-time agents.' },
  { id: 'tier_pro', name: 'Pro Tier', leads: 30, price: 499, descr: 'Our most popular package for full-time agents.' },
  { id: 'tier_elite', name: 'Elite Tier', leads: 50, price: 799, descr: 'Maximum volume for agency builders.' },
];

const SERVICES = [
  { id: 'srv_website', name: 'Custom Website Funnel', price: 299, type: 'one-time', descr: 'A dedicated landing page identical to this one, branded to you.' },
  { id: 'srv_business_card', name: 'Digital Business Card', price: 49, type: 'one-time', descr: 'NFC-enabled smart business card with tap-to-save.' },
  { id: 'srv_print_cards', name: 'Print Business Cards (500)', price: 99, type: 'one-time', descr: 'Premium thick cardstock, shipped to your door.' },
];

async function seedAgents() {
  for (const a of AGENTS) {
    const hash = await bcrypt.hash(a.password, 10);
    await pool.query(
      `INSERT INTO agents (id, name, email, password_hash, role, title, initials, phone, color, license_states)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
       ON CONFLICT (id) DO UPDATE SET password_hash = EXCLUDED.password_hash`,
      [a.id, a.name, a.email, hash, a.role, a.title, a.initials, a.phone, a.color, a.licenseStates]
    );
  }
}

async function seedLeads() {
  for (const l of LEADS) {
    await pool.query(
      `INSERT INTO leads (id, category, category_label, name, phone, email, state, details, estimated_rate, preferred_time, source, score, status, agent_id)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)
       ON CONFLICT (id) DO NOTHING`,
      [l.id, l.category, l.categoryLabel, l.name, l.phone, l.email, l.state, l.details, l.estimatedRate, l.preferredTime, l.source, l.score, l.status, l.agentId]
    );
  }
}

async function seedClients() {
  for (const c of CLIENTS) {
    await pool.query(
      `INSERT INTO crm_clients (id, name, phone, email, dob, state, status, lines, premium, carrier, agent_id)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
       ON CONFLICT (id) DO NOTHING`,
      [c.id, c.name, c.phone, c.email, c.dob, c.state, c.status, c.lines, c.premium, c.carrier, c.agentId]
    );
    for (const n of c.notes) {
      await pool.query(
        `INSERT INTO client_notes (client_id, text, author) VALUES ($1,$2,$3)`,
        [c.id, n.text, n.author]
      );
    }
  }
}

async function seedApplications() {
  for (const a of APPLICATIONS) {
    await pool.query(
      `INSERT INTO applications (id, client_name, carrier, line, product, annual_premium, face_amount, status, submitted_date, agent_id, notes)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
       ON CONFLICT (id) DO NOTHING`,
      [a.id, a.clientName, a.carrier, a.line, a.product, a.annualPremium, a.faceAmount, a.status, a.submittedDate, a.agentId, a.notes]
    );
  }
}

async function seedMarketplace() {
  for (const t of PRICING_TIERS) {
    await pool.query(
      `INSERT INTO pricing_tiers (id, name, leads, price, descr) VALUES ($1,$2,$3,$4,$5)
       ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, leads = EXCLUDED.leads, price = EXCLUDED.price, descr = EXCLUDED.descr`,
      [t.id, t.name, t.leads, t.price, t.descr]
    );
  }
  for (const s of SERVICES) {
    await pool.query(
      `INSERT INTO marketplace_services (id, name, price, type, descr) VALUES ($1,$2,$3,$4,$5)
       ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, type = EXCLUDED.type, descr = EXCLUDED.descr`,
      [s.id, s.name, s.price, s.type, s.descr]
    );
  }
}

try {
  await seedAgents();
  await seedLeads();
  await seedClients();
  await seedApplications();
  await seedMarketplace();
  console.log('Seed complete.');
} finally {
  await pool.end();
}
