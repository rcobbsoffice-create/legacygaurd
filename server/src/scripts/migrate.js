import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { pool } from '../db.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const sql = readFileSync(join(__dirname, '../sql/schema.sql'), 'utf8');

try {
  await pool.query(sql);
  console.log('Migration complete.');
} finally {
  await pool.end();
}
